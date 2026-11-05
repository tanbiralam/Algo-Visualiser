"use client";

import { formatNumber } from "@/lib/format";
import { useEffect, useMemo, useState } from "react";
import { BsShuffle } from "react-icons/bs";
import { PlayerControls } from "@/components/PlayerControls";
import { Select } from "@/components/Select";
import { ShareButton } from "@/components/ShareButton";
import { Stats } from "@/components/Stats";
import { Button, Pane, Panel, VisualiserShell } from "@/components/VisualiserShell";
import { LearnCard, LearnIntro, SideTabs } from "@/components/LearnCard";
import { CodeDrawer, Scoreboard, ScoreRow } from "@/components/Compare";
import { DuelBet, PredictableCode } from "@/components/Predict";
import { SORTING_CARDS } from "@/learn/cards";
import { usePlayer } from "@/engine/usePlayer";
import { createRandom, newSeed } from "@/lib/random";
import { SORTING_ALGORITHMS, SORTING_OPTIONS } from "@/sorting/algorithms";
import { Bars } from "@/sorting/Bars";
import { generateInput, INPUT_OPTIONS, InputPreset } from "@/sorting/input";
import { replaySort } from "@/sorting/replay";
import { MAX_SIZE, MIN_SIZE, parseSortingParams } from "@/sorting/share";
import { SortAlgorithm } from "@/sorting/types";

const COMPARE_OPTIONS = [{ value: "none" as const, label: "Nothing" }, ...SORTING_OPTIONS];

export default function SortingPage() {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>("bubble");
  const [rival, setRival] = useState<SortAlgorithm | "none">("none");
  const [preset, setPreset] = useState<InputPreset>("random");
  const [size, setSize] = useState(80);
  // Fixed first seed keeps server and client renders identical; after mount, apply
  // a shared link's settings or pick a random seed.
  const [seed, setSeed] = useState(1);
  useEffect(() => {
    const shared = parseSortingParams(window.location.search);
    if (shared.algorithm) setAlgorithm(shared.algorithm);
    if (shared.rival) setRival(shared.rival);
    if (shared.preset) setPreset(shared.preset);
    if (shared.size) setSize(shared.size);
    setSeed(shared.seed ?? newSeed());
  }, []);

  const input = useMemo(() => generateInput(preset, size, createRandom(seed)), [preset, size, seed]);
  const runs = useMemo(
    () =>
      (rival === "none" ? [algorithm] : [algorithm, rival]).map((key) => {
        const info = SORTING_ALGORITHMS[key];
        const steps = info.run(input);
        return { info, card: SORTING_CARDS[key], steps, totals: replaySort(input, steps, steps.length) };
      }),
    [algorithm, rival, input],
  );
  const [tab, setTab] = useState<"watch" | "learn">("watch");
  const player = usePlayer(Math.max(...runs.map((r) => r.steps.length)), runs);
  const states = useMemo(
    () => runs.map((r) => replaySort(input, r.steps, Math.min(player.index, r.steps.length))),
    [input, runs, player.index],
  );
  const comparing = runs.length > 1;
  const sides = runs.map((r, k) => ({ label: r.info.label, swatch: k === 1 ? "bg-ai/80" : "bg-ink/75" }));

  return (
    <VisualiserShell
      section="sorting"
      controls={
        <>
          <Select label="Algorithm" value={algorithm} options={SORTING_OPTIONS} onChange={setAlgorithm} />
          <Select label="Compare with" value={rival} options={COMPARE_OPTIONS} onChange={setRival} />
          <Select label="Input" value={preset} options={INPUT_OPTIONS} onChange={setPreset} />
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              Size <span className="font-mono normal-case tracking-normal text-ink">{size}</span>
            </span>
            <input
              type="range"
              min={MIN_SIZE}
              max={MAX_SIZE}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="h-9 w-full sm:w-32"
            />
          </label>
          <Button onClick={() => setSeed(newSeed())}>
            <BsShuffle /> New array
          </Button>
          <ShareButton
            getParams={() => ({
              algo: algorithm,
              vs: rival === "none" ? undefined : rival,
              input: preset,
              size,
              seed,
            })}
          />
        </>
      }
      side={
        <SideTabs
          tab={tab}
          onTab={setTab}
          learn={runs.map(({ card }) => (
            <LearnCard key={card.name} card={card} />
          ))}
          watch={
            <>
              {!comparing && <LearnIntro card={runs[0].card} onMore={() => setTab("learn")} />}
              {comparing ? (
                <>
                  <DuelBet
                    key={`${algorithm}-${rival}-${preset}-${size}-${seed}`}
                    names={[sides[0].label, sides[1].label]}
                    scores={[runs[0].steps.length, runs[1].steps.length]}
                    metric="steps"
                    done={player.done}
                  />
                  <Panel title="Head to head">
                    <Scoreboard
                      sides={[sides[0], sides[1]]}
                      rows={[
                        {
                          label: "Steps",
                          cells: [0, 1].map((k) => ({
                            now: Math.min(player.index, runs[k].steps.length),
                            total: runs[k].steps.length,
                          })) as ScoreRow["cells"],
                        },
                        ...(["comparisons", "swaps", "writes"] as const).map((key) => ({
                          label: key[0].toUpperCase() + key.slice(1),
                          cells: [0, 1].map((k) => ({
                            now: states[k][key],
                            total: runs[k].totals[key],
                          })) as ScoreRow["cells"],
                        })),
                      ]}
                    />
                  </Panel>
                  <Panel title="Pseudocode">
                    <div className="space-y-2">
                      {runs.map(({ info }, k) => (
                        <CodeDrawer key={k} side={sides[k]} lines={info.pseudocode} trace={states[k].last} />
                      ))}
                    </div>
                  </Panel>
                </>
              ) : (
                <Panel title="Live stats">
                  <div className="space-y-3">
                    <Stats
                      stats={[
                        { label: "Comparisons", value: states[0].comparisons, total: runs[0].totals.comparisons },
                        { label: "Swaps", value: states[0].swaps, total: runs[0].totals.swaps },
                        { label: "Writes", value: states[0].writes, total: runs[0].totals.writes },
                      ]}
                    />
                    <PredictableCode
                      lines={runs[0].info.pseudocode}
                      current={states[0].last}
                      next={runs[0].steps[player.index]}
                      player={player}
                    />
                  </div>
                </Panel>
              )}
              {!comparing && (
                <>
                  <Panel title="Time complexity">
                    <dl className="grid grid-cols-2 gap-y-1">
                      <dt className="text-muted">Best</dt>
                      <dd className="font-mono">{runs[0].info.best}</dd>
                      <dt className="text-muted">Average</dt>
                      <dd className="font-mono">{runs[0].info.average}</dd>
                      <dt className="text-muted">Worst</dt>
                      <dd className="font-mono">{runs[0].info.worst}</dd>
                    </dl>
                  </Panel>
                </>
              )}
              <Panel title="Legend">
                <ul className="space-y-1.5 text-muted">
                  <li>
                    <span className="mr-2 inline-block h-3 w-3 rounded-sm bg-shu align-[-1px]" />
                    Comparing
                  </li>
                  <li>
                    <span className="mr-2 inline-block h-3 w-3 rounded-sm bg-ai align-[-1px]" />
                    Reading a digit (radix)
                  </li>
                  <li>
                    <span className="mr-2 inline-block h-3 w-3 -translate-y-0.5 rounded-sm bg-shu align-[-1px]" />
                    Swap or write (lifted)
                  </li>
                  <li>
                    <span className="mr-2 inline-block h-3 w-3 rounded-sm bg-gold align-[-1px]" />
                    Sorted
                  </li>
                </ul>
              </Panel>
            </>
          }
        />
      }
      footer={<PlayerControls player={player} />}
    >
      <div className="flex w-full flex-col gap-6">
        {runs.map(({ info, steps }, k) => {
          const finished = player.index >= steps.length && steps.length > 0;
          return (
            <Pane
              key={k}
              label={comparing ? info.label : undefined}
              swatch={comparing ? sides[k].swatch : undefined}
              status={finished ? `done in ${formatNumber(steps.length)} steps` : `${formatNumber(steps.length)} steps`}
            >
              <Bars
                array={states[k].array}
                active={states[k].active}
                kind={states[k].last?.type}
                done={finished}
                tone={k === 1 ? "ai" : "ink"}
              />
            </Pane>
          );
        })}
      </div>
    </VisualiserShell>
  );
}
