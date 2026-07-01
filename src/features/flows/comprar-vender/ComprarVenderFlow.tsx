import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Landmark,
  Wallet,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
} from "lucide-react";
import { WizardShell } from "@/features/wizard/WizardShell";
import { useWizard, type WizardFlow } from "@/contexts/WizardContext";
import { OptionCard } from "@/components/common/OptionCard";
import { InfoCard } from "@/components/common/InfoCard";
import { ChecklistItem } from "@/components/common/ChecklistItem";
import { MoneyInput } from "@/components/common/MoneyInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DOCS_ESCRITURA,
  DOCS_FGTS,
  DOCS_FINANCIAMENTO,
  type DocRequirement,
} from "@/data/checklists";
import { toast } from "sonner";

type Tipo = "escritura" | "financiamento" | "fgts";

const FLOW_BASE: Omit<WizardFlow, "steps"> = {
  id: "comprar-vender",
  title: "Comprar ou vender um imóvel",
};

function buildFlow(tipo?: Tipo): WizardFlow {
  const steps = [{ id: "tipo", label: "Tipo de operação" }];
  if (tipo === "escritura")
    steps.push(
      { id: "escritura", label: "Dados da escritura" },
      { id: "validacao", label: "Validação" },
    );
  if (tipo === "financiamento")
    steps.push(
      { id: "financiamento", label: "Financiamento" },
      { id: "primeiro", label: "Primeira aquisição" },
      { id: "validacao", label: "Validação" },
    );
  if (tipo === "fgts")
    steps.push(
      { id: "fgts", label: "FGTS" },
      { id: "validacao", label: "Validação" },
    );
  if (!tipo) steps.push({ id: "detalhes", label: "Detalhes" }, { id: "validacao", label: "Validação" });
  return { ...FLOW_BASE, steps };
}

export function ComprarVenderFlow() {
  const wizard = useWizard();
  const currentTipo = wizard.answers.tipo as Tipo | undefined;

  // Bootstrap: start the flow on mount / when tipo changes so stepper reflects the right path
  useEffect(() => {
    const desiredFlow = buildFlow(currentTipo);
    const differentFlow =
      wizard.flow?.id !== desiredFlow.id ||
      wizard.flow?.steps.length !== desiredFlow.steps.length;
    if (differentFlow) {
      wizard.startFlow(desiredFlow, wizard.answers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTipo]);

  const stepId = wizard.currentStep?.id ?? "tipo";

  return (
    <WizardShell
      eyebrow="Comprar ou vender"
      title={titleForStep(stepId)}
      description={descForStep(stepId)}
    >
      {stepId === "tipo" && <StepTipo />}
      {stepId === "escritura" && <StepEscritura />}
      {stepId === "financiamento" && <StepFinanciamento />}
      {stepId === "primeiro" && <StepPrimeiro />}
      {stepId === "fgts" && <StepFgts />}
      {stepId === "validacao" && <StepValidacao />}
    </WizardShell>
  );
}

function titleForStep(id: string) {
  switch (id) {
    case "tipo":
      return "Qual é o tipo da operação?";
    case "escritura":
      return "Escritura Pública";
    case "financiamento":
      return "Financiamento imobiliário";
    case "primeiro":
      return "Primeira aquisição";
    case "fgts":
      return "Uso de FGTS";
    case "validacao":
      return "Validação dos documentos";
    default:
      return "Comprar ou vender";
  }
}
function descForStep(id: string) {
  switch (id) {
    case "tipo":
      return "Escolha a modalidade para direcionarmos os documentos necessários.";
    case "escritura":
      return "Confirme se você já possui a Escritura Pública e informe o valor.";
    case "financiamento":
      return "Confirme os documentos exigidos pelo cartório para o registro.";
    case "primeiro":
      return "Descontos legais podem se aplicar quando é o primeiro imóvel financiado.";
    case "fgts":
      return "Registros com uso de FGTS têm particularidades específicas.";
    case "validacao":
      return "Vamos conferir se está tudo pronto para o registro.";
    default:
      return "";
  }
}

/* -------------------- STEP 1: Tipo -------------------- */

function StepTipo() {
  const { setAnswer, next, answers } = useWizard();
  const [tipo, setTipo] = useState<Tipo | undefined>(answers.tipo as Tipo | undefined);

  const handleContinue = () => {
    if (!tipo) {
      toast.error("Escolha uma opção para continuar");
      return;
    }
    setAnswer("tipo", tipo);
    next({ tipo });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3">
        <OptionCard
          icon={Landmark}
          title="Escritura Pública"
          description="Pagamento à vista, formalizado em Tabelionato de Notas."
          selected={tipo === "escritura"}
          onClick={() => setTipo("escritura")}
        />
        <OptionCard
          icon={Building2}
          title="Financiamento imobiliário"
          description="Com contrato bancário e alienação fiduciária."
          selected={tipo === "financiamento"}
          onClick={() => setTipo("financiamento")}
        />
        <OptionCard
          icon={Wallet}
          title="FGTS"
          description="Utilização do Fundo de Garantia na aquisição do imóvel."
          selected={tipo === "fgts"}
          onClick={() => setTipo("fgts")}
        />
      </div>
      <div className="flex justify-end">
        <Button size="lg" onClick={handleContinue}>
          Continuar
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* -------------------- STEP: Escritura -------------------- */

const escrituraSchema = z.object({
  possuiEscritura: z.boolean(),
  valorImovelPrefeitura: z.number().min(1, "Informe o valor venal do imóvel"),
});
type EscrituraData = z.infer<typeof escrituraSchema>;

function StepEscritura() {
  const { patchAnswers, next, answers } = useWizard();
  const form = useForm<EscrituraData>({
    resolver: zodResolver(escrituraSchema),
    defaultValues: {
      possuiEscritura: Boolean(answers.possuiEscritura),
      valorImovelPrefeitura: (answers.valorImovelPrefeitura as number) ?? 0,
    },
  });

  const onSubmit = (data: EscrituraData) => {
    patchAnswers(data);
    next(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <label className="flex items-start gap-3">
          <Checkbox
            checked={form.watch("possuiEscritura")}
            onCheckedChange={(v) => form.setValue("possuiEscritura", Boolean(v))}
            className="mt-0.5"
          />
          <span>
            <span className="block text-sm font-medium text-foreground">
              Já possuo a Escritura Pública em mãos
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Documento emitido em Tabelionato de Notas, com selo e assinaturas.
            </span>
          </span>
        </label>
      </div>

      <div>
        <Label htmlFor="valor">Valor do imóvel segundo a prefeitura</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Consulte o carnê do IPTU (valor venal).
        </p>
        <div className="mt-2 max-w-xs">
          <MoneyInput
            id="valor"
            value={form.watch("valorImovelPrefeitura")}
            onChange={(v) => form.setValue("valorImovelPrefeitura", v)}
          />
        </div>
        {form.formState.errors.valorImovelPrefeitura && (
          <p className="mt-1 text-xs text-destructive">
            {form.formState.errors.valorImovelPrefeitura.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button size="lg" type="submit">
          Continuar <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

/* -------------------- STEP: Financiamento -------------------- */

const financiamentoSchema = z.object({
  contratoBanco: z.boolean(),
  itbiQuitado: z.boolean(),
});
type FinData = z.infer<typeof financiamentoSchema>;

function StepFinanciamento() {
  const { patchAnswers, next, answers } = useWizard();
  const form = useForm<FinData>({
    resolver: zodResolver(financiamentoSchema),
    defaultValues: {
      contratoBanco: Boolean(answers.contratoBanco),
      itbiQuitado: Boolean(answers.itbiQuitado),
    },
  });

  const onSubmit = (data: FinData) => {
    patchAnswers(data);
    next(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <CheckRow
        label="Contrato do banco"
        helper="Instrumento particular de financiamento com alienação fiduciária."
        checked={form.watch("contratoBanco")}
        onChange={(v) => form.setValue("contratoBanco", v)}
      />
      <CheckRow
        label={
          <span className="flex items-center gap-1">
            ITBI quitado
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" aria-label="O que é ITBI?" className="text-primary">
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  <strong>ITBI</strong> — Imposto de Transmissão de Bens Imóveis.
                  Tributo municipal cobrado pela prefeitura na transferência
                  onerosa do imóvel. Sem a guia paga, o cartório não registra.
                </p>
              </TooltipContent>
            </Tooltip>
          </span>
        }
        helper="Guia emitida pela prefeitura e paga antes do registro."
        checked={form.watch("itbiQuitado")}
        onChange={(v) => form.setValue("itbiQuitado", v)}
      />
      <div className="flex justify-end pt-2">
        <Button size="lg" type="submit">
          Continuar <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

/* -------------------- STEP: Primeiro imóvel -------------------- */

const primeiroSchema = z
  .object({
    primeiroImovel: z.enum(["sim", "nao"]),
    valorImovel: z.number().optional(),
    valorDivida: z.number().optional(),
  })
  .refine(
    (d) => d.primeiroImovel === "nao" || ((d.valorImovel ?? 0) > 0 && (d.valorDivida ?? 0) > 0),
    { message: "Informe os valores", path: ["valorImovel"] },
  );
type PrimeiroData = z.infer<typeof primeiroSchema>;

function StepPrimeiro() {
  const { patchAnswers, next, answers } = useWizard();
  const form = useForm<PrimeiroData>({
    resolver: zodResolver(primeiroSchema),
    defaultValues: {
      primeiroImovel: (answers.primeiroImovel ? "sim" : "nao") as "sim" | "nao",
      valorImovel: (answers.valorImovel as number) ?? 0,
      valorDivida: (answers.valorDivida as number) ?? 0,
    },
  });

  const primeiro = form.watch("primeiroImovel") === "sim";

  const onSubmit = (data: PrimeiroData) => {
    const payload = {
      primeiroImovel: data.primeiroImovel === "sim",
      valorImovel: data.valorImovel,
      valorDivida: data.valorDivida,
    };
    patchAnswers(payload);
    next(payload);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label>É seu primeiro imóvel?</Label>
        <RadioGroup
          value={form.watch("primeiroImovel")}
          onValueChange={(v) => form.setValue("primeiroImovel", v as "sim" | "nao")}
          className="mt-3 grid gap-3 sm:grid-cols-2"
        >
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-border p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft/60">
            <RadioGroupItem value="sim" />
            <span className="text-sm font-medium">Sim, é o primeiro</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-border p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft/60">
            <RadioGroupItem value="nao" />
            <span className="text-sm font-medium">Não</span>
          </label>
        </RadioGroup>
      </div>

      {primeiro && (
        <div className="animate-in fade-in-0 slide-in-from-top-2 space-y-4 duration-300">
          <InfoCard icon={Info} title="Declaração de Primeira Aquisição" tone="info">
            Como é seu primeiro imóvel financiado, você tem direito a redução
            legal de 50% nos emolumentos de registro (Lei 6.015/73). Vamos
            solicitar essa declaração no momento certo.
          </InfoCard>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="valorImovel">Valor do imóvel</Label>
              <div className="mt-2">
                <MoneyInput
                  id="valorImovel"
                  value={form.watch("valorImovel")}
                  onChange={(v) => form.setValue("valorImovel", v)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="valorDivida">Valor da dívida (financiamento)</Label>
              <div className="mt-2">
                <MoneyInput
                  id="valorDivida"
                  value={form.watch("valorDivida")}
                  onChange={(v) => form.setValue("valorDivida", v)}
                />
              </div>
            </div>
          </div>
          {form.formState.errors.valorImovel && (
            <p className="text-xs text-destructive">
              {form.formState.errors.valorImovel.message}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button size="lg" type="submit">
          Continuar <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

/* -------------------- STEP: FGTS -------------------- */

const fgtsSchema = z.object({
  contrato: z.boolean(),
  itbi: z.boolean(),
  valorImovel: z.number().min(1, "Informe o valor do imóvel"),
});
type FgtsData = z.infer<typeof fgtsSchema>;

function StepFgts() {
  const { patchAnswers, next, answers } = useWizard();
  const form = useForm<FgtsData>({
    resolver: zodResolver(fgtsSchema),
    defaultValues: {
      contrato: Boolean(answers.contrato),
      itbi: Boolean(answers.itbi),
      valorImovel: (answers.valorImovel as number) ?? 0,
    },
  });

  const onSubmit = (data: FgtsData) => {
    patchAnswers(data);
    next(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <CheckRow
        label="Contrato"
        helper="Instrumento particular de compra e venda com FGTS."
        checked={form.watch("contrato")}
        onChange={(v) => form.setValue("contrato", v)}
      />
      <CheckRow
        label="ITBI"
        helper="Guia municipal quitada."
        checked={form.watch("itbi")}
        onChange={(v) => form.setValue("itbi", v)}
      />
      <div>
        <Label htmlFor="valorImovelFgts">Valor do imóvel</Label>
        <div className="mt-2 max-w-xs">
          <MoneyInput
            id="valorImovelFgts"
            value={form.watch("valorImovel")}
            onChange={(v) => form.setValue("valorImovel", v)}
          />
        </div>
        {form.formState.errors.valorImovel && (
          <p className="mt-1 text-xs text-destructive">
            {form.formState.errors.valorImovel.message}
          </p>
        )}
      </div>
      <div className="flex justify-end pt-2">
        <Button size="lg" type="submit">
          Continuar <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

/* -------------------- STEP: Validação -------------------- */

function StepValidacao() {
  const navigate = useNavigate();
  const { answers } = useWizard();
  const tipo = answers.tipo as Tipo;

  const { requiredDocs, satisfied } = useMemo(() => {
    let docs: DocRequirement[] = [];
    if (tipo === "escritura") docs = DOCS_ESCRITURA;
    else if (tipo === "financiamento") docs = DOCS_FINANCIAMENTO;
    else if (tipo === "fgts") docs = DOCS_FGTS;

    const checks: Record<string, boolean> = {
      escritura: Boolean(answers.possuiEscritura),
      itbi: Boolean(answers.itbiQuitado || answers.itbi),
      contratoBanco: Boolean(answers.contratoBanco),
      contrato: Boolean(answers.contrato),
      valorImovel:
        Boolean(answers.valorImovel) || Boolean(answers.valorImovelPrefeitura),
      valorPrefeitura: Boolean(answers.valorImovelPrefeitura),
      docsPessoais: true, // assumido no MVP
      declaracaoPrimeira: !answers.primeiroImovel || true,
    };

    const mapped = docs.map((d) => ({ ...d, done: Boolean(checks[d.id]) }));
    return {
      requiredDocs: mapped,
      satisfied: mapped.every((d) => d.done),
    };
  }, [answers, tipo]);

  const missing = requiredDocs.filter((d) => !d.done);

  if (satisfied) {
    return (
      <div className="space-y-6">
        <InfoCard icon={CheckCircle2} title="Tudo pronto para o registro!" tone="success">
          Todos os documentos necessários foram informados. Podemos calcular
          agora a estimativa dos custos.
        </InfoCard>
        <div className="flex justify-end">
          <Button size="lg" onClick={() => navigate({ to: "/estimativa" })}>
            Ver estimativa
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InfoCard icon={AlertTriangle} title="Ainda faltam alguns documentos" tone="warning">
        Confira os itens abaixo antes de dar entrada no cartório. Sem eles, o
        registro é devolvido com exigências.
      </InfoCard>

      <ul className="grid gap-3">
        {requiredDocs.map((d) => (
          <ChecklistItem key={d.id} label={d.label} helper={d.helper} done={d.done} />
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 p-4">
        <p className="text-xs text-muted-foreground">
          {missing.length} item(ns) pendente(s). Você pode baixar um checklist
          para levar ao cartório ou seguir mesmo assim.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const content = requiredDocs
                .map((d) => `${d.done ? "[x]" : "[ ]"} ${d.label}`)
                .join("\n");
              const blob = new Blob([content], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "checklist-imoblix.txt";
              a.click();
              URL.revokeObjectURL(url);
              toast.success("Checklist baixado");
            }}
          >
            <Download className="h-4 w-4" />
            Baixar checklist
          </Button>
          <Button onClick={() => navigate({ to: "/estimativa" })}>
            Continuar assim mesmo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- helpers -------------------- */

function CheckRow({
  label,
  helper,
  checked,
  onChange,
}: {
  label: React.ReactNode;
  helper?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-border bg-card p-4 shadow-soft transition-colors hover:border-primary/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft/40">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onChange(Boolean(v))}
        className="mt-0.5"
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {helper && (
          <span className="mt-0.5 block text-xs text-muted-foreground">{helper}</span>
        )}
      </span>
    </label>
  );
}
