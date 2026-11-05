import { memo, MouseEvent, useEffect, useRef } from "react";
import { PATH, Point, VISITED } from "./search";
import {
  END_TILE_STYLE,
  MAX_COLS,
  MAX_ROWS,
  PATH_TILE_STYLE,
  START_TILE_STYLE,
  TILE_STYLE,
  TRAVERSED_TILE_STYLE,
  WALL_TILE_STYLE,
} from "./utils/constants";

const Tile = memo(function Tile({ row, col, className }: { row: number; col: number; className: string }) {
  return <div data-row={row} data-col={col} className={className} />;
});

function tileClass(row: number, col: number, isWall: boolean, status: number, start: Point, end: Point) {
  let cls =
    row === start.row && col === start.col
      ? START_TILE_STYLE
      : row === end.row && col === end.col
        ? END_TILE_STYLE
        : isWall
          ? WALL_TILE_STYLE
          : status === PATH
            ? PATH_TILE_STYLE
            : status === VISITED
              ? TRAVERSED_TILE_STYLE
              : TILE_STYLE;
  if (row === MAX_ROWS - 1) cls += " border-b";
  if (col === 0) cls += " border-l";
  return cls;
}

const cellOf = (e: MouseEvent) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
  return el ? { row: Number(el.dataset.row), col: Number(el.dataset.col) } : null;
};

/** Click or drag to paint walls; the first tile decides whether the drag adds or erases. */
export function Grid({
  walls,
  status,
  start,
  end,
  onPaint,
}: {
  walls: boolean[][];
  status: Uint8Array;
  start: Point;
  end: Point;
  onPaint?: (row: number, col: number, wall: boolean) => void;
}) {
  const paintValue = useRef<boolean | null>(null);
  useEffect(() => {
    const stop = () => (paintValue.current = null);
    window.addEventListener("mouseup", stop);
    return () => window.removeEventListener("mouseup", stop);
  }, []);

  const isEndpoint = (p: Point) =>
    (p.row === start.row && p.col === start.col) || (p.row === end.row && p.col === end.col);

  const handleDown = (e: MouseEvent) => {
    const cell = cellOf(e);
    if (!onPaint || !cell || isEndpoint(cell)) return;
    e.preventDefault(); // stop text selection while dragging
    paintValue.current = !walls[cell.row][cell.col];
    onPaint(cell.row, cell.col, paintValue.current);
  };

  const handleOver = (e: MouseEvent) => {
    const cell = cellOf(e);
    if (!onPaint || !cell || paintValue.current === null || isEndpoint(cell)) return;
    onPaint(cell.row, cell.col, paintValue.current);
  };

  return (
    <div
      className={`m-auto select-none ${onPaint ? "cursor-crosshair" : ""}`}
      onMouseDown={handleDown}
      onMouseOver={handleOver}
    >
      {walls.map((rowWalls, row) => (
        <div key={row} className="flex">
          {rowWalls.map((isWall, col) => (
            <Tile
              key={col}
              row={row}
              col={col}
              className={tileClass(row, col, isWall, status[row * MAX_COLS + col], start, end)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
