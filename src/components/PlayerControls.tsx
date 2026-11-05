import { ReactNode } from "react";
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
      className="rounded-md p-2 text-gray-300 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
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
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div className="flex items-center gap-1">
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
          className="rounded-full bg-system-green60 p-2.5 text-black transition hover:bg-system-green70 disabled:pointer-events-none disabled:opacity-40"
        >
          {playing ? <BsPauseFill className="h-5 w-5" /> : <BsPlayFill className="h-5 w-5" />}
        </button>
        <IconButton label="Step forward (→)" onClick={player.stepForward} disabled={off || index >= total}>
          <BsSkipForwardFill className="h-4 w-4" />
        </IconButton>
        <IconButton label="Jump to end" onClick={() => player.seek(total)} disabled={off || index >= total}>
          <BsSkipEndFill className="h-4 w-4" />
        </IconButton>
      </div>

      <input
        type="range"
        aria-label="Timeline"
        min={0}
        max={total}
        value={index}
        disabled={off}
        onChange={(e) => player.seek(Number(e.target.value))}
        className="min-w-[160px] flex-1 accent-purple-500 disabled:opacity-40"
      />
      <span className="w-28 text-right text-xs tabular-nums text-gray-400">
        step {index.toLocaleString()} / {total.toLocaleString()}
      </span>

      <label className="flex items-center gap-2 text-xs text-gray-400">
        Speed
        <input
          type="range"
          min={0}
          max={100}
          value={speed}
          onChange={(e) => player.setSpeed(Number(e.target.value))}
          className="w-24 accent-purple-500"
        />
        <span className="w-16 tabular-nums">{speedToRate(speed).toLocaleString()}/s</span>
      </label>
    </div>
  );
}
