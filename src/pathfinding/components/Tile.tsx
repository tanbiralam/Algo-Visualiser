import { twMerge } from "tailwind-merge";
import {
  END_TILE_STYLE,
  MAX_ROWS,
  PATH_TILE_STYLE,
  START_TILE_STYLE,
  TILE_STYLE,
  TRAVERSED_TILE_STYLE,
  WALL_TILE_STYLE,
} from "../utils/constants";

interface MouseFunction {
  (row: number, column: number): void;
}

export function Tile({
  row,
  col,
  isStart,
  isEnd,
  isTraversed,
  isWall,
  isPath,
  handleMouseDown,
  handleMouseUp,
  handleMouseEnter,
}: {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isPath: boolean;
  isTraversed: boolean;
  handleMouseUp: MouseFunction;
  handleMouseDown: MouseFunction;
  handleMouseEnter: MouseFunction;
}) {
  let tileTypeStyle;

  if (isStart) {
    tileTypeStyle = START_TILE_STYLE;
  } else if (isEnd) {
    tileTypeStyle = END_TILE_STYLE;
  } else if (isWall) {
    tileTypeStyle = WALL_TILE_STYLE;
  } else if (isPath) {
    tileTypeStyle = PATH_TILE_STYLE;
  } else if (isTraversed) {
    tileTypeStyle = TRAVERSED_TILE_STYLE;
  } else {
    tileTypeStyle = TILE_STYLE;
  }

  const borderStyle =
    row === MAX_ROWS - 1 ? "border-b" : col === 0 ? "border-l" : "";
  const edgeStyle = row === MAX_ROWS - 1 && col === 0 ? "border-l" : "";

  return (
    <div
      className={twMerge(tileTypeStyle, borderStyle, edgeStyle)}
      id={`${row}-${col}`}
      onMouseDown={() => handleMouseDown(row, col)}
      onMouseUp={() => handleMouseUp(row, col)}
      onMouseEnter={() => handleMouseEnter(row, col)}
    />
  );
}
