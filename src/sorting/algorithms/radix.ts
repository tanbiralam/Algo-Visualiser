import { SortStep } from "../types";

export const radixPseudocode = [
  "for exp = 1, 10, 100, ... while exp <= max",
  "  buckets = 10 empty lists",
  "  for x in a: buckets[digit(x, exp)].push(x)",
  "  a = concat(buckets[0], ..., buckets[9])",
];

// LSD radix sort, base 10, for non-negative integers. Never compares two elements.
export function radixSort(input: number[]): SortStep[] {
  let a = input.slice();
  const steps: SortStep[] = [];
  const max = Math.max(0, ...a);
  for (let exp = 1; exp <= max; exp *= 10) {
    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    a.forEach((x, i) => {
      const digit = Math.floor(x / exp) % 10;
      buckets[digit].push(x);
      steps.push({ type: "read", index: i, line: 2, vars: { exp, x, digit } });
    });
    a = buckets.flat();
    a.forEach((x, k) => {
      steps.push({ type: "write", index: k, value: x, line: 3, vars: { exp, k, digit: Math.floor(x / exp) % 10 } });
    });
  }
  return steps;
}
