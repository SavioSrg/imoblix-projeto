import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItemProps {
  label: string;
  done: boolean;
  helper?: string;
}

export function ChecklistItem({ label, done, helper }: ChecklistItemProps) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          done ? "bg-success/15 text-success" : "bg-warning/15 text-warning",
        )}
      >
        {done ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      </span>
      <div className="min-w-0">
        <p
          className={cn(
            "text-sm font-medium",
            done ? "text-foreground" : "text-foreground",
          )}
        >
          {label}
        </p>
        {helper && <p className="mt-0.5 text-xs text-muted-foreground">{helper}</p>}
      </div>
    </li>
  );
}
