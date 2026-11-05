import { SortStep } from "../types";

export const selectionPseudocode = [
  "for i = 0 to n - 2",
  "  min = i",
  "  for j = i + 1 to n - 1",
  "    if a[j] < a[min]: min = j",
  "  swap a[i], a[min]",
];

export function selectionSort(input: number[]): SortStep[] {
  const a = input.slice();
  const steps: SortStep[] = [];
  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ type: "compare", indices: [min, j], line: 3, vars: { i, j, min, "a[min]": a[min] } });
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      steps.push({ type: "swap", indices: [i, min], line: 4, vars: { i, min } });
    }
  }
  return steps;
}
