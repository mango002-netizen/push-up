import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createIntent } from "@/lib/logorank/api";
import {
  AMOUNT_PRESETS,
  MAX_CENTS,
  MIN_CENTS,
  formatEur,
  type Brand,
} from "@/lib/logorank/core";

export function BoostDialog({
  brand,
  onClose,
}: {
  brand: Brand | null;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [cents, setCents] = useState(2500);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!brand) return;
    setBusy(true);
    try {
      const { intent } = await createIntent({
        data: { brandId: brand.id, amountCents: cents },
      });
      onClose();
      await navigate({ to: "/pay/$intentId", params: { intentId: intent.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo crear la puja");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={!!brand} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Impulsar {brand?.name}</DialogTitle>
          <DialogDescription>
            Cada euro se suma al total. El logo crece con la raíz de lo acumulado.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3">
          {brand ? (
            <img
              src={brand.logoData}
              alt=""
              className="logo-img size-14 rounded-sm object-contain bg-muted"
            />
          ) : null}
          <div>
            <p className="font-medium">{brand?.name}</p>
            <p className="font-mono text-sm text-muted-foreground tabular-nums">
              Ahora {brand ? formatEur(brand.totalCents) : ""} · #{brand?.rank}
            </p>
          </div>
        </div>
        <AmountPicker cents={cents} onChange={setCents} />
        <Button type="button" size="lg" onClick={submit} disabled={busy}>
          {busy ? "Preparando…" : `Pujar ${formatEur(cents)}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function AmountPicker({
  cents,
  onChange,
}: {
  cents: number;
  onChange: (n: number) => void;
}) {
  const euros = cents / 100;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {AMOUNT_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`h-11 whitespace-nowrap rounded-md px-2 font-mono text-sm tabular-nums shadow-(--shadow-border) transition-[background-color,box-shadow] duration-150 ${
              cents === p
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:shadow-(--shadow-border-hover)"
            }`}
          >
            {p / 100}€
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="custom-amount">Otra cantidad (€)</Label>
        <Input
          id="custom-amount"
          type="number"
          min={MIN_CENTS / 100}
          max={MAX_CENTS / 100}
          step={1}
          value={Number.isFinite(euros) ? euros : ""}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isFinite(n)) return;
            onChange(Math.round(n * 100));
          }}
        />
        <p className="text-xs text-muted-foreground">
          Mínimo {formatEur(MIN_CENTS)} · máximo {formatEur(MAX_CENTS)}
        </p>
      </div>
    </div>
  );
}
