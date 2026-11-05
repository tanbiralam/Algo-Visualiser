import Link from "next/link";

const visualisers = [
  {
    href: "/sorting",
    title: "Sorting",
    description:
      "Watch Bubble, Insertion, Selection, Merge and Quick sort rearrange an array step by step.",
  },
  {
    href: "/pathfinding",
    title: "Pathfinding",
    description:
      "Draw walls or generate a maze, then watch BFS, DFS, Dijkstra and A* search for the shortest path.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-300 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-light text-white">Algo Visualiser</h1>
        <p className="mt-2 text-gray-400">
          Pick a category to see how classic algorithms work.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {visualisers.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className="rounded-lg border border-purple-400/30 bg-gradient-to-r from-purple-800/40 to-purple-600/20 p-6 transition hover:border-purple-400/70"
            >
              <h2 className="text-xl text-white">{v.title}</h2>
              <p className="mt-2 text-sm text-gray-400">{v.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
