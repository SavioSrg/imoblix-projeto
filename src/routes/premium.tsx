import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Sparkles, ShieldCheck, MessagesSquare, Timer } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { leadsService } from "@/services/LeadsService";
import { toast } from "sonner";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Ajuda Premium — Imoblix" },
      {
        name: "description",
        content:
          "Fale com um especialista Imoblix para analisar sua devolutiva, matrícula ou dúvida complexa de Registro de Imóveis.",
      },
    ],
  }),
  component: PremiumPage,
});

const schema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Informe seu nome")
    .max(120, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido").max(200),
  telefone: z
    .string()
    .trim()
    .min(8, "Informe um telefone válido")
    .max(20),
  mensagem: z
    .string()
    .trim()
    .min(10, "Descreva com um pouco mais de detalhe")
    .max(1000, "Máximo de 1000 caracteres"),
});
type FormData = z.infer<typeof schema>;

function PremiumPage() {
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", email: "", telefone: "", mensagem: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      leadsService.create({ ...data, origem: "premium" }),
    onSuccess: () => {
      toast.success("Recebemos seu pedido. Vamos entrar em contato em breve!");
      navigate({ to: "/sucesso" });
    },
    onError: () => {
      toast.error("Não foi possível enviar. Tente novamente.");
    },
  });

  return (
    <PageContainer>
      <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Ajuda Premium
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            Um especialista cuidando do seu caso
          </h1>
          <p className="mt-3 text-muted-foreground">
            Envie seus dados e um analista Imoblix te retorna em até 1 dia útil
            com o diagnóstico e o próximo passo — sem juridiquês.
          </p>

          <div className="mt-6 space-y-4">
            <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Análise técnica">
              Revisão da matrícula, devolutiva e documentos por especialistas.
            </Feature>
            <Feature icon={<MessagesSquare className="h-5 w-5" />} title="Atendimento direto">
              Você conversa com uma pessoa real, por WhatsApp ou e-mail.
            </Feature>
            <Feature icon={<Timer className="h-5 w-5" />} title="Resposta em 24h">
              Diagnóstico enviado em até 1 dia útil após o pedido.
            </Feature>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated">
          <p className="text-sm font-semibold text-foreground">
            Solicite atendimento especializado
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Este MVP não realiza cobrança. É apenas um formulário de contato.
          </p>
          <form
            onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
            className="mt-5 space-y-4"
          >
            <div>
              <Label htmlFor="nome">Nome completo</Label>
              <Input id="nome" className="mt-1.5 h-11" {...form.register("nome")} />
              {form.formState.errors.nome && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  className="mt-1.5 h-11"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  className="mt-1.5 h-11"
                  placeholder="(11) 99999-0000"
                  {...form.register("telefone")}
                />
                {form.formState.errors.telefone && (
                  <p className="mt-1 text-xs text-destructive">
                    {form.formState.errors.telefone.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="mensagem">Descreva o seu caso</Label>
              <Textarea
                id="mensagem"
                rows={5}
                className="mt-1.5"
                placeholder="Recebi uma devolutiva pedindo retificação de área..."
                {...form.register("mensagem")}
              />
              {form.formState.errors.mensagem && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.mensagem.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Enviando..." : "Enviar pedido"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
