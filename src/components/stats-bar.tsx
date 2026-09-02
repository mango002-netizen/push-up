import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { BoardStats } from "@/lib/logorank/core";
import { formatEur, formatPixels } from "@/lib/logorank/core";

export function StatsBar({
  stats,
  numberOnePixels,
}: {
  stats: BoardStats;
  numberOnePixels: number | null;
}) {
  const [nowTick, setNowTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setNowTick((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const last =
    stats.lastBidAt && stats.lastBidName && stats.lastBidCents != null
      ? `${stats.lastBidName} · ${formatEur(stats.lastBidCents)} · ${formatDistanceToNow(
          new Date(stats.lastBidAt),
          { locale: es, addSuffix: true },
        )}`
      : "Aún no hay pujas";

  void nowTick;

  return (
    <section className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-border shadow-(--shadow-border) sm:grid-cols-3">
      <Stat label="Total recaudado" value={formatEur(stats.totalRaisedCents)} />
      <Stat label="Última puja" value={last} />
      <Stat
        label="Píxeles del #1"
        value={numberOnePixels != null ? `${formatPixels(numberOnePixels)} px` : "—"}
      />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-5 py-4">
      <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1.5 font-mono text-sm text-foreground tabular-nums sm:text-[15px]">{value}</p>
    </div>
  );
}
