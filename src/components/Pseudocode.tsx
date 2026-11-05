import { Trace } from "@/engine/types";

/**
 * Pseudocode with the current step's line highlighted, followed by its live variables.
 * With `onPick`, lines become buttons (used to predict the next line); `wrong` marks a missed pick.
 */
export function Pseudocode({
  lines,
  trace,
  onPick,
  wrong,
}: {
  lines: string[];
  trace?: Trace;
  onPick?: (line: number) => void;
  wrong?: number;
}) {
  return (
    <div>
      <ol className="overflow-x-auto rounded-md border border-line bg-bg py-2 font-mono text-xs leading-6">
        {lines.map((line, k) => {
          const tone =
            trace?.line === k
              ? "bg-shu/10 text-ink shadow-[inset_2px_0_0_rgb(var(--c-shu))]"
              : wrong === k
                ? "text-ink line-through decoration-shu"
                : "text-muted";
          return (
            <li key={k}>
              {onPick ? (
                <button
                  type="button"
                  onClick={() => onPick(k)}
                  className={`block w-full whitespace-pre px-3 text-left transition-colors hover:bg-sunk hover:text-ink ${tone}`}
                >
                  {line}
                </button>
              ) : (
                <span className={`block whitespace-pre px-3 transition-colors duration-100 ${tone}`}>{line}</span>
              )}
            </li>
          );
        })}
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
