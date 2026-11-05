import { randomInt } from "@/lib/random";

export const randomArray = (size: number, rand: () => number) =>
  Array.from({ length: size }, () => randomInt(rand, 5, 100));
