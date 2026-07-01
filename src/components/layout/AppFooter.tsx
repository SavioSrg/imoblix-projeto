import { Building2 } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t border-border/70 bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-4 w-4" />
          </span>
          <div className="text-sm">
            <p className="font-semibold text-foreground">Imoblix</p>
            <p className="text-muted-foreground">
              Assistente inteligente para Registro de Imóveis.
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Imoblix. Este é um MVP com dados de demonstração.
          Consulte sempre o cartório para valores oficiais.
        </p>
      </div>
    </footer>
  );
}
