import { Trace } from "@/engine/types";

export type SortStep = Trace &
  (
    | { type: "compare"; indices: [number, number] }
    | { type: "swap"; indices: [number, number] }
    | { type: "write"; index: number; value: number }
    | { type: "read"; index: number } // radix sort looking at a digit, not a comparison
  );

export type SortAlgorithm = "bubble" | "insertion" | "selection" | "merge" | "quick" | "heap" | "radix";
