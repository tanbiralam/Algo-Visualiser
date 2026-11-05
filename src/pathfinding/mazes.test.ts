import { describe, expect, it } from "vitest";
import { createRandom, randomInt } from "@/lib/random";
import { applyOps, emptyBoard, MAZE_GENERATORS, snapToCell } from "./mazes";
import { runSearch } from "./search";
import { DEFAULT_END, DEFAULT_START, MAX_COLS, MAX_ROWS, WALL } from "./utils/constants";

describe.each(Object.entries(MAZE_GENERATORS))("%s maze", (_, generate) => {
  it("never walls the endpoints and always leaves the end reachable", () => {
    const rand = createRandom(3);
    for (let seed = 1; seed <= 30; seed++) {
      // default endpoints first, then random ones snapped onto maze cells
      const start = seed === 1 ? DEFAULT_START : snapToCell({ row: randomInt(rand, 0, MAX_ROWS - 1), col: randomInt(rand, 0, MAX_COLS - 1) });
      let end = seed === 1 ? DEFAULT_END : snapToCell({ row: randomInt(rand, 0, MAX_ROWS - 1), col: randomInt(rand, 0, MAX_COLS - 1) });
      if (end.row === start.row && end.col === start.col) end = DEFAULT_END.row === start.row && DEFAULT_END.col === start.col ? DEFAULT_START : DEFAULT_END;
      const board = applyOps(emptyBoard(), generate(createRandom(seed), start, end));
      expect(board[start.row][start.col]).not.toBe(WALL);
      expect(board[end.row][end.col]).not.toBe(WALL);
      expect(runSearch("BFS", board, start, end).found).toBe(true);
    }
  });

  it("is reproducible from a seed", () => {
    expect(generate(createRandom(5), DEFAULT_START, DEFAULT_END)).toEqual(
      generate(createRandom(5), DEFAULT_START, DEFAULT_END)
    );
  });
});

describe("snapToCell", () => {
  it("moves points onto odd rows and columns inside the grid", () => {
    expect(snapToCell({ row: 0, col: 0 })).toEqual({ row: 1, col: 1 });
    expect(snapToCell({ row: MAX_ROWS - 1, col: MAX_COLS - 1 })).toEqual({ row: MAX_ROWS - 2, col: MAX_COLS - 2 });
    expect(snapToCell({ row: 5, col: 8 })).toEqual({ row: 5, col: 7 });
  });
});
