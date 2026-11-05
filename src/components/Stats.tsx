import { formatNumber } from "@/lib/format";

export type Stat = { label: string; value: number | string; total?: number | string };

/** Counters for the current step; `total` shows the final value once the run completes. */
export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-3 gap-2">
      {stats.map(({ label, value, total }) => (
        <div key={label} className="rounded-md bg-white/5 px-3 py-2">
          <dt className="text-[11px] uppercase tracking-wide text-gray-500">{label}</dt>
          <dd className="mt-0.5 font-mono text-lg tabular-nums text-white">
            {typeof value === "number" ? formatNumber(value) : value}
          </dd>
          {total !== undefined && (
            <dd className="font-mono text-[11px] tabular-nums text-gray-500">
              of {typeof total === "number" ? formatNumber(total) : total}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}
