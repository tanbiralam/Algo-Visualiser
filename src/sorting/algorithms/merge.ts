import { SortStep } from "../types";

export const mergePseudocode = [
  "mergeSort(lo, hi):",
  "  if lo >= hi: return",
  "  mid = (lo + hi) / 2",
  "  mergeSort(lo, mid); mergeSort(mid + 1, hi)",
  "  merge(lo, mid, hi):",
  "    while both halves have items",
  "      a[k++] = smaller of left[i], right[j]",
  "    copy leftovers into a[k..hi]",
];

export function mergeSort(input: number[]): SortStep[] {
  const a = input.slice();
  const steps: SortStep[] = [];

  const merge = (lo: number, mid: number, hi: number) => {
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    let i = 0;
    let j = 0;
    let k = lo;
    const vars = () => ({ lo, mid, hi, k, i, j });
    while (i < left.length && j < right.length) {
      steps.push({ type: "compare", indices: [lo + i, mid + 1 + j], line: 5, vars: vars() });
      a[k] = left[i] <= right[j] ? left[i++] : right[j++];
      steps.push({ type: "write", index: k, value: a[k], line: 6, vars: vars() });
      k++;
    }
    while (i < left.length) {
      a[k] = left[i++];
      steps.push({ type: "write", index: k, value: a[k], line: 7, vars: vars() });
      k++;
    }
    while (j < right.length) {
      a[k] = right[j++];
      steps.push({ type: "write", index: k, value: a[k], line: 7, vars: vars() });
      k++;
    }
  };

  const sort = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  };

  sort(0, a.length - 1);
  return steps;
}
