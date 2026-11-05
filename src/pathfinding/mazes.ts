import { randomInt } from "@/lib/random";
import { Point } from "./search";
import { MAX_COLS, MAX_ROWS } from "./utils/constants";
import { MazeType } from "./utils/types";

/** One change to the wall layout; a maze is an ordered list of these so it can be animated. */
export type WallOp = { row: number; col: number; wall: boolean };
type Generator = (rand: () => number, start: Point, end: Point) => WallOp[];

const isEndpoint = (r: number, c: number, start: Point, end: Point) =>
  (r === start.row && c === start.col) || (r === end.row && c === end.col);

// Wall every even row/column, then carve right or down from each odd cell.
const binaryTree: Generator = (rand, start, end) => {
  const ops: WallOp[] = [];
  for (let r = 0; r < MAX_ROWS; r++)
    for (let c = 0; c < MAX_COLS; c++)
      if ((r % 2 === 0 || c % 2 === 0) && !isEndpoint(r, c, start, end))
        ops.push({ row: r, col: c, wall: true });

  for (let r = 1; r < MAX_ROWS - 1; r += 2) {
    for (let c = 1; c < MAX_COLS - 1; c += 2) {
      const lastRow = r === MAX_ROWS - 2;
      const lastCol = c === MAX_COLS - 2;
      if (lastRow && lastCol) continue;
      const right = lastRow || (!lastCol && rand() < 0.5);
      ops.push(right ? { row: r, col: c + 1, wall: false } : { row: r + 1, col: c, wall: false });
    }
  }
  return ops;
};

// Border, then split each chamber with a wall that has one gap, recursively.
const recursiveDivision: Generator = (rand, start, end) => {
  const ops: WallOp[] = [];
  const wall = (r: number, c: number) => {
    if (!isEndpoint(r, c, start, end)) ops.push({ row: r, col: c, wall: true });
  };
  for (let c = 0; c < MAX_COLS; c++) wall(0, c);
  for (let r = 1; r < MAX_ROWS; r++) wall(r, MAX_COLS - 1);
  for (let c = MAX_COLS - 2; c >= 0; c--) wall(MAX_ROWS - 1, c);
  for (let r = MAX_ROWS - 2; r > 0; r--) wall(r, 0);

  // Chambers are measured in cells: odd rows/cols are cells, even ones can hold walls.
  const divide = (row: number, col: number, height: number, width: number) => {
    if (height <= 1 || width <= 1) return;
    if (height > width) {
      const wallRow = row + randomInt(rand, 0, height - 2) * 2 + 1;
      const gap = col + randomInt(rand, 0, width - 1) * 2;
      for (let c = col; c < col + 2 * width - 1; c++) if (c !== gap) wall(wallRow, c);
      const top = (wallRow - row + 1) / 2;
      divide(row, col, top, width);
      divide(wallRow + 1, col, height - top, width);
    } else {
      const wallCol = col + randomInt(rand, 0, width - 2) * 2 + 1;
      const gap = row + randomInt(rand, 0, height - 1) * 2;
      for (let r = row; r < row + 2 * height - 1; r++) if (r !== gap) wall(r, wallCol);
      const left = (wallCol - col + 1) / 2;
      divide(row, col, height, left);
      divide(row, wallCol + 1, height, width - left);
    }
  };
  divide(1, 1, (MAX_ROWS - 1) / 2, (MAX_COLS - 1) / 2);
  return ops;
};

export const MAZE_GENERATORS: Record<Exclude<MazeType, "NONE">, Generator> = {
  BINARY_TREE: binaryTree,
  RECURSIVE_DIVISION: recursiveDivision,
};

export const emptyWalls = () =>
  Array.from({ length: MAX_ROWS }, () => Array<boolean>(MAX_COLS).fill(false));

export function applyOps(walls: boolean[][], ops: WallOp[]) {
  const next = walls.map((row) => row.slice());
  for (const op of ops) next[op.row][op.col] = op.wall;
  return next;
}
