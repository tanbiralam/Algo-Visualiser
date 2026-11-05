import { describe, expect, it } from "vitest";
import { createRandom, randomInt } from "@/lib/random";
import { AnimationArrayType } from "@/sorting/lib/types";
import { generateBubbleSortAnimationArray } from "@/sorting/algorithm/bubbleSort";
import { generateInsertionSortAnimationArray } from "@/sorting/algorithm/insertionSort";
import { generateSelectionSortAnimationArray } from "@/sorting/algorithm/selectionSort";
import { generateMergeSortAnimationArray } from "@/sorting/algorithm/mergeSort";
import { generateQuickSortAnimationArray } from "@/sorting/algorithm/quickSort";

const algorithms = {
  bubble: generateBubbleSortAnimationArray,
  insertion: generateInsertionSortAnimationArray,
  selection: generateSelectionSortAnimationArray,
  merge: generateMergeSortAnimationArray,
  quick: generateQuickSortAnimationArray,
};

// Replays the recorded animation writes on a copy of the input.
function replay(input: number[], run: (typeof algorithms)["bubble"]) {
  let animations: AnimationArrayType = [];
  run(false, input, (a) => (animations = a));
  const result = input.slice();
  for (const [indexes, isWrite] of animations) {
    if (isWrite) result[indexes[0]] = indexes[1];
  }
  return result;
}

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
      randomInt(rand, 35, k % 3 === 0 ? 40 : 500)
    )
  ),
];

describe.each(Object.entries(algorithms))("%s sort", (_, run) => {
  it("animations reproduce a sorted array", () => {
    for (const input of inputs) {
      expect(replay(input, run)).toEqual(input.slice().sort((a, b) => a - b));
    }
  });

  it("does nothing while already sorting", () => {
    let called = false;
    run(true, [3, 1, 2], () => (called = true));
    expect(called).toBe(false);
  });
});
