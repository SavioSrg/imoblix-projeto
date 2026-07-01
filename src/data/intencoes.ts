/**
 * Intenções da Central de Ajuda.
 * Guiam o usuário — em poucas perguntas — até o fluxo correto.
 */

export type IntentionOutcome =
  | { kind: "route"; to: string; params?: Record<string, string> }
  | { kind: "question"; questionId: string };

export interface IntentionOption {
  id: string;
  label: string;
  outcome: IntentionOutcome;
}

export interface IntentionQuestion {
  id: string;
  title: string;
  description?: string;
  options: IntentionOption[];
}

/**
 * Árvore de perguntas. A raiz é "start".
 * Cada opção leva a outra pergunta ou diretamente a uma rota do sistema.
 */
export const INTENT_TREE: Record<string, IntentionQuestion> = {
  start: {
    id: "start",
    title: "Como podemos te orientar?",
    description: "Responda algumas perguntas rápidas para chegarmos ao fluxo certo.",
    options: [
      {
        id: "comprei",
        label: "Comprei um imóvel",
        outcome: { kind: "question", questionId: "comoComprou" },
      },
      {
        id: "matricula",
        label: "Quero uma matrícula ou certidão",
        outcome: { kind: "question", questionId: "qualCertidao" },
      },
      {
        id: "proprietario",
        label: "Quero saber quem é o proprietário",
        outcome: { kind: "route", to: "/fluxo/certidao" },
      },
      {
        id: "registrado",
        label: "Quero saber se o imóvel está registrado",
        outcome: { kind: "route", to: "/fluxo/certidao" },
      },
      {
        id: "devolutiva",
        label: "Recebi uma devolutiva do cartório",
        outcome: { kind: "route", to: "/fluxo/devolutiva" },
      },
      {
        id: "impedimentos",
        label: "Quero saber se há impedimentos (ônus, penhora)",
        outcome: { kind: "route", to: "/fluxo/certidao" },
      },
      {
        id: "arquivados",
        label: "Quero documentos arquivados no cartório",
        outcome: { kind: "route", to: "/fluxo/certidao" },
      },
    ],
  },
  comoComprou: {
    id: "comoComprou",
    title: "Foi por qual forma de pagamento?",
    description: "Assim direcionamos ao fluxo com os documentos certos.",
    options: [
      {
        id: "escritura",
        label: "Pagamento à vista com Escritura Pública",
        outcome: { kind: "route", to: "/fluxo/comprar-vender" },
      },
      {
        id: "financiamento",
        label: "Financiamento imobiliário (banco)",
        outcome: { kind: "route", to: "/fluxo/comprar-vender" },
      },
      {
        id: "fgts",
        label: "Uso de FGTS",
        outcome: { kind: "route", to: "/fluxo/comprar-vender" },
      },
    ],
  },
  qualCertidao: {
    id: "qualCertidao",
    title: "O que você precisa consultar?",
    options: [
      {
        id: "inteiro-teor",
        label: "Cópia completa da matrícula (Inteiro Teor)",
        outcome: { kind: "route", to: "/fluxo/certidao" },
      },
      {
        id: "onus",
        label: "Se existem ônus (hipotecas, penhoras)",
        outcome: { kind: "route", to: "/fluxo/certidao" },
      },
      {
        id: "quitacao",
        label: "Comprovação de quitação",
        outcome: { kind: "route", to: "/fluxo/certidao" },
      },
    ],
  },
};
