import { describe, expect, it } from "vitest";
import { createRandom } from "@/lib/random";
import { applyOps, emptyWalls, MAZE_GENERATORS } from "./mazes";
import { runSearch } from "./search";
import { END_TILE_CONFIGURATION as END, START_TILE_CONFIGURATION as START } from "./utils/constants";

describe.each(Object.entries(MAZE_GENERATORS))("%s maze", (_, generate) => {
  it("never walls the endpoints and always leaves the end reachable", () => {
    for (let seed = 1; seed <= 30; seed++) {
      const walls = applyOps(emptyWalls(), generate(createRandom(seed), START, END));
      expect(walls[START.row][START.col]).toBe(false);
      expect(walls[END.row][END.col]).toBe(false);
      expect(runSearch("BFS", walls, START, END).found).toBe(true);
    }
  });

  it("is reproducible from a seed", () => {
    expect(generate(createRandom(5), START, END)).toEqual(generate(createRandom(5), START, END));
  });
});
