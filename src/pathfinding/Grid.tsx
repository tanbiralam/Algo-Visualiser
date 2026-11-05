import { memo, PointerEvent, useEffect, useRef } from "react";
import { Board, PATH, VISITED } from "./search";
import {
  EMPTY,
  END_TILE_STYLE,
  MAX_COLS,
  MAX_ROWS,
  OVERLAY_BOTH_PATHS_STYLE,
  OVERLAY_RIVAL_PATH_STYLE,
  OVERLAY_RIVAL_VISITED_STYLE,
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

function tileClass(
  p: Point,
  cell: number,
  status: number,
  rival: number | undefined,
  start: Point,
  end: Point,
  editable: boolean,
) {
  if (same(p, start)) return START_TILE_STYLE + (editable ? " cursor-grab" : "");
  if (same(p, end)) return END_TILE_STYLE + (editable ? " cursor-grab" : "");
  if (cell === WALL) return WALL_TILE_STYLE;
  const weighted = cell === WEIGHT;
  if (rival !== undefined) {
    // Overlay of two runs: the first fills tiles with indigo and a gold path,
    // the second outlines its visited tiles and draws its path in vermilion.
    if (status === PATH && rival === PATH) return OVERLAY_BOTH_PATHS_STYLE;
    if (rival === PATH) return OVERLAY_RIVAL_PATH_STYLE;
    if (status === PATH) return weighted ? WEIGHT_PATH_TILE_STYLE : PATH_TILE_STYLE;
    const fill = status === VISITED ? (weighted ? "bg-ai/60" : "bg-ai/25") : weighted ? WEIGHT_TILE_STYLE : TILE_STYLE;
    return rival === VISITED ? `${fill} ${OVERLAY_RIVAL_VISITED_STYLE}` : fill;
  }
  if (status === PATH) return weighted ? WEIGHT_PATH_TILE_STYLE : PATH_TILE_STYLE;
  if (status === VISITED) return weighted ? WEIGHT_TRAVERSED_TILE_STYLE : TRAVERSED_TILE_STYLE;
  return weighted ? WEIGHT_TILE_STYLE : TILE_STYLE;
}

// Look up the tile under the pointer rather than the event target: touch events keep
// targeting the tile where the drag started.
const cellOf = (e: PointerEvent): Point | null => {
  const el = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-row]");
  return el ? { row: Number(el.dataset.row), col: Number(el.dataset.col) } : null;
};

/**
 * Drag the start/end tiles to move them. Elsewhere, click or drag to paint with the brush
 * (WALL or WEIGHT); the first tile decides whether the drag adds or erases.
 */
export function Grid({
  board,
  status,
  rival,
  start,
  end,
  brush = WALL,
  onPaint,
  onMoveEndpoint,
}: {
  board: Board;
  status: Uint8Array;
  /** A second run's status, drawn over the first on the same grid. */
  rival?: Uint8Array;
  start: Point;
  end: Point;
  brush?: number;
  onPaint?: (row: number, col: number, value: number) => void;
  onMoveEndpoint?: (endpoint: Endpoint, to: Point) => void;
}) {
  const drag = useRef<Drag>(null);
  useEffect(() => {
    const stop = () => (drag.current = null);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, []);
  const editable = Boolean(onPaint);

  const handleDown = (e: PointerEvent) => {
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

  const handleMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const cell = cellOf(e);
    if (!cell || same(cell, start) || same(cell, end)) return;
    if (d.kind === "paint") onPaint?.(cell.row, cell.col, d.value);
    else if (board[cell.row][cell.col] !== WALL) onMoveEndpoint?.(d.kind, cell);
  };

  return (
    // Size container: the grid takes the largest size with the right aspect ratio that fits.
    <div className="flex h-full w-full items-center justify-center [container-type:size]">
      <div
        className={`grid select-none gap-px rounded-sm border border-line bg-line ${editable ? "cursor-crosshair touch-none" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${MAX_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${MAX_ROWS}, 1fr)`,
          width: `min(100cqw, 100cqh * ${MAX_COLS / MAX_ROWS})`,
          aspectRatio: `${MAX_COLS} / ${MAX_ROWS}`,
        }}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
      >
        {board.map((cells, row) =>
          cells.map((cell, col) => (
            <Tile
              key={row * MAX_COLS + col}
              row={row}
              col={col}
              className={tileClass(
                { row, col },
                cell,
                status[row * MAX_COLS + col],
                rival?.[row * MAX_COLS + col],
                start,
                end,
                editable,
              )}
            />
          )),
        )}
      </div>
    </div>
  );
}
