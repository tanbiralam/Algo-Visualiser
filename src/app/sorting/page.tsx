"use client";

import { useEffect, useMemo, useState } from "react";
import { BsShuffle } from "react-icons/bs";
import { PlayerControls } from "@/components/PlayerControls";
import { Pseudocode } from "@/components/Pseudocode";
import { Stats } from "@/components/Stats";
import { Select } from "@/components/Select";
import { Button, Panel, VisualiserShell } from "@/components/VisualiserShell";
import { usePlayer } from "@/engine/usePlayer";
import { createRandom, newSeed } from "@/lib/random";
import { SORTING_ALGORITHMS, SORTING_OPTIONS } from "@/sorting/algorithms";
import { Bars } from "@/sorting/Bars";
import { randomArray } from "@/sorting/input";
import { replaySort } from "@/sorting/replay";
import { SortAlgorithm } from "@/sorting/types";

const ARRAY_SIZE = 80;

export default function SortingPage() {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>("bubble");
  // Fixed first seed keeps server and client renders identical; randomise after mount.
  const [seed, setSeed] = useState(1);
  useEffect(() => setSeed(newSeed()), []);

  const input = useMemo(() => randomArray(ARRAY_SIZE, createRandom(seed)), [seed]);
  const info = SORTING_ALGORITHMS[algorithm];
  const steps = useMemo(() => info.run(input), [info, input]);
  const player = usePlayer(steps.length, steps);
  const state = useMemo(() => replaySort(input, steps, player.index), [input, steps, player.index]);
  const totals = useMemo(() => replaySort(input, steps, steps.length), [input, steps]);

  return (
    <VisualiserShell
      title="Sorting Visualiser"
      controls={
        <>
          <Select
            label="Algorithm"
            value={algorithm}
            options={SORTING_OPTIONS}
            onChange={setAlgorithm}
          />
          <Button onClick={() => setSeed(newSeed())}>
            <BsShuffle /> New array
          </Button>
        </>
      }
      side={
        <>
          <Stats
            stats={[
              { label: "Comparisons", value: state.comparisons, total: totals.comparisons },
              { label: "Swaps", value: state.swaps, total: totals.swaps },
              { label: "Writes", value: state.writes, total: totals.writes },
            ]}
          />
          <Panel title="Pseudocode">
            <Pseudocode lines={info.pseudocode} trace={state.last} />
          </Panel>
          <Panel title={info.label}>
            <p className="leading-relaxed text-gray-400">{info.description}</p>
          </Panel>
          <Panel title="Time complexity">
            <dl className="grid grid-cols-2 gap-y-1">
              <dt className="text-gray-500">Best</dt>
              <dd className="font-mono">{info.best}</dd>
              <dt className="text-gray-500">Average</dt>
              <dd className="font-mono">{info.average}</dd>
              <dt className="text-gray-500">Worst</dt>
              <dd className="font-mono">{info.worst}</dd>
            </dl>
          </Panel>
          <Panel title="Legend">
            <ul className="space-y-1 text-gray-400">
              <li><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-amber-400" />Comparing</li>
              <li><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-rose-500" />Swap / write</li>
              <li><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-system-green60" />Sorted</li>
            </ul>
          </Panel>
        </>
      }
      footer={<PlayerControls player={player} />}
    >
      <Bars array={state.array} active={state.active} kind={state.last?.type} done={player.done} />
    </VisualiserShell>
  );
}
