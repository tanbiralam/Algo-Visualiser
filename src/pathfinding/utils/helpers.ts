import { MAX_COLS, MAX_ROWS } from "./constants";
import { GridType, Point, TileType } from "./types";

const createRow = (row: number, startTile: Point, endTile: Point) => {
  const currentRow: TileType[] = [];
  for (let col = 0; col < MAX_COLS; col++) {
    currentRow.push({
      row,
      col,
      isEnd: row === endTile.row && col === endTile.col,
      isWall: false,
      isPath: false,
      distance: Infinity,
      weight: 1,
      isStart: row === startTile.row && col === startTile.col,
      isTraversed: false,
      parent: null,
    });
  }
  return currentRow;
};

export const createGrid = (startTile: Point, endTile: Point) => {
  const grid: GridType = [];
  for (let row = 0; row < MAX_ROWS; row++) {
    grid.push(createRow(row, startTile, endTile));
  }
  return grid;
};

export const buildPath = (
  grid: GridType,
  endTile: Point,
  traversedTiles: TileType[]
) => {
  const path: TileType[] = [];
  const last = traversedTiles[traversedTiles.length - 1];
  if (!last || !isEqual(last, endTile)) return path; // end unreachable

  let current: TileType | null = grid[endTile.row][endTile.col];
  while (current) {
    current.isPath = true;
    path.unshift(current);
    current = current.parent;
  }
  return path;
};

export const isEqual = (a: Point, b: Point) => {
  return a.row === b.row && a.col === b.col;
};

export const checkStack = (tile: TileType, stack: TileType[]) => {
  for (let i = 0; i < stack.length; i++) {
    if (isEqual(stack[i], tile)) return true;
  }
  return false;
};

export const dropFromQueue = (tile: TileType, queue: TileType[]) => {
  for (let i = 0; i < queue.length; i++) {
    if (isEqual(tile, queue[i])) {
      queue.splice(i, 1);
      break;
    }
  }
};
