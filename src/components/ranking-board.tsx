import { useCallback, useEffect, useRef, useState } from "react";
import type { Board } from "@/lib/logorank/core";
import { LogoRow } from "@/components/logo-row";
import { StatsBar } from "@/components/stats-bar";
import { BoostDialog } from "@/components/boost-dialog";
import { Separator } from "@/components/ui/separator";
import type { Brand } from "@/lib/logorank/core";

export function RankingBoard({ board }: { board: Board }) {
  const [boost, setBoost] = useState<Brand | null>(null);
  const [pixels, setPixels] = useState<number | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const setMeasure = useCallback((el: HTMLDivElement | null) => {
    frameRef.current = el;
  }, []);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) {
      setPixels(null);
      return;
    }
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setPixels(w * h);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [board.brands[0]?.id, board.brands[0]?.widthPercent]);

  if (board.brands.length === 0) {
    return (
      <div className="rounded-xl bg-card px-6 py-16 text-center shadow-(--shadow-border)">
        <h2 className="font-display text-2xl">Nadie ha pujado todavía</h2>
        <p className="mt-2 text-sm text-muted-foreground">Sé el primero. El #1 ocupa casi toda la pantalla.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <StatsBar stats={board.stats} numberOnePixels={pixels} />
      <ol className="flex flex-col gap-14">
        {board.brands.map((brand, i) => (
          <li
            key={brand.id}
            className="stagger-in"
            style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
          >
            {i > 0 ? <Separator className="mb-14" /> : null}
            <LogoRow
              brand={brand}
              onBoost={setBoost}
              measureRef={brand.rank === 1 ? setMeasure : undefined}
            />
          </li>
        ))}
      </ol>
      <BoostDialog brand={boost} onClose={() => setBoost(null)} />
    </div>
  );
}
