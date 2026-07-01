import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  icon?: LucideIcon;
  title: string;
  children: ReactNode;
  tone?: "default" | "info" | "warning" | "success";
  className?: string;
}

export function InfoCard({ icon: Icon, title, children, tone = "default", className }: InfoCardProps) {
  const toneCls = {
    default: "border-border bg-card",
    info: "border-primary/20 bg-primary-soft/60",
    warning: "border-warning/30 bg-warning/10",
    success: "border-success/30 bg-success/10",
  }[tone];

  const iconCls = {
    default: "bg-muted text-muted-foreground",
    info: "bg-primary text-primary-foreground",
    warning: "bg-warning text-warning-foreground",
    success: "bg-success text-success-foreground",
  }[tone];

  return (
    <div className={cn("rounded-2xl border p-5 shadow-soft", toneCls, className)}>
      <div className="flex items-start gap-3">
        {Icon && (
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", iconCls)}>
            <Icon className="h-4 w-4" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <div className="mt-1 text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}
