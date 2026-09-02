import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { getHall } from "@/lib/logorank/api";
import { formatEur } from "@/lib/logorank/core";

export const Route = createFileRoute("/fame")({
  loader: () => getHall(),
  component: FamePage,
});

function FamePage() {
  const { entries } = Route.useLoaderData();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:py-14">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Archivo
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-6xl">
          Salón de la fama
        </h1>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Cada vez que un logo se convierte en #1, queda grabado. El tamaño más grande de su era.
        </p>
        {entries.length === 0 ? (
          <div className="mt-12 rounded-xl bg-card px-6 py-16 text-center shadow-(--shadow-border)">
            <p className="font-display text-2xl">Todavía no hay coronas</p>
            <Button asChild className="mt-6">
              <Link to="/bid">Sé el primero</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((e) => (
              <li key={e.id} className="rounded-xl bg-card p-4 shadow-(--shadow-border)">
                <img
                  src={e.logoData}
                  alt={`Logo de ${e.name}`}
                  className="logo-img aspect-square w-full rounded-md object-contain"
                />
                <h2 className="mt-4 font-display text-xl font-medium tracking-tight">{e.name}</h2>
                <p className="mt-1 font-mono text-sm text-muted-foreground tabular-nums">
                  {formatEur(e.totalCents)} al coronarse
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {format(new Date(e.crownedAt), "d MMM yyyy, HH:mm", { locale: es })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
