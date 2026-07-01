import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  ajuda: "Central de Ajuda",
  fluxo: "Fluxo",
  "comprar-vender": "Comprar ou vender",
  certidao: "Certidões",
  devolutiva: "Devolutiva",
  estimativa: "Estimativa",
  atendimento: "Atendimento",
  premium: "Ajuda Premium",
  dashboard: "Meu processo",
  sucesso: "Concluído",
};

export function Breadcrumb() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/") return null;
  const parts = pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Navegação"
      className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 pt-6 text-xs text-muted-foreground sm:px-6"
    >
      <Link to="/" className="flex items-center gap-1 hover:text-foreground">
        <Home className="h-3.5 w-3.5" />
        Início
      </Link>
      {parts.map((p, i) => {
        const isLast = i === parts.length - 1;
        return (
          <span key={p + i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5" />
            <span className={isLast ? "font-medium text-foreground" : ""}>
              {LABELS[p] ?? p}
            </span>
          </span>
        );
      })}
    </nav>
  );
}
