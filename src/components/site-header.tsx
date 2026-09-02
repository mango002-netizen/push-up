import { Link } from "@tanstack/react-router";
import { LogoRankMark } from "@/components/mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <LogoRankMark />
          <span className="font-display text-lg font-semibold tracking-tight">LogoRank</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/fame">Salón de la fama</Link>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm">
            <Link to="/bid">Pujar</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
