import { Trace } from "@/engine/types";

/** Pseudocode with the current step's line highlighted, followed by its live variables. */
export function Pseudocode({ lines, trace }: { lines: string[]; trace?: Trace }) {
  return (
    <div>
      <ol className="overflow-x-auto rounded-md border border-line bg-bg py-2 font-mono text-xs leading-6">
        {lines.map((line, k) => (
          <li
            key={k}
            className={`whitespace-pre px-3 transition-colors duration-100 ${
              trace?.line === k ? "bg-shu/10 text-ink shadow-[inset_2px_0_0_rgb(var(--c-shu))]" : "text-muted"
            }`}
          >
            {line}
          </li>
        ))}
      </ol>
      <dl className="mt-3 flex min-h-[1.75rem] flex-wrap gap-2 font-mono text-xs">
        {trace ? (
          Object.entries(trace.vars).map(([name, value]) => (
            <div key={name} className="rounded border border-line bg-bg px-2 py-1">
              <dt className="inline text-muted">{name} = </dt>
              <dd className="inline">{value}</dd>
            </div>
          ))
        ) : (
          <p className="text-muted">Press play or → to start.</p>
        )}
      </dl>
    </div>
  );
}
