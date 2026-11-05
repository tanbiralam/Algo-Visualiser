import { SortStep } from "../types";

export function bubbleSort(input: number[]): SortStep[] {
  const a = input.slice();
  const steps: SortStep[] = [];
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ type: "compare", indices: [j, j + 1] });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ type: "swap", indices: [j, j + 1] });
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted: gives the O(n) best case
  }
  return steps;
}
