import { SortStep } from "../types";

export const insertionPseudocode = [
  "for i = 1 to n - 1",
  "  key = a[i]; j = i - 1",
  "  while j >= 0 and a[j] > key",
  "    a[j + 1] = a[j]; j = j - 1",
  "  a[j + 1] = key",
];

export function insertionSort(input: number[]): SortStep[] {
  const a = input.slice();
  const steps: SortStep[] = [];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0) {
      steps.push({ type: "compare", indices: [j, j + 1], line: 2, vars: { i, j, key, "a[j]": a[j] } });
      if (a[j] <= key) break;
      a[j + 1] = a[j];
      steps.push({ type: "write", index: j + 1, value: a[j], line: 3, vars: { i, j, key, "a[j]": a[j] } });
      j--;
    }
    if (j + 1 !== i) {
      a[j + 1] = key;
      steps.push({ type: "write", index: j + 1, value: key, line: 4, vars: { i, j, key } });
    }
  }
  return steps;
}
