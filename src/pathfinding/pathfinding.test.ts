import { describe, expect, it } from "vitest";
import { createRandom, randomInt } from "@/lib/random";
import { Board, runSearch } from "./search";
import {
  EMPTY,
  MAX_COLS,
  MAX_ROWS,
  PATHFINDING_ALGORITHMS,
  WALL,
  WEIGHT,
  WEIGHT_COST,
} from "./utils/constants";
import { AlgorithmType, Point } from "./utils/types";

type Case = { board: Board; start: Point; end: Point };
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const cost = (board: Board, p: Point) => (board[p.row][p.col] === WEIGHT ? WEIGHT_COST : 1);

function randomCase(rand: () => number, wallDensity: number, weightDensity: number): Case {
  const point = () => ({ row: randomInt(rand, 0, MAX_ROWS - 1), col: randomInt(rand, 0, MAX_COLS - 1) });
  const start = point();
  let end = point();
  while (end.row === start.row && end.col === start.col) end = point();
  const board = Array.from({ length: MAX_ROWS }, (_, r) =>
    Array.from({ length: MAX_COLS }, (_, c) => {
      if ((r === start.row && c === start.col) || (r === end.row && c === end.col)) return EMPTY;
      const x = rand();
      return x < wallDensity ? WALL : x < wallDensity + weightDensity ? WEIGHT : EMPTY;
    })
  );
  return { board, start, end };
}

// Independent reference: Dijkstra over move costs. With unit costs this is plain BFS.
function cheapest({ board, start, end }: Case, unitCost: boolean) {
  const dist = board.map((row) => row.map(() => Infinity));
  dist[start.row][start.col] = 0;
  const done = board.map((row) => row.map(() => false));
  for (;;) {
    let best: Point | null = null;
    for (let r = 0; r < MAX_ROWS; r++)
      for (let c = 0; c < MAX_COLS; c++)
        if (!done[r][c] && dist[r][c] < Infinity && (!best || dist[r][c] < dist[best.row][best.col]))
          best = { row: r, col: c };
    if (!best) return Infinity;
    if (best.row === end.row && best.col === end.col) return dist[best.row][best.col];
    done[best.row][best.col] = true;
    for (const [dr, dc] of DIRS) {
      const n = { row: best.row + dr, col: best.col + dc };
      if (n.row < 0 || n.row >= MAX_ROWS || n.col < 0 || n.col >= MAX_COLS) continue;
      if (board[n.row][n.col] === WALL) continue;
      const d = dist[best.row][best.col] + (unitCost ? 1 : cost(board, n));
      if (d < dist[n.row][n.col]) dist[n.row][n.col] = d;
    }
  }
}

function expectValidPath({ board, start, end }: Case, path: Point[]) {
  expect(path[0]).toEqual(start);
  expect(path[path.length - 1]).toEqual(end);
  path.forEach((p, k) => {
    expect(board[p.row][p.col]).not.toBe(WALL);
    if (k) expect(Math.abs(p.row - path[k - 1].row) + Math.abs(p.col - path[k - 1].col)).toBe(1);
  });
}

const rand = createRandom(7);
const cases = Array.from({ length: 40 }, (_, k) =>
  randomCase(rand, [0, 0.2, 0.3, 0.45][k % 4], [0, 0.15, 0.3][k % 3])
);
const ALGORITHMS: AlgorithmType[] = ["BFS", "DFS", "DIJKSTRA", "A_STAR"];

describe.each(ALGORITHMS)("%s", (algorithm) => {
  it("finds a valid path exactly when the end is reachable", () => {
    for (const c of cases) {
      const result = runSearch(algorithm, c.board, c.start, c.end);
      const path = result.steps.filter((s) => s.type === "path").map(({ row, col }) => ({ row, col }));
      expect(result.found).toBe(cheapest(c, true) < Infinity);
      if (result.found) expectValidPath(c, path);
      else expect(path).toEqual([]);
    }
  });

  it("returns no path when the end is walled off", () => {
    const c = randomCase(createRandom(1), 0, 0);
    for (const [dr, dc] of DIRS) {
      const r = c.end.row + dr;
      const col = c.end.col + dc;
      if (r >= 0 && r < MAX_ROWS && col >= 0 && col < MAX_COLS && !(r === c.start.row && col === c.start.col))
        c.board[r][col] = WALL;
    }
    const startNextToEnd = Math.abs(c.start.row - c.end.row) + Math.abs(c.start.col - c.end.col) === 1;
    expect(runSearch(algorithm, c.board, c.start, c.end).found).toBe(startNextToEnd);
  });
});

describe("optimality", () => {
  it("BFS finds the fewest moves, ignoring weights", () => {
    for (const c of cases) {
      const result = runSearch("BFS", c.board, c.start, c.end);
      if (result.found) expect(result.pathLength - 1).toBe(cheapest(c, true));
    }
  });

  it.each(["DIJKSTRA", "A_STAR"] as const)("%s finds the cheapest path through weights", (algorithm) => {
    for (const c of cases) {
      const result = runSearch(algorithm, c.board, c.start, c.end);
      if (result.found) expect(result.cost).toBe(cheapest(c, false));
    }
  });

  it("weights make Dijkstra differ from BFS", () => {
    const differs = cases.some((c) => {
      const bfs = runSearch("BFS", c.board, c.start, c.end);
      const dijkstra = runSearch("DIJKSTRA", c.board, c.start, c.end);
      return bfs.found && dijkstra.cost < bfs.cost;
    });
    expect(differs).toBe(true);
  });
});

describe("runSearch trace", () => {
  it("points every step at a real pseudocode line with live variables", () => {
    for (const algorithm of ALGORITHMS) {
      const { steps } = runSearch(algorithm, cases[1].board, cases[1].start, cases[1].end);
      const lines = PATHFINDING_ALGORITHMS[algorithm].pseudocode.length;
      for (const step of steps) {
        expect(step.line).toBeGreaterThanOrEqual(0);
        expect(step.line).toBeLessThan(lines);
        expect(Object.keys(step.vars).length).toBeGreaterThan(0);
      }
      expect(steps[0].vars[PATHFINDING_ALGORITHMS[algorithm].frontier]).toBeDefined();
    }
  });
});

it("pseudocode lines fit the side panel", () => {
  for (const { pseudocode } of Object.values(PATHFINDING_ALGORITHMS))
    for (const line of pseudocode) expect(line.length).toBeLessThanOrEqual(48);
});
