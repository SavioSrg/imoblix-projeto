import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { InfoCard } from "@/components/common/InfoCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/fluxo/devolutiva")({
  head: () => ({
    meta: [
      { title: "Recebi uma devolutiva — Imoblix" },
      {
        name: "description",
        content:
          "Entenda o que significa uma devolutiva do Cartório de Registro de Imóveis e como resolver as exigências.",
      },
    ],
  }),
  component: DevolutivaPage,
});

const CAUSAS = [
  {
    title: "Documentos incompletos ou desatualizados",
    desc: "Certidões vencidas (validade de 30 dias), falta de reconhecimento de firma ou anexos ausentes.",
  },
  {
    title: "Divergências no cadastro",
    desc: "Nome do proprietário, CPF, estado civil ou descrição do imóvel divergindo entre matrícula e documentos.",
  },
  {
    title: "ITBI não quitado",
    desc: "Guia municipal vencida, valor incorreto ou não apresentada.",
  },
  {
    title: "Averbações pendentes",
    desc: "Construção não averbada, mudança de estado civil, retificação de área.",
  },
];

function DevolutivaPage() {
  return (
    <PageContainer>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-warning-foreground/80">
          Devolutiva
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          Você recebeu uma devolutiva do cartório?
        </h1>
        <p className="mt-2 text-muted-foreground">
          Devolutiva é uma nota de exigência: o oficial identificou algo que
          impede o registro e listou o que precisa ser ajustado. Não é um
          "não" — é um "ainda não".
        </p>
      </div>

      <InfoCard icon={AlertTriangle} title="Prazo para atender" tone="warning" className="mt-6">
        O prazo padrão para atender uma devolutiva é de <strong>30 dias</strong>. Após esse
        período, o processo é arquivado e você precisará dar entrada novamente,
        pagando novos emolumentos.
      </InfoCard>

      <h2 className="mt-8 text-lg font-semibold text-foreground">
        Causas mais comuns
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {CAUSAS.map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-sm font-semibold text-foreground">{c.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-soft to-background p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Ajuda Premium
            </span>
            <h3 className="mt-3 text-xl font-bold text-foreground">
              Precisa de ajuda especializada para resolver a devolutiva?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Nossa equipe analisa sua nota de exigência, orienta sobre cada
              item e te ajuda a preparar a resposta correta ao cartório.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link to="/premium">
              Quero ajuda especializada
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
