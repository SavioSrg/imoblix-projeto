import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  as?: "button" | "div";
  className?: string;
  badge?: string;
  large?: boolean;
}

export function OptionCard({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
  as = "button",
  className,
  badge,
  large,
}: OptionCardProps) {
  const Comp: React.ElementType = as;
  return (
    <Comp
      type={as === "button" ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-start gap-4 rounded-2xl border-2 bg-card p-5 text-left shadow-soft transition-all",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
        selected
          ? "border-primary bg-primary-soft/50"
          : "border-border",
        large && "p-6 sm:p-7",
        className,
      )}
    >
      {Icon && (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl transition-colors",
            large ? "h-12 w-12" : "h-11 w-11",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground",
          )}
        >
          <Icon className={cn(large ? "h-6 w-6" : "h-5 w-5")} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        {badge && (
          <span className="mb-1 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
            {badge}
          </span>
        )}
        <p
          className={cn(
            "font-semibold text-foreground",
            large ? "text-lg" : "text-base",
          )}
        >
          {title}
        </p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {selected && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3.5 w-3.5" />
        </span>
      )}
    </Comp>
  );
}
