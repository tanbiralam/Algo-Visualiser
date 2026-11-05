import { SortStep } from "./types";

export function Bars({
  array,
  active,
  kind,
  done,
  tone = "ink",
}: {
  array: number[];
  active: number[];
  kind?: SortStep["type"];
  done: boolean;
  /** Bar colour; compare mode gives the second run indigo bars. */
  tone?: "ink" | "ai";
}) {
  const base = tone === "ai" ? "bg-ai/80" : "bg-ink/75";
  const highlight = kind === "compare" ? "bg-shu" : kind === "read" ? "bg-ai" : "bg-shu -translate-y-1";
  return (
    // Gaps only while bars are wide enough; at 200 bars on a phone, 1px gaps alone overflow.
    <div className={`flex h-full w-full items-end ${array.length > 100 ? "" : "gap-px"}`}>
      {array.map((value, i) => (
        <div
          key={i}
          style={{ height: `${value}%` }}
          className={`min-w-0 flex-1 rounded-t-[2px] transition-transform duration-100 ${
            done ? "bg-gold" : active.includes(i) ? highlight : base
          }`}
        />
      ))}
    </div>
  );
}
