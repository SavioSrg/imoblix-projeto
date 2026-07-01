import { forwardRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { maskCurrencyBRL, parseCurrencyBRL } from "@/utils/format";
import { cn } from "@/lib/utils";

interface MoneyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  onBlur?: () => void;
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  { value, onChange, placeholder = "R$ 0,00", className, id, name, disabled, onBlur },
  ref,
) {
  const [display, setDisplay] = useState(() =>
    typeof value === "number" && value > 0 ? maskCurrencyBRL(value) : "",
  );

  useEffect(() => {
    if (typeof value === "number") {
      const masked = value > 0 ? maskCurrencyBRL(value) : "";
      if (masked !== display) setDisplay(masked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Input
      ref={ref}
      id={id}
      name={name}
      inputMode="numeric"
      placeholder={placeholder}
      disabled={disabled}
      onBlur={onBlur}
      value={display}
      onChange={(e) => {
        const parsed = parseCurrencyBRL(e.target.value);
        setDisplay(parsed ? maskCurrencyBRL(parsed) : "");
        onChange?.(parsed);
      }}
      className={cn("h-11 text-base font-medium", className)}
    />
  );
});
