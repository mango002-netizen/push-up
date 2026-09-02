import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { confirmPay, getIntent } from "@/lib/logorank/api";
import { formatEur } from "@/lib/logorank/core";

export const Route = createFileRoute("/pay/$intentId")({
  loader: ({ params }) => getIntent({ data: { id: params.intentId } }),
  component: PayPage,
});

function PayPage() {
  const { intent } = Route.useLoaderData();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function pay() {
    setBusy(true);
    try {
      await wait(1100);
      const result = await confirmPay({ data: { intentId: intent.id } });
      await navigate({
        to: "/done/$brandId",
        params: { brandId: result.brandId },
        search: { crowned: result.crowned ? "1" : undefined },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "El pago no se pudo completar");
      setBusy(false);
    }
  }

  const alreadyPaid = intent.status === "paid";

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-10 sm:py-14">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Confirmar puja
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">Pago</h1>
        <div className="mt-8 rounded-xl bg-card p-5 shadow-(--shadow-border)">
          <div className="flex items-center gap-4">
            <img
              src={intent.logoData}
              alt=""
              className="logo-img size-16 rounded-md object-contain bg-muted"
            />
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-medium">{intent.name}</p>
              <p className="truncate text-sm text-muted-foreground">{intent.url}</p>
            </div>
          </div>
          <div className="mt-6 flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">Puja</span>
            <span className="font-mono text-2xl tabular-nums">{formatEur(intent.amountCents)}</span>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Confirmación instantánea para el ranking público. En esta versión no se cobra una tarjeta
          real: la puja se publica al confirmar.
        </p>
        <Button
          type="button"
          size="lg"
          className="mt-6 w-full"
          onClick={pay}
          disabled={busy || alreadyPaid}
        >
          {busy ? "Procesando…" : alreadyPaid ? "Ya pagado" : `Pagar ${formatEur(intent.amountCents)}`}
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
