import { SortStep } from "./types";

/** State of the array after applying the first `upto` steps, with operation counts. */
export function replaySort(input: number[], steps: SortStep[], upto: number) {
  const array = input.slice();
  let comparisons = 0;
  let swaps = 0;
  let writes = 0;
  for (let k = 0; k < upto; k++) {
    const step = steps[k];
    if (step.type === "compare") {
      comparisons++;
    } else if (step.type === "swap") {
      const [x, y] = step.indices;
      [array[x], array[y]] = [array[y], array[x]];
      swaps++;
    } else if (step.type === "write") {
      array[step.index] = step.value;
      writes++;
    }
  }
  const last = upto > 0 ? steps[upto - 1] : undefined;
  const active = !last ? [] : "index" in last ? [last.index] : last.indices;
  return { array, last, active, comparisons, swaps, writes };
}
