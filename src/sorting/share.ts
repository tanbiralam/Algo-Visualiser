import { intParam, pickParam } from "@/lib/share";
import { SORTING_ALGORITHMS } from "./algorithms";
import { INPUT_OPTIONS } from "./input";
import { SortAlgorithm } from "./types";

const ALGORITHMS = Object.keys(SORTING_ALGORITHMS) as SortAlgorithm[];
const PRESETS = INPUT_OPTIONS.map((o) => o.value);
export const MIN_SIZE = 8;
export const MAX_SIZE = 200;

export function parseSortingParams(search: string) {
  const p = new URLSearchParams(search);
  return {
    algorithm: pickParam(p.get("algo"), ALGORITHMS),
    rival: pickParam(p.get("vs"), [...ALGORITHMS, "none" as const]),
    preset: pickParam(p.get("input"), PRESETS),
    size: intParam(p.get("size"), MIN_SIZE, MAX_SIZE),
    seed: intParam(p.get("seed"), 0, 2 ** 31),
  };
}
