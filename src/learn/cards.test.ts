import { describe, expect, it } from "vitest";
import { PATHFINDING_ALGORITHMS } from "@/pathfinding/utils/constants";
import { SORTING_ALGORITHMS } from "@/sorting/algorithms";
import { PATHFINDING_CARDS, SORTING_CARDS } from "./cards";

const all = [...Object.values(SORTING_CARDS), ...Object.values(PATHFINDING_CARDS)];

describe("learning cards", () => {
  it("cover every algorithm", () => {
    expect(Object.keys(SORTING_CARDS).sort()).toEqual(Object.keys(SORTING_ALGORITHMS).sort());
    expect(Object.keys(PATHFINDING_CARDS).sort()).toEqual(Object.keys(PATHFINDING_ALGORITHMS).sort());
  });

  it.each(all.map((c) => [c.name, c] as const))("%s has a question whose answer is one of its options", (_, card) => {
    const { options, answer } = card.predictQuestion;
    expect(options).toContain(answer);
    expect(new Set(options).size).toBe(options.length);
    expect(card.realWorld.length).toBeGreaterThan(0);
  });
});
