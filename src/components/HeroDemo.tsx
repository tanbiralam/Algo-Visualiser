"use client";

import { useEffect, useMemo, useState } from "react";
import { SORTING_ALGORITHMS } from "@/sorting/algorithms";
import { Bars } from "@/sorting/Bars";
import { replaySort } from "@/sorting/replay";

const INPUT = [42, 18, 77, 33, 91, 8, 60, 25, 84, 50, 12, 68, 95, 37, 22, 73, 5, 58, 88, 30, 65, 15, 46, 80];
const PAUSE = 40; // ticks to rest on the sorted array before starting again

/** Insertion sort on a loop, driven by the same steps and replay as the visualiser. */
export function HeroDemo() {
  const steps = useMemo(() => SORTING_ALGORITHMS.insertion.run(INPUT), []);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setI(Math.floor(steps.length * 0.45));
      return;
    }
    const id = setInterval(() => setI((n) => (n >= steps.length + PAUSE ? 0 : n + 1)), 55);
    return () => clearInterval(id);
  }, [steps.length]);

  const state = replaySort(INPUT, steps, Math.min(i, steps.length));
  return (
    <figure className="rounded-xl border border-line bg-surface p-5 shadow-[0_18px_40px_-24px_rgb(var(--c-ink)/0.35)]">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <span className="font-display text-base font-semibold">Insertion sort</span>
        <span className="font-mono text-xs tabular-nums text-muted">
          {state.comparisons} comparisons · {state.writes} writes
        </span>
      </div>
      <div className="h-48 sm:h-56">
        <Bars array={state.array} active={state.active} kind={state.last?.type} done={i >= steps.length} />
      </div>
      <figcaption className="mt-4 text-sm leading-relaxed text-muted">
        Like sorting a hand of cards: each new value slides left past bigger ones until it fits.
      </figcaption>
    </figure>
  );
}
