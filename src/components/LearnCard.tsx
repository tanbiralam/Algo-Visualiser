"use client";

import { ReactNode, useState } from "react";
import { LearnCard as Card } from "@/learn/types";

function Eyebrow({ children }: { children: ReactNode }) {
  return <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{children}</h3>;
}

/** Short intro shown above the live stats: what it does and one place you meet it. */
export function LearnIntro({ card, onMore }: { card: Card; onMore: () => void }) {
  return (
    <div className="space-y-2">
      <p className="font-display text-xl font-extrabold leading-tight">{card.name}</p>
      <p className="leading-relaxed">{card.oneLiner}</p>
      <p className="leading-relaxed text-muted">
        <span className="text-ink">In real life: </span>
        {card.realWorld[0]}
      </p>
      <button type="button" onClick={onMore} className="text-sm font-medium text-shu hover:underline">
        Understand it →
      </button>
    </div>
  );
}

/** One multiple-choice question that checks understanding; answer once, then see why. */
export function Quiz({ question }: { question: Card["predictQuestion"] }) {
  const [picked, setPicked] = useState<string | null>(null);
  const right = picked === question.answer;
  return (
    <div className="space-y-2 rounded-lg border border-line bg-bg p-4">
      <Eyebrow>Check your understanding</Eyebrow>
      <p className="font-display text-base font-semibold leading-snug">{question.question}</p>
      <div className="space-y-2 pt-1">
        {question.options.map((o) => {
          const state = picked === null ? "" : o === question.answer ? "right" : o === picked ? "wrong" : "";
          return (
            <button
              key={o}
              type="button"
              disabled={picked !== null}
              onClick={() => setPicked(o)}
              className={`block w-full rounded-md border px-3 py-2 text-left text-sm transition enabled:hover:border-ink/40 ${
                state === "right"
                  ? "border-moss bg-moss/10"
                  : state === "wrong"
                    ? "border-shu bg-shu/10"
                    : "border-line bg-surface"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p className="pt-1 text-sm leading-relaxed text-muted" aria-live="polite">
          <span className={right ? "text-moss" : "text-shu"}>{right ? "Correct. " : "Not quite. "}</span>
          {question.why}
        </p>
      )}
    </div>
  );
}

export function LearnCard({ card }: { card: Card }) {
  const c = card.complexity;
  const chips: [string, string | undefined][] = c.stable
    ? [["best", c.best], ["average", c.avg], ["worst", c.worst], ["space", c.space], ["stable", c.stable]]
    : [["time", c.worst], ["space", c.space], ["cheapest path", c.optimal], ["always finds one", c.complete]];

  return (
    <article className="space-y-6">
      <div className="space-y-3">
        <p className="font-display text-2xl font-extrabold leading-tight">{card.name}</p>
        <p className="text-base leading-relaxed">{card.oneLiner}</p>
        <ul className="flex flex-wrap gap-1.5">
          {chips
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <li key={k} className="rounded border border-line bg-bg px-2 py-0.5 font-mono text-[11px]">
                <span className="text-muted">{k} </span>
                {v}
              </li>
            ))}
        </ul>
      </div>

      <section className="space-y-2">
        <Eyebrow>The intuition</Eyebrow>
        <p className="leading-relaxed">{card.intuition}</p>
      </section>

      <section className="space-y-2">
        <Eyebrow>In real life</Eyebrow>
        <ul className="list-disc space-y-1.5 pl-4 leading-relaxed marker:text-shu">
          {card.realWorld.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="space-y-1">
          <Eyebrow>Use it when</Eyebrow>
          <p className="leading-relaxed">{card.whenToUse}</p>
        </div>
        <div className="space-y-1">
          <Eyebrow>Avoid it when</Eyebrow>
          <p className="leading-relaxed">{card.whenNotTo}</p>
        </div>
      </section>

      <section className="space-y-2">
        <Eyebrow>Watch for in the animation</Eyebrow>
        <p className="leading-relaxed">{card.watchFor}</p>
      </section>

      <section className="space-y-1.5 rounded-lg border border-dashed border-line p-4">
        <Eyebrow>Common mistake</Eyebrow>
        <p className="leading-relaxed text-muted line-through decoration-shu/70">{card.misconception.myth}</p>
        <p className="leading-relaxed">{card.misconception.correction}</p>
      </section>

      <Quiz key={card.name} question={card.predictQuestion} />
    </article>
  );
}

/** Side panel with two views: the live run, and the explanation. */
export function SideTabs({
  tab,
  onTab,
  watch,
  learn,
}: {
  tab: "watch" | "learn";
  onTab: (t: "watch" | "learn") => void;
  watch: ReactNode;
  learn: ReactNode;
}) {
  const tabs = [
    ["watch", "Watch"],
    ["learn", "Understand"],
  ] as const;
  return (
    <>
      <div role="tablist" className="flex gap-1 rounded-lg border border-line bg-bg p-1">
        {tabs.map(([value, label]) => (
          <button
            key={value}
            role="tab"
            type="button"
            aria-selected={tab === value}
            onClick={() => onTab(value)}
            className="flex-1 rounded-md py-1.5 text-sm text-muted transition hover:text-ink aria-selected:bg-surface aria-selected:text-ink aria-selected:shadow-[inset_0_0_0_1px_rgb(var(--c-line))]"
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "watch" ? watch : learn}
    </>
  );
}
