"use client";

import { useState } from "react";
import { Trace } from "@/engine/types";
import { Player } from "@/engine/usePlayer";
import { formatNumber } from "@/lib/format";
import { Pseudocode } from "./Pseudocode";

/**
 * Pseudocode that can switch into a challenge: pick the line that runs next, then the
 * player steps forward and shows whether you were right. Score lasts for this visit only.
 */
export function PredictableCode({
  lines,
  current,
  next,
  player,
}: {
  lines: string[];
  current?: Trace;
  next?: Trace;
  player: Player;
}) {
  const [on, setOn] = useState(false);
  const [score, setScore] = useState({ right: 0, tries: 0 });
  const [result, setResult] = useState<{ right: boolean; picked: number; answer: number } | null>(null);

  const start = () => {
    setOn(true);
    setResult(null);
    if (player.playing) player.toggle();
  };

  const pick = (k: number) => {
    if (!next) return;
    const right = k === next.line;
    setScore((s) => ({ right: s.right + Number(right), tries: s.tries + 1 }));
    setResult({ right, picked: k, answer: next.line });
    player.stepForward();
  };

  return (
    <div className="space-y-3">
      {on ? (
        <div className="space-y-1 rounded-md border border-line bg-bg p-3">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-display text-sm font-semibold">Which line runs next?</p>
            <button type="button" onClick={() => setOn(false)} className="text-xs text-muted hover:text-ink">
              Stop
            </button>
          </div>
          <p className="text-sm leading-relaxed text-muted" aria-live="polite">
            {!next
              ? "The run is finished. Rewind to try again."
              : result
                ? result.right
                  ? `Correct. ${score.right} of ${score.tries} so far.`
                  : `Not quite: it was "${lines[result.answer].trim()}". ${score.right} of ${score.tries} so far.`
                : "Tap the line you think comes next. The run steps forward to show you."}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={start}
          disabled={!next}
          className="w-full rounded-md border border-dashed border-line px-3 py-2 text-left text-sm transition hover:border-ink/30 disabled:opacity-40"
        >
          <span className="font-medium">Predict the next line</span>
          <span className="block text-xs text-muted">Pause and test whether you can follow the code.</span>
        </button>
      )}
      <Pseudocode
        lines={lines}
        trace={current}
        onPick={on && next ? pick : undefined}
        wrong={on && result && !result.right ? result.picked : undefined}
      />
    </div>
  );
}

/**
 * Compare mode: commit to a guess before the run, see the answer when it finishes.
 * `scores` are the final totals (lower wins); `metric` names them, e.g. "steps".
 */
export function DuelBet({
  names,
  scores,
  metric,
  done,
}: {
  names: [string, string];
  scores: [number, number];
  metric: string;
  done: boolean;
}) {
  const [bet, setBet] = useState<0 | 1 | 2 | null>(null);
  const winner = scores[0] === scores[1] ? 2 : scores[0] < scores[1] ? 0 : 1;
  const options = [names[0], names[1], "A tie"];

  return (
    <div className="space-y-3 rounded-lg border border-line bg-bg p-4">
      <p className="font-display text-base font-semibold leading-snug">Which will need fewer {metric}?</p>
      <div className="flex flex-wrap gap-2">
        {options.map((label, k) => (
          <button
            key={label}
            type="button"
            aria-pressed={bet === k}
            disabled={done && bet !== null}
            onClick={() => setBet(k as 0 | 1 | 2)}
            className="rounded-full border border-line bg-surface px-3 py-1 text-sm transition enabled:hover:border-ink/40 aria-pressed:border-shu aria-pressed:text-shu"
          >
            {label}
          </button>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-muted" aria-live="polite">
        {bet === null
          ? "Make your call, then press play."
          : !done
            ? "Locked in. Press play to find out."
            : `${bet === winner ? "You called it." : "Not this time."} ${names[0]} needed ${formatNumber(scores[0])} ${metric}, ${names[1]} needed ${formatNumber(scores[1])}.`}
      </p>
    </div>
  );
}
