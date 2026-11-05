import { randomInt } from "@/lib/random";
import { Board } from "./search";
import { EMPTY, MAX_COLS, MAX_ROWS, WALL } from "./utils/constants";
import { MazeType, Point } from "./utils/types";

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

// Wall everything except the endpoints; carving mazes then open cells and the walls between them.
const fillWalls = (start: Point, end: Point) => {
  const ops: WallOp[] = [];
  for (let r = 0; r < MAX_ROWS; r++)
    for (let c = 0; c < MAX_COLS; c++)
      if (!isEndpoint(r, c, start, end)) ops.push({ row: r, col: c, wall: true });
  return ops;
};

// Maze cells sit on odd rows/cols; neighbours are two tiles away with a wall tile between.
const cellNeighbours = ({ row, col }: Point) =>
  [
    { row: row - 2, col },
    { row: row + 2, col },
    { row, col: col - 2 },
    { row, col: col + 2 },
  ].filter((p) => p.row >= 1 && p.row <= MAX_ROWS - 2 && p.col >= 1 && p.col <= MAX_COLS - 2);

const id = (p: Point) => p.row * MAX_COLS + p.col;

const carveBetween = (ops: WallOp[], a: Point, b: Point) => {
  ops.push({ row: (a.row + b.row) / 2, col: (a.col + b.col) / 2, wall: false });
  ops.push({ row: b.row, col: b.col, wall: false });
};

// Depth-first: walk to a random unvisited neighbour, backtrack at dead ends. Long winding corridors.
const backtracker: Generator = (rand, start, end) => {
  const ops = fillWalls(start, end);
  const first = { row: 1, col: 1 };
  ops.push({ ...first, wall: false });
  const visited = new Set([id(first)]);
  const stack = [first];
  while (stack.length) {
    const current = stack[stack.length - 1];
    const options = cellNeighbours(current).filter((n) => !visited.has(id(n)));
    if (!options.length) {
      stack.pop();
      continue;
    }
    const next = options[Math.floor(rand() * options.length)];
    visited.add(id(next));
    carveBetween(ops, current, next);
    stack.push(next);
  }
  return ops;
};

// Randomised Prim: grow the maze from a random frontier cell each step. Many short dead ends.
const prim: Generator = (rand, start, end) => {
  const ops = fillWalls(start, end);
  const first = { row: 1, col: 1 };
  ops.push({ ...first, wall: false });
  const inMaze = new Set([id(first)]);
  const frontier = cellNeighbours(first).map((cell) => ({ cell, from: first }));
  while (frontier.length) {
    const k = Math.floor(rand() * frontier.length);
    const { cell, from } = frontier[k];
    frontier[k] = frontier[frontier.length - 1];
    frontier.pop();
    if (inMaze.has(id(cell))) continue;
    inMaze.add(id(cell));
    carveBetween(ops, from, cell);
    for (const n of cellNeighbours(cell)) if (!inMaze.has(id(n))) frontier.push({ cell: n, from: cell });
  }
  return ops;
};

export const MAZE_GENERATORS: Record<Exclude<MazeType, "NONE">, Generator> = {
  BINARY_TREE: binaryTree,
  RECURSIVE_DIVISION: recursiveDivision,
  BACKTRACKER: backtracker,
  PRIM: prim,
};

/** Mazes only connect odd rows/cols, so endpoints move onto the nearest one before generating. */
export const snapToCell = ({ row, col }: Point): Point => ({
  row: row % 2 ? row : Math.max(1, row - 1),
  col: col % 2 ? col : Math.max(1, col - 1),
});

export const emptyBoard = (): Board =>
  Array.from({ length: MAX_ROWS }, () => Array<number>(MAX_COLS).fill(EMPTY));

export function applyOps(board: Board, ops: WallOp[]) {
  const next = board.map((row) => row.slice());
  for (const op of ops) next[op.row][op.col] = op.wall ? WALL : EMPTY;
  return next;
}
