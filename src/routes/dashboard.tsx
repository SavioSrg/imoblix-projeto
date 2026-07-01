import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CheckCircle2,
  Circle,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useWizard } from "@/contexts/WizardContext";
import { formatAnswerValue, humanizeAnswerKey } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Meu processo — Imoblix" },
      {
        name: "description",
        content:
          "Acompanhe o andamento do seu processo no Cartório de Registro de Imóveis.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { flow, answers, currentStepIndex, progress, status, startedAt } =
    useWizard();

  const totalSteps = flow?.steps.length ?? 0;
  const nextStep = flow?.steps[Math.min(currentStepIndex + 1, totalSteps - 1)];

  if (!flow) {
    return (
      <PageContainer>
        <EmptyDashboard />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Meu processo
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {flow.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {startedAt && (
              <>
                Iniciado em{" "}
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "long",
                  timeStyle: "short",
                }).format(new Date(startedAt))}
              </>
            )}
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <LayoutDashboard className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Timeline */}
        <Card className="rounded-3xl border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              Progresso da jornada
            </p>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                status === "completed"
                  ? "bg-success/15 text-success"
                  : "bg-primary-soft text-primary",
              )}
            >
              {status === "completed" ? "Concluído" : "Em andamento"}
            </span>
          </div>
          <Progress value={progress} className="mt-3 h-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            {progress}% — etapa {currentStepIndex + 1} de {totalSteps}
          </p>

          <ol className="mt-6 space-y-3">
            {flow.steps.map((s, i) => {
              const done = i < currentStepIndex || status === "completed";
              const active = i === currentStepIndex && status !== "completed";
              return (
                <li
                  key={s.id}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3",
                    active
                      ? "border-primary bg-primary-soft/40"
                      : "border-border bg-card",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      done
                        ? "bg-success text-success-foreground"
                        : active
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-background text-muted-foreground",
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Circle className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {s.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {done
                        ? "Concluída"
                        : active
                          ? "Etapa atual"
                          : "Aguardando"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {nextStep && status !== "completed" && (
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-primary/20 bg-primary-soft p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Próxima etapa
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {nextStep.label}
                </p>
              </div>
              <Button size="sm" asChild>
                <Link to="/fluxo/comprar-vender">
                  Continuar <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </Card>

        {/* Documents / answers */}
        <div className="space-y-6">
          <Card className="rounded-3xl border border-border p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <FileText className="h-4 w-4" />
              </span>
              <p className="text-sm font-semibold text-foreground">
                Informações fornecidas
              </p>
            </div>
            {Object.keys(answers).length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Você ainda não respondeu nenhuma etapa.
              </p>
            ) : (
              <dl className="space-y-3">
                {Object.entries(answers).map(([k, v]) => (
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
          </Card>

          <Card className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-soft to-background p-6 shadow-soft">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
              <Sparkles className="h-3 w-3" />
              Dica
            </span>
            <p className="mt-3 text-sm font-medium text-foreground">
              Dúvida em alguma etapa?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Nossa Central de Ajuda te leva direto para o fluxo certo em
              poucas perguntas.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to="/ajuda">
                Abrir assistente <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function EmptyDashboard() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-muted/40 p-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <LayoutDashboard className="h-6 w-6" />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Nenhum processo iniciado
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Assim que você começar um assistente, o andamento aparecerá aqui — com
        etapas, documentos informados e próximos passos.
      </p>
      <Button asChild className="mt-6" size="lg">
        <Link to="/">
          Iniciar um processo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
