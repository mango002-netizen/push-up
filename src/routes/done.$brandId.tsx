import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CrownOverlay } from "@/components/crown-overlay";
import { Button } from "@/components/ui/button";
import { getBoard } from "@/lib/logorank/api";
import { formatEur, shareIntentUrl, shareTweetText } from "@/lib/logorank/core";

type DoneSearch = {
  crowned?: "1";
};

export const Route = createFileRoute("/done/$brandId")({
  validateSearch: (search: Record<string, unknown>): DoneSearch => ({
    crowned: search.crowned === "1" ? "1" : undefined,
  }),
  loader: () => getBoard(),
  component: DonePage,
});

function DonePage() {
  const { brandId } = Route.useParams();
  const { crowned } = Route.useSearch();
  const board = Route.useLoaderData();
  const brand = board.brands.find((b) => b.id === brandId);
  const [showCrown, setShowCrown] = useState(crowned === "1");
  const [share, setShare] = useState("#");
  const dismiss = useCallback(() => setShowCrown(false), []);

  useEffect(() => {
    if (!brand) return;
    setShare(
      shareIntentUrl(
        shareTweetText({
          name: brand.name,
          rank: brand.rank,
          totalCents: brand.totalCents,
          origin: window.location.origin,
        }),
      ),
    );
  }, [brand]);

  const above = brand ? board.brands.find((b) => b.rank === brand.rank - 1) : undefined;
  const gap = above && brand ? above.totalCents - brand.totalCents + 100 : null;

  if (!brand) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-lg flex-1 px-4 py-16">
          <h1 className="font-display text-3xl">Puja publicada</h1>
          <p className="mt-2 text-muted-foreground">No encontramos esa marca en el ranking.</p>
          <Button asChild className="mt-6">
            <Link to="/">Volver al ranking</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {showCrown ? (
        <CrownOverlay name={brand.name} logoData={brand.logoData} onDone={dismiss} />
      ) : null}
      <SiteHeader />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:py-14">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Confirmado
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">
          {brand.rank === 1 ? "Eres el número uno." : `Eres el #${brand.rank}.`}
        </h1>
        <div className="mt-8 overflow-hidden rounded-xl bg-card p-4 shadow-(--shadow-border)">
          <img
            src={brand.logoData}
            alt=""
            className="logo-img mx-auto aspect-square w-2/3 object-contain"
          />
        </div>
        <dl className="mt-6 space-y-3">
          <Row label="Marca" value={brand.name} />
          <Row label="Posición" value={`#${brand.rank}`} />
          <Row label="Total acumulado" value={formatEur(brand.totalCents)} mono />
          {gap != null && above ? (
            <Row label={`Para superar a ${above.name}`} value={formatEur(gap)} mono />
          ) : null}
        </dl>
        <div className="mt-8 flex flex-col gap-3">
          <Button asChild size="lg">
            <a href={share} target="_blank" rel="noreferrer">
              Compartir en X
            </a>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link to="/">Ver el ranking</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link to="/bid">Pujar otra vez</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-sm tabular-nums" : "text-sm font-medium"}>{value}</dd>
    </div>
  );
}
