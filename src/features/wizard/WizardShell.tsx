import type { ReactNode } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useWizard } from "@/contexts/WizardContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AnswersSummary } from "./AnswersSummary";

interface WizardShellProps {
  children: ReactNode;
  onBack?: () => void;
  hideSummary?: boolean;
  eyebrow?: string;
  title: string;
  description?: string;
}

export function WizardShell({
  children,
  onBack,
  hideSummary,
  eyebrow,
  title,
  description,
}: WizardShellProps) {
  const { flow, currentStepIndex, progress, back, isFirstStep } = useWizard();

  const handleBack = () => {
    if (onBack) return onBack();
    if (!isFirstStep) back();
    else window.history.back();
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0">
        {/* Progress + Stepper */}
        {flow && (
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span className="uppercase tracking-wide">{flow.title}</span>
              <span>
                Etapa {currentStepIndex + 1} de {flow.steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <ol className="mt-4 flex flex-wrap gap-1.5">
              {flow.steps.map((s, i) => {
                const done = i < currentStepIndex;
                const active = i === currentStepIndex;
                return (
                  <li
                    key={s.id}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                      active && "bg-primary-soft text-primary",
                      done && "bg-success/15 text-success",
                      !active && !done && "bg-muted text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-full text-[10px]",
                        active && "bg-primary text-primary-foreground",
                        done && "bg-success text-success-foreground",
                        !active && !done && "bg-background text-muted-foreground border border-border",
                      )}
                    >
                      {done ? <Check className="h-2.5 w-2.5" /> : i + 1}
                    </span>
                    {s.label}
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                {eyebrow}
              </p>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                {description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleBack} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        {/* Step content */}
        <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          {children}
        </div>
      </div>

      {/* Resumo lateral */}
      {!hideSummary && (
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <AnswersSummary />
          </div>
        </aside>
      )}
    </div>
  );
}
