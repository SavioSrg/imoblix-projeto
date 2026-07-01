/**
 * Documentos obrigatórios por tipo de fluxo.
 * Mock — no backend real virá do Supabase.
 */

export interface DocRequirement {
  id: string;
  label: string;
  helper?: string;
}

export const DOCS_ESCRITURA: DocRequirement[] = [
  { id: "escritura", label: "Escritura Pública", helper: "Emitida em Tabelionato de Notas" },
  { id: "itbi", label: "Guia de ITBI paga", helper: "Emitida pela prefeitura" },
  { id: "valorPrefeitura", label: "Valor venal do imóvel" },
  { id: "docsPessoais", label: "Documentos pessoais das partes" },
];

export const DOCS_FINANCIAMENTO: DocRequirement[] = [
  { id: "contratoBanco", label: "Contrato de financiamento assinado" },
  { id: "itbi", label: "ITBI quitado", helper: "Imposto de Transmissão de Bens Imóveis" },
  { id: "docsPessoais", label: "Documentos pessoais das partes" },
  {
    id: "declaracaoPrimeira",
    label: "Declaração de Primeira Aquisição",
    helper: "Obrigatória para desconto legal se for o primeiro imóvel",
  },
];

export const DOCS_FGTS: DocRequirement[] = [
  { id: "contrato", label: "Contrato de compra e venda / FGTS" },
  { id: "itbi", label: "ITBI quitado" },
  { id: "valorImovel", label: "Valor do imóvel" },
  { id: "docsPessoais", label: "Documentos pessoais das partes" },
];
