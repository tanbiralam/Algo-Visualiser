import { SortStep } from "../types";

// Lomuto partition with the last element as pivot.
export function quickSort(input: number[]): SortStep[] {
  const a = input.slice();
  const steps: SortStep[] = [];

  const swap = (x: number, y: number) => {
    [a[x], a[y]] = [a[y], a[x]];
    steps.push({ type: "swap", indices: [x, y] });
  };

  const partition = (lo: number, hi: number) => {
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      steps.push({ type: "compare", indices: [j, hi] });
      if (a[j] < pivot) {
        if (i !== j) swap(i, j);
        i++;
      }
    }
    if (i !== hi) swap(i, hi);
    return i;
  };

  const sort = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  };

  sort(0, a.length - 1);
  return steps;
}
