import Link from "next/link";

const visualisers = [
  {
    href: "/sorting",
    title: "Sorting",
    description:
      "Step through seven sorting algorithms, from Bubble to Radix sort, with pseudocode, live counters and side-by-side comparison.",
  },
  {
    href: "/pathfinding",
    title: "Pathfinding",
    description:
      "Draw walls and weights or generate a maze, then step through BFS, DFS, Dijkstra and A* or race two of them.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-ink flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <h1 className="font-display text-4xl font-extrabold">Algo Visualiser</h1>
        <p className="mt-2 text-muted">
          Pick a category to see how classic algorithms work.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {visualisers.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className="rounded-lg border border-line bg-surface p-6 transition hover:border-ink/30"
            >
              <h2 className="font-display text-xl font-semibold">{v.title}</h2>
              <p className="mt-2 text-sm text-muted">{v.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
