import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PageContainer({ children, className, size = "md" }: PageContainerProps) {
  const max =
    size === "sm" ? "max-w-2xl" : size === "lg" ? "max-w-6xl" : "max-w-4xl";
  return (
    <div className={cn("mx-auto w-full px-4 py-8 sm:px-6 sm:py-10", max, className)}>
      {children}
    </div>
  );
}
