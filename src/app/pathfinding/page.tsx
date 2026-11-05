"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BsEraser } from "react-icons/bs";
import { PlayerControls } from "@/components/PlayerControls";
import { Pseudocode } from "@/components/Pseudocode";
import { Stats } from "@/components/Stats";
import { Select } from "@/components/Select";
import { ShareButton } from "@/components/ShareButton";
import { Button, Pane, Panel, VisualiserShell } from "@/components/VisualiserShell";
import { usePlayer } from "@/engine/usePlayer";
import { formatNumber, useHydrated } from "@/lib/format";
import { createRandom, newSeed } from "@/lib/random";
import { Endpoint, Grid } from "@/pathfinding/Grid";
import { applyOps, emptyBoard, MAZE_GENERATORS, snapToCell, WallOp } from "@/pathfinding/mazes";
import { replaySearch, runSearch } from "@/pathfinding/search";
import { encodeBoard, encodePoint, parsePathfindingParams } from "@/pathfinding/share";
import {
  ALGORITHM_OPTIONS,
  DEFAULT_END,
  DEFAULT_START,
  MAZE_OPTIONS,
  PATHFINDING_ALGORITHMS,
  WALL,
  WEIGHT,
  WEIGHT_COST,
} from "@/pathfinding/utils/constants";
import { AlgorithmType, MazeType, Point } from "@/pathfinding/utils/types";

const COMPARE_OPTIONS = [{ value: "none" as const, label: "Nothing" }, ...ALGORITHM_OPTIONS];
const EMPTY_STATUS = replaySearch([], 0);
const MAZE_FRAMES = 120; // a maze draws in about two seconds
const BRUSH_OPTIONS = [
  { value: "wall", label: "Wall" },
  { value: "weight", label: `Weight (cost ${WEIGHT_COST})` },
] as const;

const LEGEND = [
  ["bg-green-500", "Start"],
  ["bg-red-600", "End"],
  ["bg-gray-200", "Wall"],
  ["bg-purple-700", `Weight: costs ${WEIGHT_COST} to enter`],
  ["bg-cyan-500", "Visited"],
  ["bg-amber-300", "Path"],
] as const;

export default function PathfindingPage() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("BFS");
  const [rival, setRival] = useState<AlgorithmType | "none">("none");
  const [maze, setMaze] = useState<MazeType>("NONE");
  const [board, setBoard] = useState(emptyBoard);
  const [brush, setBrush] = useState<"wall" | "weight">("wall");
  const [start, setStart] = useState<Point>(DEFAULT_START);
  const [end, setEnd] = useState<Point>(DEFAULT_END);
  const [mazeOps, setMazeOps] = useState<WallOp[] | null>(null);
  const drawingMaze = mazeOps !== null;

  // Apply a shared link's settings after mount (the server render always uses defaults).
  useEffect(() => {
    const shared = parsePathfindingParams(window.location.search);
    if (shared.algorithm) setAlgorithm(shared.algorithm);
    if (shared.rival) setRival(shared.rival);
    if (shared.start) setStart(shared.start);
    if (shared.end) setEnd(shared.end);
    if (shared.board) setBoard(shared.board);
  }, []);

  // Animate maze generation a chunk of wall changes per frame.
  useEffect(() => {
    if (!mazeOps) return;
    const perFrame = Math.ceil(mazeOps.length / MAZE_FRAMES);
    let i = 0;
    const tick = () => {
      const chunk = mazeOps.slice(i, (i += perFrame));
      setBoard((b) => applyOps(b, chunk));
      if (i < mazeOps.length) raf = requestAnimationFrame(tick);
      else setMazeOps(null);
    };
    let raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mazeOps]);

  const runs = useMemo(
    () =>
      drawingMaze
        ? []
        : (rival === "none" ? [algorithm] : [algorithm, rival]).map((key) => ({
            info: PATHFINDING_ALGORITHMS[key],
            search: runSearch(key, board, start, end),
          })),
    [algorithm, rival, board, start, end, drawingMaze]
  );
  const player = usePlayer(Math.max(0, ...runs.map((r) => r.search.steps.length)), runs);
  const statuses = useMemo(
    () => runs.map((r) => replaySearch(r.search.steps, Math.min(player.index, r.search.steps.length))),
    [runs, player.index]
  );
  const comparing = rival !== "none";
  const hydrated = useHydrated(); // search time differs per run, so skip it during SSR
  const info = PATHFINDING_ALGORITHMS[algorithm];
  const locked = drawingMaze || player.playing;

  const generateMaze = (value: MazeType) => {
    setMaze(value);
    setBoard(emptyBoard());
    if (value === "NONE") return setMazeOps(null);
    // Mazes connect odd rows/cols only, so move the endpoints onto those first.
    let [s, e] = [snapToCell(start), snapToCell(end)];
    if (s.row === e.row && s.col === e.col) [s, e] = [DEFAULT_START, DEFAULT_END];
    setStart(s);
    setEnd(e);
    setMazeOps(MAZE_GENERATORS[value](createRandom(newSeed()), s, e));
  };

  const paint = useCallback((row: number, col: number, value: number) => {
    setBoard((b) => {
      if (b[row][col] === value) return b;
      const next = b.slice();
      next[row] = b[row].slice();
      next[row][col] = value;
      return next;
    });
  }, []);

  const moveEndpoint = useCallback((endpoint: Endpoint, to: Point) => {
    (endpoint === "start" ? setStart : setEnd)(to);
  }, []);

  return (
    <VisualiserShell
      title="Pathfinding Visualiser"
      controls={
        <>
          <Select label="Maze" value={maze} options={MAZE_OPTIONS} onChange={generateMaze} disabled={locked} />
          <Select label="Algorithm" value={algorithm} options={ALGORITHM_OPTIONS} onChange={setAlgorithm} disabled={locked} />
          <Select label="Compare with" value={rival} options={COMPARE_OPTIONS} onChange={setRival} disabled={locked} />
          <Select label="Brush" value={brush} options={BRUSH_OPTIONS} onChange={setBrush} disabled={locked} />
          <Button onClick={() => generateMaze("NONE")} disabled={locked}>
            <BsEraser /> Clear board
          </Button>
          <ShareButton
            getParams={() => ({
              algo: algorithm,
              vs: rival === "none" ? undefined : rival,
              start: encodePoint(start),
              end: encodePoint(end),
              board: encodeBoard(board),
            })}
          />
        </>
      }
      side={
        <>
          {runs.map(({ info: runInfo, search }, k) => (
            <Panel key={k} title={comparing ? runInfo.label : "Live stats"}>
              <div className="space-y-3">
                <Stats
                  stats={[
                    { label: "Visited", value: Math.min(player.index, search.visited), total: search.visited },
                    {
                      label: "Path length",
                      value: Math.max(0, Math.min(player.index, search.steps.length) - search.visited),
                      total: search.found ? search.pathLength : "no path",
                    },
                    { label: "Path cost", value: search.found ? search.cost : "–" },
                    { label: "Search time", value: hydrated ? `${search.ms.toFixed(2)} ms` : "–" },
                  ]}
                />
                <Pseudocode
                  lines={runInfo.pseudocode}
                  trace={player.index > 0 ? search.steps[Math.min(player.index, search.steps.length) - 1] : undefined}
                />
              </div>
            </Panel>
          ))}
          {!comparing && <Panel title={info.label}>
            <p className="leading-relaxed text-gray-400">{info.description}</p>
            <p className="mt-2 text-gray-500">
              Guarantees: <span className="text-gray-300">{info.guarantee}</span>
            </p>
          </Panel>}
          <Panel title="How to use">
            <p className="leading-relaxed text-gray-400">
              Click and drag to paint walls or weights (pick the brush), or generate a maze. Drag the green and
              red tiles to move the start and end. Press play (space) to run, and ← / → to step.
            </p>
          </Panel>
          <Panel title="Legend">
            <ul className="space-y-1 text-gray-400">
              {LEGEND.map(([color, label]) => (
                <li key={label}>
                  <span className={`mr-2 inline-block h-3 w-3 rounded-sm ${color}`} />
                  {label}
                </li>
              ))}
            </ul>
          </Panel>
        </>
      }
      footer={<PlayerControls player={player} disabled={drawingMaze} />}
    >
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        {(runs.length ? runs : [null]).map((run, k) => {
          const steps = run?.search.steps ?? [];
          const finished = steps.length > 0 && player.index >= steps.length;
          return (
            <Pane
              key={k}
              label={comparing && run ? run.info.label : undefined}
              status={run && (finished ? (run.search.found ? "reached the end" : "no path") : `${formatNumber(run.search.visited)} visits`)}
            >
              <Grid
                board={board}
                status={statuses[k] ?? EMPTY_STATUS}
                start={start}
                end={end}
                brush={brush === "wall" ? WALL : WEIGHT}
                onPaint={locked ? undefined : paint}
                onMoveEndpoint={moveEndpoint}
              />
              {finished && !run?.search.found && (
                <p className="absolute left-1/2 top-2 -translate-x-1/2 rounded-md bg-red-500/15 px-3 py-1 text-sm text-red-300">
                  No path found: the end tile is walled off.
                </p>
              )}
            </Pane>
          );
        })}
      </div>
    </VisualiserShell>
  );
}
