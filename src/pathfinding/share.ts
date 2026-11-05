import { intParam, pickParam } from "@/lib/share";
import { Board } from "./search";
import { EMPTY, MAX_COLS, MAX_ROWS, PATHFINDING_ALGORITHMS, WALL, WEIGHT } from "./utils/constants";
import { AlgorithmType, Point } from "./utils/types";

const CELLS = MAX_ROWS * MAX_COLS;
const BYTES = Math.ceil(CELLS / 4);

/** 2 bits per cell, base64url. Empty board encodes to "". */
export function encodeBoard(board: Board) {
  const bytes = new Uint8Array(BYTES);
  let any = false;
  board.flat().forEach((cell, i) => {
    if (cell !== EMPTY) any = true;
    bytes[i >> 2] |= cell << ((i & 3) * 2);
  });
  if (!any) return "";
  return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join("")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeBoard(text: string): Board | undefined {
  let binary: string;
  try {
    binary = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  } catch {
    return undefined;
  }
  if (binary.length !== BYTES) return undefined;
  return Array.from({ length: MAX_ROWS }, (_, r) =>
    Array.from({ length: MAX_COLS }, (_, c) => {
      const i = r * MAX_COLS + c;
      const cell = (binary.charCodeAt(i >> 2) >> ((i & 3) * 2)) & 3;
      return cell === WALL || cell === WEIGHT ? cell : EMPTY;
    })
  );
}

export const encodePoint = (p: Point) => `${p.row},${p.col}`;

function parsePoint(value: string | null): Point | undefined {
  const [row, col] = (value ?? "").split(",");
  const r = intParam(row ?? null, 0, MAX_ROWS - 1);
  const c = intParam(col ?? null, 0, MAX_COLS - 1);
  return r === undefined || c === undefined ? undefined : { row: r, col: c };
}

const ALGORITHMS = Object.keys(PATHFINDING_ALGORITHMS) as AlgorithmType[];

export function parsePathfindingParams(search: string) {
  const p = new URLSearchParams(search);
  const start = parsePoint(p.get("start"));
  const end = parsePoint(p.get("end"));
  const clash = start && end && start.row === end.row && start.col === end.col;
  const board = p.get("board") ? decodeBoard(p.get("board")!) : undefined;
  // Endpoints always sit on open tiles.
  for (const point of [start, end]) if (board && point && !clash) board[point.row][point.col] = EMPTY;
  return {
    algorithm: pickParam(p.get("algo"), ALGORITHMS),
    rival: pickParam(p.get("vs"), [...ALGORITHMS, "none" as const]),
    start: clash ? undefined : start,
    end: clash ? undefined : end,
    board,
  };
}
