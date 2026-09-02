import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function CrownOverlay({
  name,
  logoData,
  onDone,
}: {
  name: string;
  logoData: string;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 4200);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="crown-layer fixed inset-0 z-50 flex flex-col items-center justify-center bg-foreground px-6 text-background"
      role="status"
    >
      <p className="crown-mark text-[11px] font-medium tracking-[0.22em] uppercase">
        Nuevo número uno
      </p>
      <img
        src={logoData}
        alt=""
        className="crown-mark logo-img mt-8 size-40 rounded-lg bg-background object-contain sm:size-52"
        style={{ animationDelay: "80ms" }}
      />
      <h2
        className="crown-mark mt-8 font-display text-4xl font-medium tracking-tight sm:text-6xl"
        style={{ animationDelay: "140ms" }}
      >
        {name}
      </h2>
      <p
        className="crown-mark mt-3 max-w-sm text-center text-sm text-background/70"
        style={{ animationDelay: "200ms" }}
      >
        El ranking acaba de cambiar. El logo más caro del tablero es este.
      </p>
      <Button
        type="button"
        variant="secondary"
        className="crown-mark mt-8"
        style={{ animationDelay: "260ms" }}
        onClick={onDone}
      >
        Ver el ranking
      </Button>
    </div>
  );
}
