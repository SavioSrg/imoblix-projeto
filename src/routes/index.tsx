import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Home as HomeIcon,
  FileText,
  RefreshCcw,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { OptionCard } from "@/components/common/OptionCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Imoblix — Como podemos ajudar você?" },
      {
        name: "description",
        content:
          "Descubra em minutos qual procedimento realizar no Cartório de Registro de Imóveis. Compra, venda, certidões, financiamento, FGTS e devolutivas.",
      },
    ],
  }),
  component: Home,
});

const OPTIONS = [
  {
    icon: HomeIcon,
    title: "Comprar ou vender um imóvel",
    description: "Escritura, financiamento ou FGTS. Guiamos você em cada etapa.",
    to: "/fluxo/comprar-vender",
    badge: "Mais comum",
  },
  {
    icon: FileText,
    title: "Certidão de imóvel",
    description: "Solicite Inteiro Teor, Ônus, Quitação e mais. Prazos e preços na hora.",
    to: "/fluxo/certidao",
  },
  {
    icon: RefreshCcw,
    title: "Atualizar matrícula",
    description: "Averbações e retificações — em breve neste MVP.",
    to: "/ajuda",
  },
  {
    icon: AlertTriangle,
    title: "Recebi uma devolutiva",
    description: "Entenda o que o cartório está pedindo e como resolver.",
    to: "/fluxo/devolutiva",
  },
  {
    icon: HelpCircle,
    title: "Não sei o que preciso fazer",
    description: "Responda algumas perguntas rápidas e chegamos ao fluxo certo.",
    to: "/ajuda",
    badge: "Assistente",
  },
];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-primary-soft/60 via-background to-background">
        <div className="mx-auto max-w-4xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/60 px-3 py-1 text-xs font-medium text-primary shadow-soft backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Assistente inteligente
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Como podemos ajudar você?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            O Imoblix orienta cidadãos passo a passo em qualquer procedimento junto
            ao Cartório de Registro de Imóveis. Sem burocracia, sem juridiquês.
          </p>
        </div>
      </section>

      <PageContainer size="lg" className="-mt-6">
        <div className="grid gap-4 md:grid-cols-2">
          {OPTIONS.map((opt) => (
            <Link key={opt.to + opt.title} to={opt.to} className="block">
              <OptionCard
                icon={opt.icon}
                title={opt.title}
                description={opt.description}
                badge={opt.badge}
                large
                as="div"
              />
            </Link>
          ))}
        </div>

        {/* Trust row */}
        <div className="mt-14 grid gap-6 rounded-3xl border border-border bg-muted/40 p-8 sm:grid-cols-3">
          <Feature
            icon={<Clock className="h-5 w-5" />}
            title="Rápido"
            desc="Descubra o que fazer em menos de 3 minutos, sem depender de fila."
          />
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Seguro"
            desc="Baseado nas regras oficiais dos cartórios de RI brasileiros."
          />
          <Feature
            icon={<Sparkles className="h-5 w-5" />}
            title="Guiado"
            desc="Wizard passo a passo com resumo das respostas em tempo real."
          />
        </div>

        {/* Central de ajuda CTA */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/20 bg-primary-soft p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-primary">Central de Ajuda</p>
            <p className="mt-1 text-sm text-foreground">
              Não sabe por onde começar? Responda 2 perguntas rápidas.
            </p>
          </div>
          <Button asChild>
            <Link to="/ajuda">
              Abrir assistente
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </PageContainer>
    </>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        {icon}
      </span>
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
