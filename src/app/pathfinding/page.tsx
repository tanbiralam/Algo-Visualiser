"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BsEraser } from "react-icons/bs";
import { PlayerControls } from "@/components/PlayerControls";
import { Pseudocode } from "@/components/Pseudocode";
import { Select } from "@/components/Select";
import { Button, Panel, VisualiserShell } from "@/components/VisualiserShell";
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

const NO_SEARCH = { steps: [], visited: 0, pathLength: 0, found: false };
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

  const search = useMemo(
    () => (drawingMaze ? NO_SEARCH : runSearch(algorithm, walls, START, END)),
    [algorithm, walls, drawingMaze]
  );
  const player = usePlayer(search.steps.length, search);
  const status = useMemo(() => replaySearch(search.steps, player.index), [search, player.index]);
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
          <Button onClick={() => generateMaze("NONE")} disabled={locked}>
            <BsEraser /> Clear walls
          </Button>
        </>
      }
      side={
        <>
          <Panel title="Pseudocode">
            <Pseudocode
              lines={info.pseudocode}
              trace={player.index > 0 ? search.steps[player.index - 1] : undefined}
            />
          </Panel>
          <Panel title={info.label}>
            <p className="leading-relaxed text-gray-400">{info.description}</p>
            <p className="mt-2 text-gray-500">
              Shortest path guaranteed: <span className="text-gray-300">{info.shortest ? "yes" : "no"}</span>
            </p>
          </Panel>
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
      <Grid walls={walls} status={status} start={START} end={END} onPaint={locked ? undefined : paint} />
      {player.done && !search.found && (
        <p className="absolute left-1/2 top-2 -translate-x-1/2 rounded-md bg-red-500/15 px-3 py-1 text-sm text-red-300">
          No path found: the end tile is walled off.
        </p>
      )}
    </VisualiserShell>
  );
}
