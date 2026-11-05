"use client";

import { formatNumber } from "@/lib/format";
import { useEffect, useMemo, useState } from "react";
import { BsShuffle } from "react-icons/bs";
import { PlayerControls } from "@/components/PlayerControls";
import { Pseudocode } from "@/components/Pseudocode";
import { Select } from "@/components/Select";
import { ShareButton } from "@/components/ShareButton";
import { Stats } from "@/components/Stats";
import { Button, Pane, Panel, VisualiserShell } from "@/components/VisualiserShell";
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
        return { info, steps, totals: replaySort(input, steps, steps.length) };
      }),
    [algorithm, rival, input]
  );
  const player = usePlayer(Math.max(...runs.map((r) => r.steps.length)), runs);
  const states = useMemo(
    () => runs.map((r) => replaySort(input, r.steps, Math.min(player.index, r.steps.length))),
    [input, runs, player.index]
  );
  const comparing = runs.length > 1;

  return (
    <VisualiserShell
      title="Sorting Visualiser"
      controls={
        <>
          <Select label="Algorithm" value={algorithm} options={SORTING_OPTIONS} onChange={setAlgorithm} />
          <Select label="Compare with" value={rival} options={COMPARE_OPTIONS} onChange={setRival} />
          <Select label="Input" value={preset} options={INPUT_OPTIONS} onChange={setPreset} />
          <label className="flex flex-col gap-1 text-xs text-gray-400">
            Size: {size}
            <input
              type="range"
              min={MIN_SIZE}
              max={MAX_SIZE}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="h-9 w-32 accent-purple-500"
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
        <>
          {runs.map(({ info, totals }, k) => (
            <Panel key={k} title={comparing ? info.label : "Live stats"}>
              <div className="space-y-3">
                <Stats
                  stats={[
                    { label: "Comparisons", value: states[k].comparisons, total: totals.comparisons },
                    { label: "Swaps", value: states[k].swaps, total: totals.swaps },
                    { label: "Writes", value: states[k].writes, total: totals.writes },
                  ]}
                />
                <Pseudocode lines={info.pseudocode} trace={states[k].last} />
              </div>
            </Panel>
          ))}
          {!comparing && (
            <>
              <Panel title={runs[0].info.label}>
                <p className="leading-relaxed text-gray-400">{runs[0].info.description}</p>
              </Panel>
              <Panel title="Time complexity">
                <dl className="grid grid-cols-2 gap-y-1">
                  <dt className="text-gray-500">Best</dt>
                  <dd className="font-mono">{runs[0].info.best}</dd>
                  <dt className="text-gray-500">Average</dt>
                  <dd className="font-mono">{runs[0].info.average}</dd>
                  <dt className="text-gray-500">Worst</dt>
                  <dd className="font-mono">{runs[0].info.worst}</dd>
                </dl>
              </Panel>
            </>
          )}
          <Panel title="Legend">
            <ul className="space-y-1 text-gray-400">
              <li><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-amber-400" />Comparing</li>
              <li><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-sky-400" />Reading a digit (radix)</li>
              <li><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-rose-500" />Swap / write</li>
              <li><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-system-green60" />Sorted</li>
            </ul>
          </Panel>
        </>
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
              status={finished ? `done in ${formatNumber(steps.length)} steps` : `${formatNumber(steps.length)} steps`}
            >
              <Bars array={states[k].array} active={states[k].active} kind={states[k].last?.type} done={finished} />
            </Pane>
          );
        })}
      </div>
    </VisualiserShell>
  );
}
