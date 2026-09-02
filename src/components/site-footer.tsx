import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>LogoRank · logorank.lol · El tamaño sigue la raíz de lo pujado.</p>
        <div className="flex gap-4">
          <Link to="/fame" className="hover:text-foreground">
            Salón de la fama
          </Link>
          <Link to="/bid" className="hover:text-foreground">
            Nueva puja
          </Link>
        </div>
      </div>
    </footer>
  );
}
