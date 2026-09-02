import { ArrowUpRight } from "lucide-react";
import type { Brand } from "@/lib/logorank/core";
import { formatEur, xProfileUrl } from "@/lib/logorank/core";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LogoRow({
  brand,
  onBoost,
  measureRef,
}: {
  brand: Brand;
  onBoost: (brand: Brand) => void;
  measureRef?: (el: HTMLDivElement | null) => void;
}) {
  const rank = String(brand.rank).padStart(2, "0");

  return (
    <article
      className={cn("flex flex-col items-center", brand.rank === 1 && "pt-2")}
    >
      <div className="mb-3 flex w-full items-baseline justify-between gap-3 px-1">
        <span className="font-display text-3xl font-medium tracking-tight text-muted-foreground/70 sm:text-4xl">
          {rank}
        </span>
        {brand.rank === 1 ? (
          <span className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Número uno
          </span>
        ) : null}
      </div>

      <div
        ref={measureRef}
        className="logo-frame mx-auto max-w-full"
        style={{ ["--logo-w" as string]: `${brand.widthPercent}%` }}
      >
        <div
          className={cn(
            "overflow-hidden rounded-lg bg-card shadow-(--shadow-border)",
            brand.rank === 1 ? "rounded-xl" : "rounded-md",
          )}
        >
          <img
            src={brand.logoData}
            alt={`Logo de ${brand.name}`}
            className="logo-img aspect-square w-full object-contain"
          />
        </div>
      </div>

      <div className="mt-4 flex w-full flex-col items-center gap-2 text-center">
        <h2 className="font-display text-xl font-medium tracking-tight sm:text-2xl">{brand.name}</h2>
        <p className="font-mono text-sm text-muted-foreground tabular-nums">
          {formatEur(brand.totalCents)} acumulados
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <a
            href={brand.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-1 rounded-md px-3 text-sm text-foreground hover:bg-muted"
          >
            Visitar
            <ArrowUpRight className="size-3.5" />
          </a>
          {brand.xHandle ? (
            <a
              href={xProfileUrl(brand.xHandle)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-md px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              @{brand.xHandle}
            </a>
          ) : null}
          <Button type="button" variant="secondary" size="sm" onClick={() => onBoost(brand)}>
            Impulsar
          </Button>
        </div>
      </div>
    </article>
  );
}
