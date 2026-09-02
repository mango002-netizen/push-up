import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BidForm } from "@/components/bid-form";

export const Route = createFileRoute("/bid")({
  component: BidPage,
});

function BidPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:py-14">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Nueva puja
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">Hazte más grande.</h1>
        <p className="mt-3 text-muted-foreground">
          El ranking es público. Identificamos tu marca por la URL — puedes volver a pujar cuando
          quieras.
        </p>
        <div className="mt-8">
          <BidForm />
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          ¿Ya estás en el tablero?{" "}
          <Link to="/" className="text-foreground underline-offset-4 hover:underline">
            Impúlsate desde el ranking
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
