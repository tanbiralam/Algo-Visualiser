import { SortAlgorithm, SortStep } from "../types";
import { bubblePseudocode, bubbleSort } from "./bubble";
import { insertionPseudocode, insertionSort } from "./insertion";
import { mergePseudocode, mergeSort } from "./merge";
import { quickPseudocode, quickSort } from "./quick";
import { selectionPseudocode, selectionSort } from "./selection";

type AlgorithmInfo = {
  label: string;
  description: string;
  best: string;
  average: string;
  worst: string;
  run: (input: number[]) => SortStep[];
  pseudocode: string[];
};

export const SORTING_ALGORITHMS: Record<SortAlgorithm, AlgorithmInfo> = {
  bubble: {
    label: "Bubble Sort",
    description:
      "Repeatedly compares adjacent elements and swaps them when they are out of order, so the largest remaining value bubbles to the end on every pass. Stops early once a pass makes no swaps.",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    run: bubbleSort,
    pseudocode: bubblePseudocode,
  },
  insertion: {
    label: "Insertion Sort",
    description:
      "Builds the sorted prefix one element at a time: takes the next element and shifts larger elements right until it finds its place.",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    run: insertionSort,
    pseudocode: insertionPseudocode,
  },
  selection: {
    label: "Selection Sort",
    description:
      "Finds the minimum of the unsorted part and swaps it into the next position. Always scans the whole remainder, so it does the same work on any input.",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    run: selectionSort,
    pseudocode: selectionPseudocode,
  },
  merge: {
    label: "Merge Sort",
    description:
      "Divide and conquer: splits the array in half, sorts each half recursively, then merges the two sorted halves into one.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    run: mergeSort,
    pseudocode: mergePseudocode,
  },
  quick: {
    label: "Quick Sort",
    description:
      "Picks a pivot (here the last element), moves smaller elements before it and larger after it, then sorts both sides recursively.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    run: quickSort,
    pseudocode: quickPseudocode,
  },
};

export const SORTING_OPTIONS = (Object.keys(SORTING_ALGORITHMS) as SortAlgorithm[]).map(
  (value) => ({ value, label: SORTING_ALGORITHMS[value].label })
);
