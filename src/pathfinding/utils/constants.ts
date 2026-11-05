import { AlgorithmType, MazeType } from "./types";

export const MAX_ROWS = 39;
export const MAX_COLS = 49;

export const START_TILE_CONFIGURATION = {
  row: 1,
  col: 1,
  isEnd: false,
  isWall: false,
  isPath: false,
  distance: 0,
  isStart: false,
  isTraversed: false,
  parent: null,
};
export const END_TILE_CONFIGURATION = {
  row: MAX_ROWS - 2,
  col: MAX_COLS - 2,
  isEnd: false,
  isWall: false,
  isPath: false,
  distance: 0,
  isStart: false,
  isTraversed: false,
  parent: null,
};

export const TILE_STYLE =
  "w-[7px] h-[7px] sm:w-[11px] sm:h-[11px] md:w-[13px] md:h-[13px] lg:w-[14px] lg:h-[14px] 2xl:w-[17px] 2xl:h-[17px] border-t border-r border-sky-200/40";
export const TRAVERSED_TILE_STYLE = TILE_STYLE + " bg-cyan-500 animate-traversed";
export const START_TILE_STYLE = TILE_STYLE + " bg-green-500";
export const END_TILE_STYLE = TILE_STYLE + " bg-red-600";
export const WALL_TILE_STYLE = TILE_STYLE + " bg-gray-200 animate-wall";
export const PATH_TILE_STYLE = TILE_STYLE + " bg-amber-300 animate-path";

export const MAZE_OPTIONS: { value: MazeType; label: string }[] = [
  { value: "NONE", label: "No maze" },
  { value: "BINARY_TREE", label: "Binary Tree" },
  { value: "RECURSIVE_DIVISION", label: "Recursive Division" },
];

export const PATHFINDING_ALGORITHMS: Record<
  AlgorithmType,
  { label: string; description: string; shortest: boolean }
> = {
  BFS: {
    label: "Breadth-First Search",
    description:
      "Explores the grid in rings of equal distance from the start using a queue. On an unweighted grid the first time it reaches the end is along a shortest path.",
    shortest: true,
  },
  DFS: {
    label: "Depth-First Search",
    description:
      "Follows one direction as far as possible using a stack before backtracking. Finds a path if one exists, but usually not the shortest.",
    shortest: false,
  },
  DIJKSTRA: {
    label: "Dijkstra",
    description:
      "Always expands the closest unvisited tile from a priority queue. Guarantees a shortest path, and also works when moves have different costs.",
    shortest: true,
  },
  A_STAR: {
    label: "A* Search",
    description:
      "Like Dijkstra, but ranks tiles by distance so far plus a Manhattan-distance estimate to the end, so it heads toward the goal and visits far fewer tiles.",
    shortest: true,
  },
};

export const ALGORITHM_OPTIONS = (Object.keys(PATHFINDING_ALGORITHMS) as AlgorithmType[]).map(
  (value) => ({ value, label: PATHFINDING_ALGORITHMS[value].label })
);
