"use client";

import { formatNumber, useHydrated } from "@/lib/format";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsEraser } from "react-icons/bs";
import { PlayerControls } from "@/components/PlayerControls";
import { Pseudocode } from "@/components/Pseudocode";
import { Stats } from "@/components/Stats";
import { Select } from "@/components/Select";
import { Button, Pane, Panel, VisualiserShell } from "@/components/VisualiserShell";
import { usePlayer } from "@/engine/usePlayer";
import { createRandom, newSeed } from "@/lib/random";
import { Grid } from "@/pathfinding/Grid";
import { applyOps, emptyWalls, MAZE_GENERATORS, WallOp } from "@/pathfinding/mazes";
import { replaySearch, runSearch } from "@/pathfinding/search";
import {
  ALGORITHM_OPTIONS,
  END_TILE_CONFIGURATION as END,
  MAZE_OPTIONS,
  PATHFINDING_ALGORITHMS,
  START_TILE_CONFIGURATION as START,
} from "@/pathfinding/utils/constants";
import { AlgorithmType, MazeType } from "@/pathfinding/utils/types";

const COMPARE_OPTIONS = [{ value: "none" as const, label: "Nothing" }, ...ALGORITHM_OPTIONS];
const EMPTY_STATUS = replaySearch([], 0);
const MAZE_FRAMES = 120; // a maze draws in about two seconds

const LEGEND = [
  ["bg-green-500", "Start"],
  ["bg-red-600", "End"],
  ["bg-gray-200", "Wall"],
  ["bg-cyan-500", "Visited"],
  ["bg-amber-300", "Path"],
] as const;

export default function PathfindingPage() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("BFS");
  const [rival, setRival] = useState<AlgorithmType | "none">("none");
  const [maze, setMaze] = useState<MazeType>("NONE");
  const [walls, setWalls] = useState(emptyWalls);
  const [mazeOps, setMazeOps] = useState<WallOp[] | null>(null);
  const drawingMaze = mazeOps !== null;

  // Animate maze generation a chunk of wall changes per frame.
  useEffect(() => {
    if (!mazeOps) return;
    const perFrame = Math.ceil(mazeOps.length / MAZE_FRAMES);
    let i = 0;
    const tick = () => {
      const chunk = mazeOps.slice(i, (i += perFrame));
      setWalls((w) => applyOps(w, chunk));
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
            search: runSearch(key, walls, START, END),
          })),
    [algorithm, rival, walls, drawingMaze]
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
    setWalls(emptyWalls());
    setMazeOps(value === "NONE" ? null : MAZE_GENERATORS[value](createRandom(newSeed()), START, END));
  };

  const paint = useCallback((row: number, col: number, wall: boolean) => {
    setWalls((w) => {
      if (w[row][col] === wall) return w;
      const next = w.slice();
      next[row] = w[row].slice();
      next[row][col] = wall;
      return next;
    });
  }, []);

  return (
    <VisualiserShell
      title="Pathfinding Visualiser"
      controls={
        <>
          <Select label="Maze" value={maze} options={MAZE_OPTIONS} onChange={generateMaze} disabled={locked} />
          <Select label="Algorithm" value={algorithm} options={ALGORITHM_OPTIONS} onChange={setAlgorithm} disabled={locked} />
          <Select label="Compare with" value={rival} options={COMPARE_OPTIONS} onChange={setRival} disabled={locked} />
          <Button onClick={() => generateMaze("NONE")} disabled={locked}>
            <BsEraser /> Clear walls
          </Button>
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
              Shortest path guaranteed: <span className="text-gray-300">{info.shortest ? "yes" : "no"}</span>
            </p>
          </Panel>}
          <Panel title="How to use">
            <p className="leading-relaxed text-gray-400">
              Click and drag on the grid to draw or erase walls, or pick a maze. Press play (space) to run the
              search, and use ← / → to step through it.
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
                walls={walls}
                status={statuses[k] ?? EMPTY_STATUS}
                start={START}
                end={END}
                onPaint={locked ? undefined : paint}
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
