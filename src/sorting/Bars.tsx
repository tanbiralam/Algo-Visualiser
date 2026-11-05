import { SortStep } from "./types";

export function Bars({
  array,
  active,
  kind,
  done,
}: {
  array: number[];
  active: number[];
  kind?: SortStep["type"];
  done: boolean;
}) {
  const highlight = kind === "compare" ? "bg-amber-400" : "bg-rose-500";
  return (
    <div className="flex h-full w-full items-end gap-px">
      {array.map((value, i) => (
        <div
          key={i}
          style={{ height: `${value}%` }}
          className={`flex-1 rounded-t-sm ${
            done ? "bg-system-green60" : active.includes(i) ? highlight : "bg-system-purple50"
          }`}
        />
      ))}
    </div>
  );
}
