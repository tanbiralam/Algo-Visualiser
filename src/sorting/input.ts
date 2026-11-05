import { randomInt } from "@/lib/random";

export type InputPreset = "random" | "nearly" | "reversed" | "few";

export const INPUT_OPTIONS: { value: InputPreset; label: string }[] = [
  { value: "random", label: "Random" },
  { value: "nearly", label: "Nearly sorted" },
  { value: "reversed", label: "Reversed" },
  { value: "few", label: "Few unique values" },
];

const MIN = 5;
const MAX = 100;

/** Array of `size` values in 5..100 shaped by the preset, reproducible from `rand`. */
export function generateInput(preset: InputPreset, size: number, rand: () => number) {
  if (preset === "few") {
    const levels = [20, 45, 70, 95];
    return Array.from({ length: size }, () => levels[randomInt(rand, 0, levels.length - 1)]);
  }
  const values = Array.from({ length: size }, () => randomInt(rand, MIN, MAX));
  if (preset === "random") return values;
  const sorted = values.sort((a, b) => a - b);
  if (preset === "reversed") return sorted.reverse();
  // Nearly sorted: swap ~5% of elements with a close neighbour.
  for (let k = 0; k < Math.max(1, Math.round(size * 0.05)); k++) {
    const i = randomInt(rand, 0, size - 1);
    const j = Math.min(size - 1, i + randomInt(rand, 1, 3));
    [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
  }
  return sorted;
}
