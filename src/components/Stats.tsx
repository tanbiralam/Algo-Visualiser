import { formatNumber } from "@/lib/format";

export type Stat = { label: string; value: number | string; total?: number | string };

/** Counters for the current step; `total` shows the final value once the run completes. */
export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <dl className={`grid gap-2 ${stats.length === 4 ? "grid-cols-2" : "grid-cols-3"}`}>
      {stats.map(({ label, value, total }) => (
        <div key={label} className="min-w-0 rounded-md border border-line bg-bg px-3 py-2">
          <dt className="truncate text-[11px] text-muted">{label}</dt>
          <dd className="mt-0.5 font-mono text-lg font-semibold tabular-nums">
            {typeof value === "number" ? formatNumber(value) : value}
          </dd>
          {total !== undefined && (
            <dd className="font-mono text-[11px] tabular-nums text-muted">
              of {typeof total === "number" ? formatNumber(total) : total}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}
