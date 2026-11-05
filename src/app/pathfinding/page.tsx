"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BsEraser } from "react-icons/bs";
import { PlayerControls } from "@/components/PlayerControls";
import { Stats } from "@/components/Stats";
import { Select } from "@/components/Select";
import { ShareButton } from "@/components/ShareButton";
import { Button, Pane, Panel, VisualiserShell } from "@/components/VisualiserShell";
import { LearnCard, LearnIntro, SideTabs } from "@/components/LearnCard";
import { CodeDrawer, Scoreboard, ScoreRow } from "@/components/Compare";
import { DuelBet, PredictableCode } from "@/components/Predict";
import { PATHFINDING_CARDS } from "@/learn/cards";
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
  ["bg-moss rounded-full", "Start"],
  ["bg-shu", "End"],
  ["bg-ink", "Wall"],
  ["bg-ink/20", `Weight: costs ${WEIGHT_COST} to enter`],
  ["bg-wash", "Visited"],
  ["bg-gold", "Path"],
] as const;

const VIEW_OPTIONS = [
  { value: "overlay", label: "One grid" },
  { value: "split", label: "Side by side" },
] as const;

const overlayLegend = (a: string, b: string) =>
  [
    ["bg-wash", `${a} visited`],
    ["bg-gold", `${a} path`],
    ["shadow-[inset_0_0_0_1.5px_rgb(var(--c-shu)/0.75)]", `${b} visited`],
    ["bg-shu", `${b} path`],
    ["bg-gold shadow-[inset_0_0_0_2px_rgb(var(--c-shu))]", "Both paths"],
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
            card: PATHFINDING_CARDS[key],
            search: runSearch(key, board, start, end),
          })),
    [algorithm, rival, board, start, end, drawingMaze],
  );
  const player = usePlayer(Math.max(0, ...runs.map((r) => r.search.steps.length)), runs);
  const statuses = useMemo(
    () => runs.map((r) => replaySearch(r.search.steps, Math.min(player.index, r.search.steps.length))),
    [runs, player.index],
  );
  const comparing = rival !== "none";
  const hydrated = useHydrated(); // search time differs per run, so skip it during SSR
  const locked = drawingMaze || player.playing;
  const [tab, setTab] = useState<"watch" | "learn">("watch");
  const [view, setView] = useState<"overlay" | "split">("overlay");
  const overlay = comparing && view === "overlay" && runs.length === 2;
  const sides = runs.map((r, k) => ({ label: r.info.label, swatch: k === 1 ? "bg-shu" : "bg-ai" }));
  const traceOf = (k: number) => {
    const steps = runs[k].search.steps;
    return player.index > 0 ? steps[Math.min(player.index, steps.length) - 1] : undefined;
  };
  const cards = (rival === "none" ? [algorithm] : [algorithm, rival]).map((key) => PATHFINDING_CARDS[key]);

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
      section="pathfinding"
      controls={
        <>
          <Select label="Maze" value={maze} options={MAZE_OPTIONS} onChange={generateMaze} disabled={locked} />
          <Select
            label="Algorithm"
            value={algorithm}
            options={ALGORITHM_OPTIONS}
            onChange={setAlgorithm}
            disabled={locked}
          />
          <Select label="Compare with" value={rival} options={COMPARE_OPTIONS} onChange={setRival} disabled={locked} />
          {comparing && <Select label="View" value={view} options={VIEW_OPTIONS} onChange={setView} />}
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
        <SideTabs
          tab={tab}
          onTab={setTab}
          learn={cards.map((card) => (
            <LearnCard key={card.name} card={card} />
          ))}
          watch={
            <>
              {!comparing && <LearnIntro card={cards[0]} onMore={() => setTab("learn")} />}
              {comparing && runs.length === 2 ? (
                <>
                  <DuelBet
                    key={`${algorithm}-${rival}`}
                    names={[sides[0].label, sides[1].label]}
                    scores={[runs[0].search.visited, runs[1].search.visited]}
                    metric="tile visits"
                    done={player.done}
                  />
                  <Panel title="Head to head">
                    <Scoreboard
                      sides={[sides[0], sides[1]]}
                      rows={[
                        {
                          label: "Visited",
                          cells: runs.map(({ search }) => ({
                            now: Math.min(player.index, search.visited),
                            total: search.visited,
                          })) as ScoreRow["cells"],
                        },
                        {
                          label: "Path length",
                          cells: runs.map(({ search }) => ({
                            now: Math.max(0, Math.min(player.index, search.steps.length) - search.visited),
                            total: search.found ? search.pathLength : "no path",
                          })) as ScoreRow["cells"],
                        },
                        {
                          label: "Path cost",
                          cells: runs.map(({ search }) => ({
                            now: search.found ? search.cost : "–",
                            total: search.found ? search.cost : undefined,
                          })) as ScoreRow["cells"],
                        },
                        {
                          label: "Search time",
                          cells: runs.map(({ search }) => ({
                            now: hydrated ? `${search.ms.toFixed(2)} ms` : "–",
                          })) as ScoreRow["cells"],
                        },
                      ]}
                    />
                  </Panel>
                  <Panel title="Pseudocode">
                    <div className="space-y-2">
                      {runs.map(({ info: runInfo }, k) => (
                        <CodeDrawer key={k} side={sides[k]} lines={runInfo.pseudocode} trace={traceOf(k)} />
                      ))}
                    </div>
                  </Panel>
                </>
              ) : (
                runs.map(({ info: runInfo, search }, k) => (
                  <Panel key={k} title="Live stats">
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
                      <PredictableCode
                        lines={runInfo.pseudocode}
                        current={traceOf(k)}
                        next={search.steps[player.index]}
                        player={player}
                      />
                    </div>
                  </Panel>
                ))
              )}
              <Panel title="How to use">
                <p className="leading-relaxed text-muted">
                  Click or touch and drag to paint walls or weights (pick the brush), or generate a maze. Drag the start
                  and end tiles to move them. Press play (space) to run, and ← / → to step.
                </p>
              </Panel>
              <Panel title="Legend">
                <ul className="space-y-1.5 text-muted">
                  {(overlay ? [...LEGEND.slice(0, 4), ...overlayLegend(sides[0].label, sides[1].label)] : LEGEND).map(
                    ([color, label]) => (
                      <li key={label}>
                        <span className={`mr-2 inline-block h-3 w-3 rounded-sm align-[-1px] ${color}`} />
                        {label}
                      </li>
                    ),
                  )}
                </ul>
              </Panel>
            </>
          }
        />
      }
      footer={<PlayerControls player={player} disabled={drawingMaze} />}
    >
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        {(overlay ? [runs[0]] : runs.length ? runs : [null]).map((run, k) => {
          const steps = run?.search.steps ?? [];
          const finished = steps.length > 0 && player.index >= steps.length;
          return (
            <Pane
              key={k}
              label={
                overlay ? (
                  <>
                    {sides[0].label} <span className="font-sans text-sm font-normal text-muted">and</span>{" "}
                    {sides[1].label}
                  </>
                ) : comparing && run ? (
                  run.info.label
                ) : undefined
              }
              swatch={comparing && !overlay ? sides[k]?.swatch : undefined}
              status={
                !overlay &&
                run &&
                (finished
                  ? run.search.found
                    ? "reached the end"
                    : "no path"
                  : `${formatNumber(run.search.visited)} visits`)
              }
            >
              <Grid
                board={board}
                status={statuses[k] ?? EMPTY_STATUS}
                rival={overlay ? statuses[1] : undefined}
                start={start}
                end={end}
                brush={brush === "wall" ? WALL : WEIGHT}
                onPaint={locked ? undefined : paint}
                onMoveEndpoint={moveEndpoint}
              />
              {finished && !run?.search.found && (
                <p className="absolute left-1/2 top-2 -translate-x-1/2 rounded-md border border-shu/30 bg-surface px-3 py-1 text-sm text-shu shadow-sm">
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
