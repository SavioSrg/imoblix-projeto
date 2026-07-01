import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, FileText, Info, ShieldCheck } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { InfoCard } from "@/components/common/InfoCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { certidoesService } from "@/services/CertidoesService";
import { formatCurrencyBRL } from "@/utils/format";
import { toast } from "sonner";

export const Route = createFileRoute("/fluxo/certidao")({
  head: () => ({
    meta: [
      { title: "Certidões de imóvel — Imoblix" },
      {
        name: "description",
        content:
          "Solicite Inteiro Teor, Ônus, Ações Reais, Quitação e Vintenária. Prazos, preços e validade em um só lugar.",
      },
    ],
  }),
  component: CertidaoPage,
});

function CertidaoPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["certidoes"],
    queryFn: () => certidoesService.list(),
  });
  const { data: info } = useQuery({
    queryKey: ["certidoes-info"],
    queryFn: () => certidoesService.info(),
  });

  return (
    <PageContainer size="lg">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Certidões
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          Escolha a certidão que você precisa
        </h1>
        <p className="mt-2 text-muted-foreground">
          Cada certidão tem uma finalidade diferente. Selecione a que se aplica
          ao seu caso para continuar.
        </p>
      </div>

      {info && (
        <InfoCard icon={ShieldCheck} title="Validade das certidões" tone="info" className="mb-6">
          {info.aviso}
        </InfoCard>
      )}

      <div className="grid gap-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        {data?.map((c) => (
          <Card
            key={c.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-border p-5 shadow-soft sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-foreground">{c.nome}</p>
                  {c.destaque && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Mais pedida
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{c.utilidade}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {c.prazo}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" />
                    Validade 30 dias
                  </span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2 sm:min-w-[160px]">
              <p className="text-xl font-bold text-foreground">
                {formatCurrencyBRL(c.precoCentavos / 100)}
              </p>
              <Button
                onClick={() => {
                  toast.success(`Certidão "${c.nome}" adicionada`);
                  navigate({ to: "/atendimento" });
                }}
              >
                Solicitar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
