import { HeroDemo } from "@/components/HeroDemo";
import { SiteHeader } from "@/components/VisualiserShell";
import { PATHFINDING_CARDS, SORTING_CARDS } from "@/learn/cards";
import { LearnCard } from "@/learn/types";

const STEPS = [
  ["Watch it run", "Play, pause, scrub and change the speed. Every step is recorded, so you can go backwards too."],
  ["Follow the code", "The pseudocode highlights the line that just ran, with the live values of every variable."],
  [
    "Check yourself",
    "Each algorithm ends with a question that tests whether you understood it, not whether you remember it.",
  ],
] as const;

function AlgorithmList({
  title,
  intro,
  href,
  cards,
}: {
  title: string;
  intro: string;
  href: string;
  cards: [string, LearnCard][];
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h2 className="font-display text-2xl font-extrabold">{title}</h2>
        <a href={href} className="shrink-0 text-sm font-medium text-shu hover:underline">
          Open visualiser →
        </a>
      </div>
      <p className="mt-3 max-w-[60ch] text-muted">{intro}</p>
      <ul className="mt-4">
        {cards.map(([key, card]) => (
          <li key={key}>
            <a
              href={`${href}?algo=${key}`}
              className="group grid gap-1 border-b border-line py-4 transition-colors hover:bg-surface sm:grid-cols-[11rem_1fr_auto] sm:items-baseline sm:gap-6 sm:px-3"
            >
              <span className="font-display text-lg font-semibold group-hover:text-shu">{card.name}</span>
              <span className="text-sm leading-relaxed text-muted">{card.oneLiner}</span>
              {/* Searches list worst-case time: A*'s average depends on its heuristic. */}
              <span className="font-mono text-xs text-muted">
                {card.complexity.stable ? card.complexity.avg : card.complexity.worst}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-line">
        <SiteHeader section="home" />
      </header>

      <main className="mx-auto max-w-6xl px-4 lg:px-6">
        <section className="grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              Sorting and pathfinding, one step at a time
            </p>
            <h1 className="mt-4 text-balance font-display text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
              Understand algorithms. <span className="text-shu">Don&apos;t memorise them.</span>
            </h1>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted">
              Eleven classic algorithms you can watch, pause and step through line by line, each explained in plain
              language with the places you meet it in real life.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/sorting"
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-ink/85 active:scale-[0.97]"
              >
                Start with sorting
              </a>
              <a
                href="/pathfinding"
                className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium transition hover:border-ink/30 active:scale-[0.97]"
              >
                Explore pathfinding
              </a>
            </div>
          </div>
          <HeroDemo />
        </section>

        <section className="grid gap-6 border-t border-line py-12 sm:grid-cols-3">
          {STEPS.map(([title, body], k) => (
            <div key={title} className="space-y-2">
              <p className="font-mono text-xs text-shu">0{k + 1}</p>
              <h2 className="font-display text-xl font-semibold">{title}</h2>
              <p className="leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-14 border-t border-line py-12 lg:grid-cols-2 lg:gap-10">
          <AlgorithmList
            title="Sorting"
            intro="Seven ways to put values in order. Compare two on the same input and see how many comparisons, swaps and writes each one needs."
            href="/sorting"
            cards={Object.entries(SORTING_CARDS)}
          />
          <AlgorithmList
            title="Pathfinding"
            intro="Four ways to search a grid. Draw walls and costly terrain, generate a maze, and watch how each search spreads."
            href="/pathfinding"
            cards={Object.entries(PATHFINDING_CARDS)}
          />
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted lg:px-6">
          <span>Algo Visualiser</span>
          <a href="https://github.com/tanbiralam/Algo-Visualiser" className="hover:text-ink">
            Source on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
