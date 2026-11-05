import { describe, expect, it } from "vitest";
import { createRandom } from "@/lib/random";
import { applyOps, emptyBoard, MAZE_GENERATORS } from "./mazes";
import { decodeBoard, encodeBoard, encodePoint, parsePathfindingParams } from "./share";
import { DEFAULT_END, DEFAULT_START, EMPTY, WALL, WEIGHT } from "./utils/constants";

describe("board codec", () => {
  it("round-trips walls and weights", () => {
    const rand = createRandom(2);
    const board = emptyBoard().map((row) => row.map(() => [EMPTY, WALL, WEIGHT][Math.floor(rand() * 3)]));
    expect(decodeBoard(encodeBoard(board))).toEqual(board);
  });

  it("round-trips a maze and keeps the URL short", () => {
    const board = applyOps(emptyBoard(), MAZE_GENERATORS.PRIM(createRandom(1), DEFAULT_START, DEFAULT_END));
    const text = encodeBoard(board);
    expect(text.length).toBeLessThan(700);
    expect(text).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(decodeBoard(text)).toEqual(board);
  });

  it("encodes an empty board as an empty string", () => {
    expect(encodeBoard(emptyBoard())).toBe("");
  });

  it("rejects malformed input", () => {
    expect(decodeBoard("not*base64")).toBeUndefined();
    expect(decodeBoard("AAAA")).toBeUndefined();
  });
});

describe("parsePathfindingParams", () => {
  it("reads valid params and clears walls under the endpoints", () => {
    const board = emptyBoard().map((row) => row.map(() => WALL));
    const search = `?algo=A_STAR&vs=BFS&start=${encodePoint({ row: 3, col: 4 })}&end=10,20&board=${encodeBoard(board)}`;
    const parsed = parsePathfindingParams(search);
    expect(parsed).toMatchObject({ algorithm: "A_STAR", rival: "BFS", start: { row: 3, col: 4 }, end: { row: 10, col: 20 } });
    expect(parsed.board![3][4]).toBe(EMPTY);
    expect(parsed.board![10][20]).toBe(EMPTY);
    expect(parsed.board![0][0]).toBe(WALL);
  });

  it("ignores invalid values", () => {
    const parsed = parsePathfindingParams("?algo=EVIL&vs=<x>&start=-1,2&end=999,1&board=%%%");
    expect(parsed).toEqual({ algorithm: undefined, rival: undefined, start: undefined, end: undefined, board: undefined });
    expect(parsePathfindingParams("?start=5,5&end=5,5")).toMatchObject({ start: undefined, end: undefined });
  });
});
