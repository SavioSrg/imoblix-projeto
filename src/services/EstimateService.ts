/**
 * EstimateService
 *
 * Recebe as respostas do wizard, aplica regras de negócio mockadas
 * e devolve o detalhamento estimado dos custos de registro.
 *
 * Valores baseados em faixas de emolumentos comuns em cartórios de RI,
 * apenas para fins de demonstração — NÃO SÃO OFICIAIS.
 */

import type { WizardAnswers } from "@/contexts/WizardContext";

export interface EstimateLine {
  label: string;
  helper?: string;
  valueCents: number;
}

export interface EstimateResult {
  totalCents: number;
  lines: EstimateLine[];
  basis: {
    tipo?: string;
    valorImovel?: number;
  };
  disclaimer: string;
}

const DISCLAIMER =
  "Os valores apresentados são apenas uma estimativa. Os emolumentos oficiais são definidos pela tabela do estado e podem variar. Sempre confirme com o Cartório de Registro de Imóveis.";

/** Escala progressiva mock de emolumentos por faixa de valor. */
function emolumentos(valorImovel: number): number {
  if (!valorImovel || valorImovel <= 0) return 20000; // R$ 200
  if (valorImovel <= 100_000) return Math.round(valorImovel * 0.008 * 100);
  if (valorImovel <= 500_000) return Math.round((800 + (valorImovel - 100_000) * 0.006) * 100);
  if (valorImovel <= 1_000_000)
    return Math.round((3200 + (valorImovel - 500_000) * 0.004) * 100);
  return Math.round((5200 + (valorImovel - 1_000_000) * 0.003) * 100);
}

export function estimate(answers: WizardAnswers): EstimateResult {
  const tipo = (answers.tipo as string | undefined) ?? "escritura";
  const valorImovel =
    (answers.valorImovel as number | undefined) ??
    (answers.valorImovelPrefeitura as number | undefined) ??
    0;
  const primeiroImovel = Boolean(answers.primeiroImovel);

  const lines: EstimateLine[] = [];

  const emol = emolumentos(valorImovel);
  lines.push({
    label: "Emolumentos do Registro",
    helper: "Calculado pela tabela do estado",
    valueCents: emol,
  });

  lines.push({
    label: "Taxa de Fiscalização Judiciária",
    helper: "Repasse ao TJ",
    valueCents: Math.round(emol * 0.05),
  });

  lines.push({
    label: "ISS Municipal",
    helper: "Alíquota estimada de 2% sobre emolumentos",
    valueCents: Math.round(emol * 0.02),
  });

  if (tipo === "financiamento") {
    lines.push({
      label: "Registro de garantia (alienação fiduciária)",
      helper: "Registro do contrato de financiamento",
      valueCents: Math.round(emol * 0.5),
    });
  }

  if (tipo === "escritura") {
    lines.push({
      label: "Certidão de matrícula atualizada",
      valueCents: 8990,
    });
  }

  let subtotal = lines.reduce((acc, l) => acc + l.valueCents, 0);

  if (primeiroImovel && tipo === "financiamento") {
    const desconto = Math.round(subtotal * 0.5);
    lines.push({
      label: "Desconto — Primeira aquisição financiada",
      helper: "Lei 6.015/73 art. 290 (redução legal aplicável)",
      valueCents: -desconto,
    });
    subtotal -= desconto;
  }

  return {
    totalCents: subtotal,
    lines,
    basis: { tipo, valorImovel },
    disclaimer: DISCLAIMER,
  };
}
