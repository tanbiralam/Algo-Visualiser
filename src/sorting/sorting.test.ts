import { describe, expect, it } from "vitest";
import { createRandom, randomInt } from "@/lib/random";
import { SORTING_ALGORITHMS } from "@/sorting/algorithms";
import { replaySort } from "@/sorting/replay";

const rand = createRandom(42);
const inputs: number[][] = [
  [],
  [5],
  [2, 1],
  [3, 3, 3, 3],
  [1, 2, 3, 4, 5],
  [5, 4, 3, 2, 1],
  ...Array.from({ length: 50 }, (_, k) =>
    Array.from({ length: randomInt(rand, 2, 120) }, () =>
      // every third array has many duplicates
      randomInt(rand, 5, k % 3 === 0 ? 10 : 100)
    )
  ),
];

describe.each(Object.entries(SORTING_ALGORITHMS))("%s sort", (_, { run }) => {
  it("replaying all steps yields the sorted array", () => {
    for (const input of inputs) {
      const steps = run(input);
      const { array } = replaySort(input, steps, steps.length);
      expect(array).toEqual(input.slice().sort((a, b) => a - b));
    }
  });

  it("does not mutate its input", () => {
    const input = [3, 1, 2];
    run(input);
    expect(input).toEqual([3, 1, 2]);
  });
});

describe("replaySort", () => {
  it("counts comparisons, swaps and writes up to the given step", () => {
    const steps = SORTING_ALGORITHMS.bubble.run([2, 1]);
    expect(replaySort([2, 1], steps, 0)).toMatchObject({ array: [2, 1], comparisons: 0 });
    expect(replaySort([2, 1], steps, 1)).toMatchObject({ comparisons: 1, swaps: 0, active: [0, 1] });
    expect(replaySort([2, 1], steps, 2)).toMatchObject({ array: [1, 2], swaps: 1 });
  });
});

describe("pseudocode trace", () => {
  it.each(Object.entries(SORTING_ALGORITHMS))("%s steps point at real lines", (_, { run, pseudocode }) => {
    for (const step of run(inputs[10])) {
      expect(step.line).toBeGreaterThanOrEqual(0);
      expect(step.line).toBeLessThan(pseudocode.length);
    }
  });
});
