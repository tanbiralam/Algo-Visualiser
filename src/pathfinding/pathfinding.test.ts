import { describe, expect, it } from "vitest";
import { createRandom } from "@/lib/random";
import { bfs } from "./lib/algorithms/pathfinding/bfs";
import { dfs } from "./lib/algorithms/pathfinding/dfs";
import { dijkstra } from "./lib/algorithms/pathfinding/dijkstra";
import { aStar } from "./lib/algorithms/pathfinding/aStar";
import { createGrid } from "./utils/helpers";
import {
  END_TILE_CONFIGURATION as END,
  MAX_COLS,
  MAX_ROWS,
  START_TILE_CONFIGURATION as START,
} from "./utils/constants";
import { GridType, TileType } from "./utils/types";

type Walls = boolean[][];

function randomWalls(rand: () => number, density: number): Walls {
  return Array.from({ length: MAX_ROWS }, (_, r) =>
    Array.from(
      { length: MAX_COLS },
      (_, c) =>
        !(r === START.row && c === START.col) &&
        !(r === END.row && c === END.col) &&
        rand() < density
    )
  );
}

function gridFrom(walls: Walls): GridType {
  const grid = createGrid(START, END);
  grid.forEach((row, r) => row.forEach((tile, c) => (tile.isWall = walls[r][c])));
  return grid;
}

// Independent BFS: shortest number of moves from start to end, or -1.
function shortestDistance(walls: Walls) {
  const dist = walls.map((row) => row.map(() => -1));
  dist[START.row][START.col] = 0;
  const queue = [[START.row, START.col]];
  for (let head = 0; head < queue.length; head++) {
    const [r, c] = queue[head];
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= MAX_ROWS || nc < 0 || nc >= MAX_COLS) continue;
      if (walls[nr][nc] || dist[nr][nc] >= 0) continue;
      dist[nr][nc] = dist[r][c] + 1;
      queue.push([nr, nc]);
    }
  }
  return dist[END.row][END.col];
}

function expectValidPath(path: TileType[]) {
  expect(path[0]).toMatchObject({ row: START.row, col: START.col });
  expect(path[path.length - 1]).toMatchObject({ row: END.row, col: END.col });
  path.forEach((tile, k) => {
    expect(tile.isWall).toBe(false);
    if (k === 0) return;
    const prev = path[k - 1];
    expect(Math.abs(tile.row - prev.row) + Math.abs(tile.col - prev.col)).toBe(1);
  });
}

const rand = createRandom(7);
const cases = Array.from({ length: 80 }, (_, k) =>
  randomWalls(rand, [0, 0.2, 0.3, 0.45][k % 4])
);

const algorithms = { bfs, dfs, dijkstra, aStar };
const shortest = new Set(["bfs", "dijkstra", "aStar"]);

describe.each(Object.entries(algorithms))("%s", (name, run) => {
  it(shortest.has(name) ? "finds a shortest path" : "finds a valid path", () => {
    for (const walls of cases) {
      const expected = shortestDistance(walls);
      const { path } = run(gridFrom(walls), START, END);
      if (expected < 0) {
        expect(path).toEqual([]);
        continue;
      }
      expectValidPath(path);
      if (shortest.has(name)) expect(path.length - 1).toBe(expected);
    }
  });

  it("returns an empty path when the end is walled off", () => {
    const walls = randomWalls(createRandom(1), 0);
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      walls[END.row + dr][END.col + dc] = true;
    }
    expect(run(gridFrom(walls), START, END).path).toEqual([]);
  });
});
