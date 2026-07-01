/**
 * Catálogo mockado de certidões de imóveis.
 * Trocar por CertidoesService quando plugarmos Supabase.
 */

export interface Certidao {
  id: string;
  nome: string;
  utilidade: string;
  prazo: string;
  precoCentavos: number;
  destaque?: boolean;
}

export const CERTIDOES: Certidao[] = [
  {
    id: "inteiro-teor",
    nome: "Certidão de Inteiro Teor",
    utilidade:
      "Reprodução integral da matrícula. Necessária para inventário, financiamento e ações judiciais.",
    prazo: "Até 4 horas",
    precoCentavos: 8990,
    destaque: true,
  },
  {
    id: "onus",
    nome: "Certidão de Ônus Reais",
    utilidade:
      "Comprova a existência (ou não) de hipotecas, penhoras ou outros gravames sobre o imóvel.",
    prazo: "5 dias úteis",
    precoCentavos: 6590,
  },
  {
    id: "acoes-reais",
    nome: "Certidão de Ações Reais e Reipersecutórias",
    utilidade:
      "Indica se há ações judiciais que possam afetar a propriedade do imóvel.",
    prazo: "5 dias úteis",
    precoCentavos: 6590,
  },
  {
    id: "quitacao",
    nome: "Certidão de Quitação",
    utilidade: "Comprova a quitação de financiamento previamente registrado.",
    prazo: "5 dias úteis",
    precoCentavos: 5290,
  },
  {
    id: "vintenaria",
    nome: "Certidão Vintenária",
    utilidade:
      "Histórico dos últimos 20 anos de proprietários. Comum em usucapião.",
    prazo: "5 dias úteis",
    precoCentavos: 12990,
  },
];

export const CERTIDOES_INFO = {
  validadeDias: 30,
  aviso: "Todas as certidões possuem validade de 30 dias após a emissão.",
};
