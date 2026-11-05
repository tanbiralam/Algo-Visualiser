"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Speed slider (0..100) maps exponentially to ~3 .. ~6300 steps per second.
export const speedToRate = (speed: number) =>
  Math.round(10 ** (0.5 + (3.3 * speed) / 100));

export type Player = ReturnType<typeof usePlayer>;

/**
 * Drives playback over `total` precomputed steps. `index` is how many steps
 * have been applied (0..total). Changing `total` or `resetKey` rewinds.
 */
export function usePlayer(total: number, resetKey?: unknown) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(60);

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [total, resetKey]);

  useEffect(() => {
    if (!playing) return;
    const rate = speedToRate(speed);
    let last = performance.now();
    let carry = 0;
    const tick = (now: number) => {
      carry += ((now - last) / 1000) * rate;
      last = now;
      const advance = Math.floor(carry);
      if (advance > 0) {
        carry -= advance;
        setIndex((i) => Math.min(total, i + advance));
      }
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, total]);

  useEffect(() => {
    if (playing && index >= total) setPlaying(false);
  }, [playing, index, total]);

  const seek = useCallback(
    (i: number) => {
      setPlaying(false);
      setIndex(Math.max(0, Math.min(total, i)));
    },
    [total]
  );

  const toggle = useCallback(() => {
    if (playing) return setPlaying(false);
    if (total === 0) return;
    if (index >= total) setIndex(0);
    setPlaying(true);
  }, [playing, index, total]);

  const stepForward = useCallback(() => seek(index + 1), [seek, index]);
  const stepBack = useCallback(() => seek(index - 1), [seek, index]);

  // Keyboard: space = play/pause, arrows = step. Ignored while typing.
  const keys = useRef({ toggle, stepForward, stepBack });
  keys.current = { toggle, stepForward, stepBack };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.isContentEditable || t.tagName === "SELECT" || t.tagName === "TEXTAREA") return;
      const isRange = t instanceof HTMLInputElement && t.type === "range";
      if (t.tagName === "INPUT" && !isRange) return;
      if (e.key === " ") {
        e.preventDefault();
        keys.current.toggle();
      } else if (!isRange && e.key === "ArrowRight") {
        e.preventDefault();
        keys.current.stepForward();
      } else if (!isRange && e.key === "ArrowLeft") {
        e.preventDefault();
        keys.current.stepBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return {
    index,
    total,
    playing,
    speed,
    setSpeed,
    seek,
    toggle,
    stepForward,
    stepBack,
    done: total > 0 && index >= total,
  };
}
