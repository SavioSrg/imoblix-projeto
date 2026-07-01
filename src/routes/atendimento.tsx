import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building, Wifi, Check, ArrowRight, Clock, MapPin } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWizard } from "@/contexts/WizardContext";
import { toast } from "sonner";

export const Route = createFileRoute("/atendimento")({
  head: () => ({
    meta: [
      { title: "Escolha o atendimento — Imoblix" },
      {
        name: "description",
        content:
          "Registre presencialmente no cartório ou 100% online pelo RI Digital. Compare as duas opções.",
      },
    ],
  }),
  component: AtendimentoPage,
});

type Mode = "presencial" | "digital";

const OPTIONS: {
  id: Mode;
  title: string;
  desc: string;
  icon: typeof Building;
  bullets: string[];
  eta: string;
  meta: string;
}[] = [
  {
    id: "presencial",
    title: "Atendimento presencial",
    desc: "Você comparece ao cartório com os documentos originais.",
    icon: Building,
    bullets: [
      "Retirada de senha e atendimento em balcão",
      "Original é conferido no momento",
      "Pagamento no local (Pix, cartão ou boleto)",
      "Ideal para casos com pendências que exigem conferência física",
    ],
    eta: "1 a 15 dias úteis para registro",
    meta: "Horário: 9h às 17h em dias úteis",
  },
  {
    id: "digital",
    title: "RI Digital",
    desc: "100% online, sem sair de casa, com validade jurídica.",
    icon: Wifi,
    bullets: [
      "Envio dos documentos assinados digitalmente",
      "Acompanhamento em tempo real do protocolo",
      "Pagamento via Pix ou cartão",
      "Certidões chegam por e-mail com QR Code de autenticidade",
    ],
    eta: "24h a 5 dias úteis",
    meta: "Disponível 24/7",
  },
];

function AtendimentoPage() {
  const navigate = useNavigate();
  const { patchAnswers } = useWizard();
  const [selected, setSelected] = useState<Mode>();

  return (
    <PageContainer>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Atendimento
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
        Como você prefere ser atendido?
      </h1>
      <p className="mt-2 text-muted-foreground">
        Escolha a forma de atendimento que melhor se encaixa no seu dia a dia.
        Ambas têm a mesma validade jurídica.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSel = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={cn(
                "flex h-full flex-col rounded-2xl border-2 bg-card p-6 text-left shadow-soft transition-all",
                "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated",
                isSel ? "border-primary bg-primary-soft/40" : "border-border",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    isSel ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-foreground">{opt.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{opt.desc}</p>
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {opt.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-5 grid gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {opt.eta}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {opt.meta}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          size="lg"
          disabled={!selected}
          onClick={() => {
            if (!selected) return;
            patchAnswers({ atendimento: selected });
            toast.success(
              selected === "digital"
                ? "Atendimento RI Digital selecionado"
                : "Atendimento presencial selecionado",
            );
            navigate({ to: "/sucesso" });
          }}
        >
          Confirmar atendimento
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </PageContainer>
  );
}
