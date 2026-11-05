import { SortStep } from "../types";

export const bubblePseudocode = [
  "for i = 0 to n - 2",
  "  swapped = false",
  "  for j = 0 to n - i - 2",
  "    if a[j] > a[j + 1]",
  "      swap a[j], a[j + 1]; swapped = true",
  "  if not swapped: stop",
];

export function bubbleSort(input: number[]): SortStep[] {
  const a = input.slice();
  const steps: SortStep[] = [];
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ type: "compare", indices: [j, j + 1], line: 3, vars: { i, j, "a[j]": a[j], "a[j+1]": a[j + 1] } });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
        steps.push({ type: "swap", indices: [j, j + 1], line: 4, vars: { i, j, "a[j]": a[j], "a[j+1]": a[j + 1] } });
      }
    }
    if (!swapped) break; // already sorted: gives the O(n) best case
  }
  return steps;
}
