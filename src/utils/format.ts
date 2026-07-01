const KEY_LABELS: Record<string, string> = {
  tipo: "Tipo de operação",
  possuiEscritura: "Escritura pública",
  valorImovelPrefeitura: "Valor pela prefeitura",
  valorImovel: "Valor do imóvel",
  valorDivida: "Valor da dívida",
  contratoBanco: "Contrato do banco",
  itbiQuitado: "ITBI quitado",
  itbi: "ITBI",
  contrato: "Contrato",
  primeiroImovel: "Primeiro imóvel",
  atendimento: "Forma de atendimento",
  certidao: "Certidão escolhida",
  motivo: "Motivo",
};

export function humanizeAnswerKey(key: string) {
  if (KEY_LABELS[key]) return KEY_LABELS[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export function formatCurrencyBRL(value: number | string | undefined | null): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (n === undefined || n === null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n as number);
}

export function formatAnswerValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map((v) => formatAnswerValue(v)).join(", ");
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${humanizeAnswerKey(k)}: ${formatAnswerValue(v)}`)
      .join(" · ");
  }
  const str = String(value);
  // pretty labels for enums
  const enumMap: Record<string, string> = {
    escritura: "Escritura Pública",
    financiamento: "Financiamento",
    fgts: "FGTS",
    presencial: "Presencial",
    digital: "RI Digital",
  };
  return enumMap[str] ?? str;
}

/** Parses a masked BR currency string ("R$ 1.234,56") to a number. */
export function parseCurrencyBRL(input: string): number {
  const cleaned = input.replace(/\D/g, "");
  if (!cleaned) return 0;
  return Number(cleaned) / 100;
}

/** Formats a number as a "R$ 1.234,56" string for controlled inputs. */
export function maskCurrencyBRL(value: number | string): string {
  const n = typeof value === "string" ? parseCurrencyBRL(value) : value;
  if (!n) return "";
  return formatCurrencyBRL(n);
}
