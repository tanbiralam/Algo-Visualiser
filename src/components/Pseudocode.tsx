import { Trace } from "@/engine/types";

/** Pseudocode with the current step's line highlighted, followed by its live variables. */
export function Pseudocode({ lines, trace }: { lines: string[]; trace?: Trace }) {
  return (
    <div>
      <ol className="overflow-x-auto rounded-md bg-black/40 py-2 font-mono text-xs leading-6">
        {lines.map((line, k) => (
          <li
            key={k}
            className={`whitespace-pre px-3 ${
              trace?.line === k ? "bg-purple-500/25 text-white" : "text-gray-400"
            }`}
          >
            {line}
          </li>
        ))}
      </ol>
      <dl className="mt-3 flex min-h-[1.75rem] flex-wrap gap-2 font-mono text-xs">
        {trace ? (
          Object.entries(trace.vars).map(([name, value]) => (
            <div key={name} className="rounded bg-white/5 px-2 py-1">
              <dt className="inline text-gray-500">{name} = </dt>
              <dd className="inline text-gray-200">{value}</dd>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Press play or → to start.</p>
        )}
      </dl>
    </div>
  );
}
