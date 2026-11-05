import { describe, expect, it } from "vitest";
import { createRandom, randomInt } from "@/lib/random";
import { SORTING_ALGORITHMS } from "@/sorting/algorithms";
import { replaySort } from "@/sorting/replay";
import { generateInput, INPUT_OPTIONS } from "@/sorting/input";

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

describe("generateInput", () => {
  const sortedAsc = (a: number[]) => a.every((x, i) => i === 0 || a[i - 1] <= x);

  it("produces the requested size within range, reproducibly", () => {
    for (const { value } of INPUT_OPTIONS) {
      const a = generateInput(value, 57, createRandom(9));
      expect(a).toHaveLength(57);
      expect(a.every((x) => x >= 5 && x <= 100)).toBe(true);
      expect(generateInput(value, 57, createRandom(9))).toEqual(a);
    }
  });

  it("shapes the input per preset", () => {
    const reversed = generateInput("reversed", 100, createRandom(1));
    expect(sortedAsc(reversed.slice().reverse())).toBe(true);
    expect(new Set(generateInput("few", 100, createRandom(1))).size).toBeLessThanOrEqual(4);
    const nearly = generateInput("nearly", 100, createRandom(1));
    const outOfOrder = nearly.filter((x, i) => i > 0 && nearly[i - 1] > x).length;
    expect(outOfOrder).toBeGreaterThan(0);
    expect(outOfOrder).toBeLessThanOrEqual(10);
  });
});

describe("radix sort", () => {
  it("never compares elements", () => {
    const input = generateInput("random", 60, createRandom(4));
    const steps = SORTING_ALGORITHMS.radix.run(input);
    expect(replaySort(input, steps, steps.length).comparisons).toBe(0);
  });
});

it("pseudocode lines fit the side panel", () => {
  for (const { pseudocode } of Object.values(SORTING_ALGORITHMS))
    for (const line of pseudocode) expect(line.length).toBeLessThanOrEqual(48);
});
