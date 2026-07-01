import { ClipboardList } from "lucide-react";
import { useWizard } from "@/contexts/WizardContext";
import { Card } from "@/components/ui/card";
import { formatAnswerValue, humanizeAnswerKey } from "@/utils/format";

export function AnswersSummary() {
  const { flow, answers, currentStepIndex } = useWizard();

  const entries = Object.entries(answers).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );

  return (
    <Card className="p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <ClipboardList className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">Suas respostas</p>
          <p className="text-[11px] text-muted-foreground">
            {flow ? flow.title : "Nenhum processo iniciado"}
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          As respostas aparecerão aqui à medida que você avançar no assistente.
        </p>
      ) : (
        <dl className="space-y-3">
          {entries.map(([k, v]) => (
            <div key={k} className="text-sm">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {humanizeAnswerKey(k)}
              </dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {formatAnswerValue(v)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {flow && (
        <p className="mt-5 border-t border-border pt-3 text-[11px] text-muted-foreground">
          Etapa atual: <span className="font-medium text-foreground">
            {flow.steps[currentStepIndex]?.label}
          </span>
        </p>
      )}
    </Card>
  );
}
