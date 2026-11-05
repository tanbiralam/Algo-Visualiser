import { SortStep } from "../types";

export const quickPseudocode = [
  "quickSort(lo, hi):",
  "  if lo >= hi: return",
  "  pivot = a[hi]; i = lo",
  "  for j = lo to hi - 1",
  "    if a[j] < pivot",
  "      swap a[i], a[j]; i = i + 1",
  "  swap a[i], a[hi]",
  "  quickSort(lo, i - 1); quickSort(i + 1, hi)",
];

// Lomuto partition with the last element as pivot.
export function quickSort(input: number[]): SortStep[] {
  const a = input.slice();
  const steps: SortStep[] = [];

  const partition = (lo: number, hi: number) => {
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      steps.push({ type: "compare", indices: [j, hi], line: 4, vars: { lo, hi, pivot, i, j } });
      if (a[j] < pivot) {
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({ type: "swap", indices: [i, j], line: 5, vars: { lo, hi, pivot, i, j } });
        }
        i++;
      }
    }
    if (i !== hi) {
      [a[i], a[hi]] = [a[hi], a[i]];
      steps.push({ type: "swap", indices: [i, hi], line: 6, vars: { lo, hi, pivot, i } });
    }
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
