import { SortStep } from "../types";

export function selectionSort(input: number[]): SortStep[] {
  const a = input.slice();
  const steps: SortStep[] = [];
  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ type: "compare", indices: [min, j] });
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      steps.push({ type: "swap", indices: [i, min] });
    }
  }
  return steps;
}
