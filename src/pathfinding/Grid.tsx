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
  if (row === start.row && col === start.col) return START_TILE_STYLE;
  if (row === end.row && col === end.col) return END_TILE_STYLE;
  if (isWall) return WALL_TILE_STYLE;
  if (status === PATH) return PATH_TILE_STYLE;
  if (status === VISITED) return TRAVERSED_TILE_STYLE;
  return TILE_STYLE;
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
    // Size container: the grid takes the largest size with the right aspect ratio that fits.
    <div className="flex h-full w-full items-center justify-center [container-type:size]">
      <div
        className={`grid select-none gap-px border border-sky-200/25 bg-sky-200/25 ${onPaint ? "cursor-crosshair" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${MAX_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${MAX_ROWS}, 1fr)`,
          width: `min(100cqw, 100cqh * ${MAX_COLS / MAX_ROWS})`,
          aspectRatio: `${MAX_COLS} / ${MAX_ROWS}`,
        }}
        onMouseDown={handleDown}
        onMouseOver={handleOver}
      >
        {walls.map((rowWalls, row) =>
          rowWalls.map((isWall, col) => (
            <Tile
              key={row * MAX_COLS + col}
              row={row}
              col={col}
              className={tileClass(row, col, isWall, status[row * MAX_COLS + col], start, end)}
            />
          ))
        )}
      </div>
    </div>
  );
}
