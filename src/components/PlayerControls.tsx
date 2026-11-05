import { ReactNode } from "react";
import { formatNumber } from "@/lib/format";
import {
  BsPauseFill,
  BsPlayFill,
  BsSkipBackwardFill,
  BsSkipEndFill,
  BsSkipForwardFill,
  BsSkipStartFill,
} from "react-icons/bs";
import { Player, speedToRate } from "@/engine/usePlayer";

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-9 w-9 place-items-center rounded-md text-muted transition hover:bg-sunk hover:text-ink disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

export function PlayerControls({
  player,
  disabled = false,
}: {
  player: Player;
  disabled?: boolean;
}) {
  const { index, total, playing, speed } = player;
  const off = disabled || total === 0;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <div className="flex items-center gap-0.5">
        <IconButton label="Back to start" onClick={() => player.seek(0)} disabled={off || index === 0}>
          <BsSkipStartFill className="h-4 w-4" />
        </IconButton>
        <IconButton label="Step back (←)" onClick={player.stepBack} disabled={off || index === 0}>
          <BsSkipBackwardFill className="h-4 w-4" />
        </IconButton>
        <button
          type="button"
          aria-label={playing ? "Pause (space)" : "Play (space)"}
          title={playing ? "Pause (space)" : "Play (space)"}
          onClick={player.toggle}
          disabled={off}
          className="mx-1 grid h-10 w-10 place-items-center rounded-full bg-ink text-bg transition hover:bg-ink/85 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          {playing ? <BsPauseFill className="h-5 w-5" /> : <BsPlayFill className="ml-0.5 h-5 w-5" />}
        </button>
        <IconButton label="Step forward (→)" onClick={player.stepForward} disabled={off || index >= total}>
          <BsSkipForwardFill className="h-4 w-4" />
        </IconButton>
        <IconButton label="Jump to end" onClick={() => player.seek(total)} disabled={off || index >= total}>
          <BsSkipEndFill className="h-4 w-4" />
        </IconButton>
      </div>

      <div className="flex min-w-[200px] flex-1 items-center gap-3">
        <input
          type="range"
          aria-label="Timeline"
          min={0}
          max={total}
          value={index}
          disabled={off}
          onChange={(e) => player.seek(Number(e.target.value))}
          className="min-w-0 flex-1 disabled:opacity-40"
        />
        <span className="shrink-0 font-mono text-xs tabular-nums text-muted">
          {formatNumber(index)} / {formatNumber(total)}
        </span>
      </div>

      <label className="flex items-center gap-2 text-xs text-muted">
        <span className="uppercase tracking-[0.12em]">Speed</span>
        <input
          type="range"
          min={0}
          max={100}
          value={speed}
          onChange={(e) => player.setSpeed(Number(e.target.value))}
          className="w-24"
        />
        <span className="w-16 font-mono tabular-nums text-ink">{formatNumber(speedToRate(speed))}/s</span>
      </label>
    </div>
  );
}
