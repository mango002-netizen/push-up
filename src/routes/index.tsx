import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RankingBoard } from "@/components/ranking-board";
import { Button } from "@/components/ui/button";
import { getBoard } from "@/lib/logorank/api";

export const Route = createFileRoute("/")({
  loader: () => getBoard(),
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  const query = useQuery({
    queryKey: ["board"],
    queryFn: () => getBoard(),
    initialData: initial,
    refetchInterval: 4000,
  });
  const board = query.data ?? initial;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:py-14">
        <section className="mb-12 max-w-2xl">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Ranking público
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-6xl">
            Paga para ser visto.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Sube el logo de tu producto y puja. Quien más haya pagado en total ocupa el #1 — y su
            marca cubre casi toda la pantalla.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/bid">Subir un logo</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/fame">Salón de la fama</Link>
            </Button>
          </div>
        </section>
        <HowItWorks />
        <div className="mt-12">
          <RankingBoard board={board} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Sube tu logo", d: "Nombre, URL y marca. Sin cuentas." },
    { n: "02", t: "Puja desde 5 €", d: "Cada euro se suma al total acumulado." },
    { n: "03", t: "El tamaño crece", d: "La escala usa la raíz de lo pujado." },
    { n: "04", t: "El #1 lo ocupa todo", d: "Casi el ancho de la pantalla en el móvil." },
  ];
  return (
    <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s) => (
        <li key={s.n} className="rounded-lg bg-card px-4 py-4 shadow-(--shadow-border)">
          <p className="font-mono text-[11px] text-muted-foreground tabular-nums">{s.n}</p>
          <p className="mt-2 font-display text-lg font-medium tracking-tight">{s.t}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}
