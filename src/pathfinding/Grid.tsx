import { memo, MouseEvent, useEffect, useRef } from "react";
import { Board, PATH, VISITED } from "./search";
import {
  EMPTY,
  END_TILE_STYLE,
  MAX_COLS,
  MAX_ROWS,
  PATH_TILE_STYLE,
  START_TILE_STYLE,
  TILE_STYLE,
  TRAVERSED_TILE_STYLE,
  WALL,
  WALL_TILE_STYLE,
  WEIGHT,
  WEIGHT_PATH_TILE_STYLE,
  WEIGHT_TILE_STYLE,
  WEIGHT_TRAVERSED_TILE_STYLE,
} from "./utils/constants";
import { Point } from "./utils/types";

export type Endpoint = "start" | "end";
type Drag = { kind: "paint"; value: number } | { kind: Endpoint } | null;

const Tile = memo(function Tile({ row, col, className }: { row: number; col: number; className: string }) {
  return <div data-row={row} data-col={col} className={className} />;
});

const same = (a: Point, b: Point) => a.row === b.row && a.col === b.col;

function tileClass(p: Point, cell: number, status: number, start: Point, end: Point, editable: boolean) {
  if (same(p, start)) return START_TILE_STYLE + (editable ? " cursor-grab" : "");
  if (same(p, end)) return END_TILE_STYLE + (editable ? " cursor-grab" : "");
  if (cell === WALL) return WALL_TILE_STYLE;
  const weighted = cell === WEIGHT;
  if (status === PATH) return weighted ? WEIGHT_PATH_TILE_STYLE : PATH_TILE_STYLE;
  if (status === VISITED) return weighted ? WEIGHT_TRAVERSED_TILE_STYLE : TRAVERSED_TILE_STYLE;
  return weighted ? WEIGHT_TILE_STYLE : TILE_STYLE;
}

const cellOf = (e: MouseEvent): Point | null => {
  const el = (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
  return el ? { row: Number(el.dataset.row), col: Number(el.dataset.col) } : null;
};

/**
 * Drag the start/end tiles to move them. Elsewhere, click or drag to paint with the brush
 * (WALL or WEIGHT); the first tile decides whether the drag adds or erases.
 */
export function Grid({
  board,
  status,
  start,
  end,
  brush = WALL,
  onPaint,
  onMoveEndpoint,
}: {
  board: Board;
  status: Uint8Array;
  start: Point;
  end: Point;
  brush?: number;
  onPaint?: (row: number, col: number, value: number) => void;
  onMoveEndpoint?: (endpoint: Endpoint, to: Point) => void;
}) {
  const drag = useRef<Drag>(null);
  useEffect(() => {
    const stop = () => (drag.current = null);
    window.addEventListener("mouseup", stop);
    return () => window.removeEventListener("mouseup", stop);
  }, []);
  const editable = Boolean(onPaint);

  const handleDown = (e: MouseEvent) => {
    const cell = cellOf(e);
    if (!onPaint || !cell) return;
    e.preventDefault(); // stop text selection while dragging
    if (same(cell, start)) drag.current = { kind: "start" };
    else if (same(cell, end)) drag.current = { kind: "end" };
    else {
      const value = board[cell.row][cell.col] === brush ? EMPTY : brush;
      drag.current = { kind: "paint", value };
      onPaint(cell.row, cell.col, value);
    }
  };

  const handleOver = (e: MouseEvent) => {
    const cell = cellOf(e);
    const d = drag.current;
    if (!d || !cell || same(cell, start) || same(cell, end)) return;
    if (d.kind === "paint") onPaint?.(cell.row, cell.col, d.value);
    else if (board[cell.row][cell.col] !== WALL) onMoveEndpoint?.(d.kind, cell);
  };

  return (
    // Size container: the grid takes the largest size with the right aspect ratio that fits.
    <div className="flex h-full w-full items-center justify-center [container-type:size]">
      <div
        className={`grid select-none gap-px border border-sky-200/25 bg-sky-200/25 ${editable ? "cursor-crosshair" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${MAX_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${MAX_ROWS}, 1fr)`,
          width: `min(100cqw, 100cqh * ${MAX_COLS / MAX_ROWS})`,
          aspectRatio: `${MAX_COLS} / ${MAX_ROWS}`,
        }}
        onMouseDown={handleDown}
        onMouseOver={handleOver}
      >
        {board.map((cells, row) =>
          cells.map((cell, col) => (
            <Tile
              key={row * MAX_COLS + col}
              row={row}
              col={col}
              className={tileClass({ row, col }, cell, status[row * MAX_COLS + col], start, end, editable)}
            />
          ))
        )}
      </div>
    </div>
  );
}
