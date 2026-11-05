export type SortStep =
  | { type: "compare"; indices: [number, number] }
  | { type: "swap"; indices: [number, number] }
  | { type: "write"; index: number; value: number };

export type SortAlgorithm = "bubble" | "insertion" | "selection" | "merge" | "quick";
