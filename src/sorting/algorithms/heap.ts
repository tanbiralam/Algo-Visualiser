import { SortStep } from "../types";

export const heapPseudocode = [
  "for i = n / 2 - 1 down to 0: siftDown(i, n)",
  "for end = n - 1 down to 1",
  "  swap a[0], a[end]",
  "  siftDown(0, end)",
  "siftDown(i, size):",
  "  largest = largest of a[i] and its children",
  "  if largest != i: swap, repeat at largest",
];

export function heapSort(input: number[]): SortStep[] {
  const a = input.slice();
  const steps: SortStep[] = [];
  const swap = (x: number, y: number, line: number, vars: SortStep["vars"]) => {
    [a[x], a[y]] = [a[y], a[x]];
    steps.push({ type: "swap", indices: [x, y], line, vars });
  };

  // Move a[i] down until it is larger than both children (max-heap within a[0..size)).
  const siftDown = (i: number, size: number) => {
    for (;;) {
      let largest = i;
      for (const child of [2 * i + 1, 2 * i + 2]) {
        if (child >= size) continue;
        steps.push({ type: "compare", indices: [largest, child], line: 5, vars: { size, i, child, largest } });
        if (a[child] > a[largest]) largest = child;
      }
      if (largest === i) return;
      swap(i, largest, 6, { size, i, largest });
      i = largest;
    }
  };

  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) siftDown(i, a.length);
  for (let end = a.length - 1; end > 0; end--) {
    swap(0, end, 2, { end });
    siftDown(0, end);
  }
  return steps;
}
