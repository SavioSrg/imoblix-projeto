import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { OptionCard } from "@/components/common/OptionCard";
import { Button } from "@/components/ui/button";
import { INTENT_TREE } from "@/data/intencoes";

export const Route = createFileRoute("/ajuda")({
  head: () => ({
    meta: [
      { title: "Central de Ajuda — Imoblix" },
      {
        name: "description",
        content:
          "Responda algumas perguntas rápidas e o Imoblix te leva direto ao fluxo correto para seu caso no Registro de Imóveis.",
      },
    ],
  }),
  component: Ajuda,
});

function Ajuda() {
  const navigate = useNavigate();
  const [path, setPath] = useState<string[]>(["start"]);
  const current = INTENT_TREE[path[path.length - 1]];

  const handleSelect = (optionId: string) => {
    const opt = current.options.find((o) => o.id === optionId);
    if (!opt) return;
    const outcome = opt.outcome;
    if (outcome.kind === "route") {
      navigate({ to: outcome.to });
    } else {
      const nextId = outcome.questionId;
      setPath((p) => [...p, nextId]);
    }
  };

  const goBack = () => {
    if (path.length <= 1) return;
    setPath((p) => p.slice(0, -1));
  };

  return (
    <PageContainer size="md">
      <div className="mb-6 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Assistente Central de Ajuda
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={path.length <= 1}
          onClick={goBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {current.title}
        </h1>
        {current.description && (
          <p className="mt-3 text-muted-foreground">{current.description}</p>
        )}

        <div className="mt-8 grid gap-3">
          {current.options.map((o) => (
            <OptionCard
              key={o.id}
              title={o.label}
              onClick={() => handleSelect(o.id)}
            />
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
          <ArrowRight className="mr-1 inline h-3.5 w-3.5" />
          Cada resposta te leva direto ao fluxo correspondente. Se preferir, você
          pode escolher manualmente na página inicial.
        </div>
      </div>
    </PageContainer>
  );
}
