import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Home, LayoutDashboard } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useWizard } from "@/contexts/WizardContext";
import { AnswersSummary } from "@/features/wizard/AnswersSummary";

export const Route = createFileRoute("/sucesso")({
  head: () => ({
    meta: [
      { title: "Concluído — Imoblix" },
      {
        name: "description",
        content: "Solicitação registrada com sucesso.",
      },
    ],
  }),
  component: SucessoPage,
});

function SucessoPage() {
  const navigate = useNavigate();
  const { reset } = useWizard();

  return (
    <PageContainer>
      <div className="rounded-3xl border border-success/30 bg-success/10 p-8 text-center shadow-soft">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          Solicitação concluída
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
          Registramos suas informações. Em uma versão em produção, você
          receberia agora um e-mail com o protocolo e os próximos passos.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="outline">
            <Link to="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Ver meu processo
            </Link>
          </Button>
          <Button
            size="lg"
            onClick={() => {
              reset();
              navigate({ to: "/" });
            }}
          >
            <Home className="h-4 w-4" />
            Voltar ao início
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <AnswersSummary />
      </div>
    </PageContainer>
  );
}
