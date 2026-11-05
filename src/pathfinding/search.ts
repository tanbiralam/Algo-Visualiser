import { aStar } from "./lib/algorithms/pathfinding/aStar";
import { bfs } from "./lib/algorithms/pathfinding/bfs";
import { dfs } from "./lib/algorithms/pathfinding/dfs";
import { dijkstra } from "./lib/algorithms/pathfinding/dijkstra";
import { MAX_COLS, MAX_ROWS } from "./utils/constants";
import { createGrid } from "./utils/helpers";
import { AlgorithmType, TileType } from "./utils/types";

export type Walls = boolean[][];
export type Point = { row: number; col: number };
export type SearchStep = { type: "visit" | "path"; row: number; col: number };

const ALGORITHMS = { BFS: bfs, DFS: dfs, DIJKSTRA: dijkstra, A_STAR: aStar };

/** Runs a search on a fresh grid and flattens it into playable steps. */
export function runSearch(algorithm: AlgorithmType, walls: Walls, start: TileType, end: TileType) {
  const grid = createGrid(start, end);
  grid.forEach((row, r) => row.forEach((tile, c) => (tile.isWall = walls[r][c])));
  const { traversedTiles, path } = ALGORITHMS[algorithm](grid, start, end);
  const steps: SearchStep[] = [
    ...traversedTiles.map(({ row, col }) => ({ type: "visit" as const, row, col })),
    ...path.map(({ row, col }) => ({ type: "path" as const, row, col })),
  ];
  return { steps, visited: traversedTiles.length, pathLength: path.length, found: path.length > 0 };
}

export const VISITED = 1;
export const PATH = 2;

/** Tile status (0 / VISITED / PATH) after the first `upto` steps, indexed row * MAX_COLS + col. */
export function replaySearch(steps: SearchStep[], upto: number) {
  const status = new Uint8Array(MAX_ROWS * MAX_COLS);
  for (let k = 0; k < upto; k++) {
    const s = steps[k];
    status[s.row * MAX_COLS + s.col] = s.type === "visit" ? VISITED : PATH;
  }
  return status;
}
