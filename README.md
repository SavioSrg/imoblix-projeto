# Imoblix — Assistente Inteligente para Registro de Imóveis

MVP web moderno que guia o cidadão, passo a passo, em qualquer procedimento
junto ao Cartório de Registro de Imóveis: **compra e venda**, **financiamento**,
**FGTS**, **certidões** e **devolutivas**.

## Objetivo

Reduzir a distância entre o cidadão e o cartório com uma experiência estilo
Nubank/Gov.br/Stripe: linguagem simples, wizard guiado, resumo em tempo real
das respostas e estimativa de custos.

## Tecnologias

- **React 19** + **TypeScript** + **Vite 7**
- **TanStack Router / Start** (file-based routing, SSR-ready)
- **TanStack Query** (camada de dados assíncronos)
- **Tailwind CSS v4** + **shadcn/ui** + **tw-animate-css**
- **React Hook Form** + **Zod** (formulários e validação)
- **React Context API** para o motor do Wizard (persistência em `sessionStorage`)
- **Lucide Icons**, **Sonner** (toasts)

> Observação: o template do projeto já vem com TanStack Router configurado
> (equivalente moderno ao React Router para SSR/edge). A camada de serviços
> foi desenhada de forma agnóstica para permitir troca por qualquer roteador
> ou backend.

## Estrutura

```
src/
├── components/
│   ├── layout/          # AppHeader, AppFooter, PageContainer
│   ├── common/          # OptionCard, MoneyInput, InfoCard, ChecklistItem, Breadcrumb
│   └── ui/              # shadcn/ui
├── contexts/
│   └── WizardContext.tsx        # motor do wizard (state + persist)
├── data/                # catálogos mockados (certidões, checklists, intenções)
├── features/
│   ├── wizard/          # WizardShell, AnswersSummary
│   └── flows/
│       └── comprar-vender/      # fluxo completo Escritura / Financiamento / FGTS
├── routes/              # file-based routing (TanStack)
│   ├── __root.tsx
│   ├── index.tsx
│   ├── ajuda.tsx
│   ├── fluxo.comprar-vender.tsx
│   ├── fluxo.certidao.tsx
│   ├── fluxo.devolutiva.tsx
│   ├── estimativa.tsx
│   ├── atendimento.tsx
│   ├── premium.tsx
│   ├── sucesso.tsx
│   └── dashboard.tsx
├── services/            # EstimateService, CertidoesService, LeadsService
├── utils/               # format.ts (BRL, humanize)
└── styles.css           # design tokens (oklch)
```

## Como executar

```bash
bun install
bun dev
```

Abra `http://localhost:8080`.

## Fluxograma dos principais fluxos

```
[ Home ] ──► Comprar/Vender ──► Tipo ─┬─► Escritura ─┐
                                      ├─► Financiamento ─► Primeiro imóvel ┐
                                      └─► FGTS ────────┘                   │
                                                                           ▼
                                         Validação de documentos ──► Estimativa
                                                                           │
                                                                           ▼
                                                                   Atendimento (Presencial / RI Digital)
                                                                           │
                                                                           ▼
                                                                       Sucesso

[ Home ] ──► Certidão ──► Escolha ──► Atendimento
[ Home ] ──► Devolutiva ──► CTA Premium
[ Home ] ──► Central de Ajuda (perguntas encadeadas) ──► fluxo correspondente
```

## Como adicionar novos fluxos

1. Declare o fluxo em `src/features/flows/<slug>/` com um componente principal.
2. Use `useWizard()` + `startFlow({ id, title, steps })` para registrar o
   fluxo no motor.
3. Cada step é um componente que:
   - lê `answers` do context,
   - valida com **Zod** via **React Hook Form**,
   - chama `next(values)` para avançar,
   - chama `back()` para voltar.
4. Crie a rota em `src/routes/fluxo.<slug>.tsx` apontando para o componente.
5. (Opcional) adicione uma intenção em `src/data/intencoes.ts` para que a
   Central de Ajuda encaminhe o usuário até este fluxo.

## Como integrar Supabase futuramente

O projeto está preparado para plugar Lovable Cloud (Supabase) sem
refatoração:

1. Ative Lovable Cloud no projeto.
2. Crie as tabelas: `leads`, `certidoes`, `processos` (com RLS por
   `auth.uid()`).
3. Reescreva cada arquivo de `src/services/` mantendo a mesma assinatura
   pública. Para operações do usuário logado, use `createServerFn` +
   `requireSupabaseAuth`.
4. Nenhum componente/hook precisa mudar — o TanStack Query já orquestra os
   fetches.

Detalhes em `src/services/README.md`.

## Roadmap

- [ ] Autenticação + persistência de processos por usuário (Supabase)
- [ ] Fluxo completo "Atualizar matrícula" (averbações e retificações)
- [ ] Upload de documentos (Storage) e OCR para pré-validação
- [ ] Integração real com tabelas de emolumentos por estado
- [ ] Pagamento Pix + cartão via provedor
- [ ] Área Premium com atendimento humano por WhatsApp
- [ ] Painel administrativo para atendentes

## Boas práticas aplicadas

- Toda **regra de negócio desacoplada da UI** (`services/`, `data/`, `utils/`).
- Componentes **reutilizáveis** e **pequenos**.
- Tokens semânticos de design em `src/styles.css` — nenhum `text-white` /
  `bg-black` hardcoded.
- Validação com **Zod** em toda entrada de dados.
- Feedback visual em cada ação (toasts, progress, states).
- Totalmente **responsivo** e acessível (foco visível, labels, ARIA).
