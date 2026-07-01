import { createFileRoute } from "@tanstack/react-router";
import { ComprarVenderFlow } from "@/features/flows/comprar-vender/ComprarVenderFlow";

export const Route = createFileRoute("/fluxo/comprar-vender")({
  head: () => ({
    meta: [
      { title: "Comprar ou vender um imóvel — Imoblix" },
      {
        name: "description",
        content:
          "Assistente para compra/venda de imóveis: escritura pública, financiamento ou FGTS. Documentos, checklist e estimativa de custos.",
      },
    ],
  }),
  component: ComprarVenderFlow,
});
