import { SortStep } from "../types";

export function insertionSort(input: number[]): SortStep[] {
  const a = input.slice();
  const steps: SortStep[] = [];
  for (let i = 1; i < a.length; i++) {
    const current = a[i];
    let j = i - 1;
    while (j >= 0) {
      steps.push({ type: "compare", indices: [j, j + 1] });
      if (a[j] <= current) break;
      a[j + 1] = a[j];
      steps.push({ type: "write", index: j + 1, value: a[j] });
      j--;
    }
    if (j + 1 !== i) {
      a[j + 1] = current;
      steps.push({ type: "write", index: j + 1, value: current });
    }
  }
  return steps;
}
