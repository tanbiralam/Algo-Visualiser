import { BsChevronDown } from "react-icons/bs";
import { Trace } from "@/engine/types";
import { formatNumber } from "@/lib/format";
import { Pseudocode } from "./Pseudocode";

export type Side = { label: string; swatch: string };
type Cell = { now: number | string; total?: number | string };
export type ScoreRow = { label: string; cells: [Cell, Cell] };

const show = (v: number | string) => (typeof v === "number" ? formatNumber(v) : v);

/** Both runs in one table. For every row, lower is better; the lower final total is marked. */
export function Scoreboard({ sides, rows }: { sides: [Side, Side]; rows: ScoreRow[] }) {
  return (
    <table className="w-full table-fixed text-sm">
      <thead>
        <tr className="border-b border-line">
          <th className="w-[34%] pb-2 text-left text-[11px] font-medium uppercase tracking-[0.12em] text-muted" />
          {sides.map((s) => (
            <th key={s.label} className="pb-2 text-left align-bottom font-medium">
              <span className={`mr-1.5 inline-block h-2.5 w-2.5 rounded-sm ${s.swatch}`} />
              {s.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(({ label, cells }) => {
          const [a, b] = cells.map((c) => c.total);
          const best = typeof a === "number" && typeof b === "number" && a !== b ? (a < b ? 0 : 1) : -1;
          return (
            <tr key={label} className="border-b border-line last:border-0">
              <td className="py-2 text-muted">{label}</td>
              {cells.map((c, k) => (
                <td key={k} className="py-2 align-top">
                  <span className="font-mono font-semibold tabular-nums">{show(c.now)}</span>
                  {c.total !== undefined && (
                    <span
                      className={`block font-mono text-[11px] tabular-nums ${best === k ? "text-moss" : "text-muted"}`}
                    >
                      of {show(c.total)}
                      {best === k && " · fewer"}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Pseudocode folded away; the summary shows the line that just ran. */
export function CodeDrawer({ side, lines, trace }: { side: Side; lines: string[]; trace?: Trace }) {
  return (
    <details className="group rounded-md border border-line bg-bg">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm [&::-webkit-details-marker]:hidden">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-sm ${side.swatch}`} />
        <span className="shrink-0 font-medium">{side.label}</span>
        <span className="min-w-0 flex-1 truncate text-right font-mono text-xs text-muted">
          {trace ? lines[trace.line]?.trim() : "not started"}
        </span>
        <BsChevronDown className="h-3 w-3 shrink-0 text-muted transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-line p-3">
        <Pseudocode lines={lines} trace={trace} />
      </div>
    </details>
  );
}
