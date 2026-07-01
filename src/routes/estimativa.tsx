import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { AlertCircle, ArrowRight, Calculator, RotateCcw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { InfoCard } from "@/components/common/InfoCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWizard } from "@/contexts/WizardContext";
import { estimate } from "@/services/EstimateService";
import { formatCurrencyBRL } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/estimativa")({
  head: () => ({
    meta: [
      { title: "Estimativa de custos — Imoblix" },
      {
        name: "description",
        content:
          "Estimativa dos custos de registro imobiliário com base nas suas respostas. Emolumentos, ITBI e descontos legais.",
      },
    ],
  }),
  component: EstimativaPage,
});

function EstimativaPage() {
  const navigate = useNavigate();
  const { answers, flow } = useWizard();

  const result = useMemo(() => estimate(answers), [answers]);
  const hasContext = flow !== null;

  return (
    <PageContainer>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Estimativa
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Custo estimado do seu registro
          </h1>
          <p className="mt-2 text-muted-foreground">
            Com base nas informações que você forneceu, este é o valor
            aproximado dos custos cartorários.
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Calculator className="h-5 w-5" />
        </span>
      </div>

      {!hasContext && (
        <InfoCard icon={AlertCircle} title="Sem contexto de fluxo" tone="warning" className="mt-6">
          Você abriu esta página sem passar pelo assistente. Volte ao início
          para receber uma estimativa personalizada.
        </InfoCard>
      )}

      <Card className="mt-6 overflow-hidden rounded-3xl border border-border p-0 shadow-elevated">
        <div className="bg-primary p-6 text-primary-foreground">
          <p className="text-xs uppercase tracking-wider opacity-80">Total estimado</p>
          <p className="mt-1 text-4xl font-bold tabular-nums">
            {formatCurrencyBRL(result.totalCents / 100)}
          </p>
        </div>
        <ul className="divide-y divide-border">
          {result.lines.map((l, i) => {
            const isDiscount = l.valueCents < 0;
            return (
              <li key={i} className="flex items-start justify-between gap-4 p-5">
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    isDiscount ? "text-success" : "text-foreground",
                  )}>
                    {l.label}
                  </p>
                  {l.helper && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{l.helper}</p>
                  )}
                </div>
                <p className={cn(
                  "shrink-0 text-sm font-semibold tabular-nums",
                  isDiscount ? "text-success" : "text-foreground",
                )}>
                  {isDiscount ? "− " : ""}
                  {formatCurrencyBRL(Math.abs(l.valueCents) / 100)}
                </p>
              </li>
            );
          })}
        </ul>
      </Card>

      <InfoCard icon={AlertCircle} title="Aviso importante" tone="warning" className="mt-6">
        {result.disclaimer}
      </InfoCard>

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={() => navigate({ to: "/" })}>
          <RotateCcw className="h-4 w-4" />
          Recomeçar
        </Button>
        <Button size="lg" onClick={() => navigate({ to: "/atendimento" })}>
          Continuar
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </PageContainer>
  );
}
