import { Trace } from "@/engine/types";
import { aStar } from "./lib/algorithms/pathfinding/aStar";
import { bfs } from "./lib/algorithms/pathfinding/bfs";
import { dfs } from "./lib/algorithms/pathfinding/dfs";
import { dijkstra } from "./lib/algorithms/pathfinding/dijkstra";
import { MAX_COLS, MAX_ROWS, PATHFINDING_ALGORITHMS, WALL, WEIGHT, WEIGHT_COST } from "./utils/constants";
import { createGrid, isEqual } from "./utils/helpers";
import { AlgorithmType, Point, TileType } from "./utils/types";

/** Board[row][col] is EMPTY, WALL or WEIGHT. */
export type Board = number[][];
export type SearchStep = Trace & { type: "visit" | "path"; row: number; col: number };
export type SearchResult = ReturnType<typeof runSearch>;

const ALGORITHMS = { BFS: bfs, DFS: dfs, DIJKSTRA: dijkstra, A_STAR: aStar };
const PATH_LINE = 6; // last pseudocode line: follow parents back

/** Runs a search on a fresh grid and flattens it into playable, traced steps. */
export function runSearch(algorithm: AlgorithmType, board: Board, start: Point, end: Point) {
  const grid = createGrid(start, end);
  grid.forEach((row, r) =>
    row.forEach((tile, c) => {
      tile.isWall = board[r][c] === WALL;
      tile.weight = board[r][c] === WEIGHT ? WEIGHT_COST : 1;
    })
  );
  const startedAt = performance.now();
  const { traversedTiles, path, frontier } = ALGORITHMS[algorithm](grid, start, end);
  const ms = performance.now() - startedAt;
  const frontierLabel = PATHFINDING_ALGORITHMS[algorithm].frontier;

  const visitVars = (tile: TileType, k: number): SearchStep["vars"] => {
    const vars: SearchStep["vars"] = { tile: `(${tile.row}, ${tile.col})`, [frontierLabel]: frontier[k] };
    if (algorithm === "A_STAR") {
      const h = Math.abs(tile.row - end.row) + Math.abs(tile.col - end.col);
      return { ...vars, g: tile.distance, h, f: tile.distance + h };
    }
    return { ...vars, [algorithm === "DFS" ? "depth" : "dist"]: tile.distance };
  };

  const steps: SearchStep[] = [
    ...traversedTiles.map((tile, k) => ({
      type: "visit" as const,
      row: tile.row,
      col: tile.col,
      line: isEqual(tile, end) ? 3 : 2,
      vars: visitVars(tile, k),
    })),
    ...path.map((tile, k) => ({
      type: "path" as const,
      row: tile.row,
      col: tile.col,
      line: PATH_LINE,
      vars: { tile: `(${tile.row}, ${tile.col})`, "path length": `${k + 1} / ${path.length}` },
    })),
  ];
  // Cost of a path = sum of the weights of every tile entered after the start.
  const cost = path.slice(1).reduce((sum, tile) => sum + tile.weight, 0);
  return { steps, visited: traversedTiles.length, pathLength: path.length, cost, found: path.length > 0, ms };
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
