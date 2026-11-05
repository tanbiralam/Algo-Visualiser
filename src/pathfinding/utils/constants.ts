import { AlgorithmType, MazeType, Point } from "./types";

export const MAX_ROWS = 39;
export const MAX_COLS = 49;

export const DEFAULT_START: Point = { row: 1, col: 1 };
export const DEFAULT_END: Point = { row: MAX_ROWS - 2, col: MAX_COLS - 2 };

// Board cell values.
export const EMPTY = 0;
export const WALL = 1;
export const WEIGHT = 2;
export const WEIGHT_COST = 5; // stepping onto a weight tile costs 5 instead of 1

// Tiles are CSS grid cells; size comes from the grid, the 1px gaps draw the lines.
export const TILE_STYLE = "bg-surface";
export const TRAVERSED_TILE_STYLE = "bg-ai/25 animate-traversed";
export const START_TILE_STYLE = "bg-moss rounded-full";
export const END_TILE_STYLE = "bg-shu rounded-[2px]";
export const WALL_TILE_STYLE = "bg-ink animate-wall";
export const PATH_TILE_STYLE = "bg-gold animate-path";
export const WEIGHT_TILE_STYLE = "bg-ink/20";
export const WEIGHT_TRAVERSED_TILE_STYLE = "bg-ai/60 animate-traversed";
export const WEIGHT_PATH_TILE_STYLE = "bg-gold shadow-[inset_0_0_0_2px_rgb(var(--c-ink)/0.45)] animate-path";
// Compare overlay: the second run outlines what it visits and draws its path in vermilion.
export const OVERLAY_RIVAL_VISITED_STYLE = "shadow-[inset_0_0_0_1.5px_rgb(var(--c-shu)/0.75)]";
export const OVERLAY_RIVAL_PATH_STYLE = "bg-shu animate-path";
export const OVERLAY_BOTH_PATHS_STYLE =
  "bg-[linear-gradient(135deg,rgb(var(--c-gold))_50%,rgb(var(--c-shu))_50%)] animate-path";

export const MAZE_OPTIONS: { value: MazeType; label: string }[] = [
  { value: "NONE", label: "No maze" },
  { value: "BINARY_TREE", label: "Binary Tree" },
  { value: "RECURSIVE_DIVISION", label: "Recursive Division" },
  { value: "BACKTRACKER", label: "Recursive Backtracker" },
  { value: "PRIM", label: "Prim's" },
];

export const PATHFINDING_ALGORITHMS: Record<
  AlgorithmType,
  { label: string; description: string; guarantee: string; frontier: string; pseudocode: string[] }
> = {
  BFS: {
    label: "Breadth-First Search",
    description:
      "Explores the grid in rings of equal distance from the start using a queue. It reaches the end along a path with the fewest moves, but treats weight tiles like any other tile.",
    guarantee: "fewest moves; ignores weights",
    frontier: "queue size",
    pseudocode: [
      "queue = [start]",
      "while queue is not empty",
      "  tile = queue.dequeue(); mark visited",
      "  if tile == end: break",
      "  for each unvisited neighbour n of tile",
      "    n.parent = tile; queue.enqueue(n)",
      "path = follow parents back from end",
    ],
  },
  DFS: {
    label: "Depth-First Search",
    description:
      "Follows one direction as far as possible using a stack before backtracking. Finds a path if one exists, but usually not the shortest, and ignores weights.",
    guarantee: "none: any path it finds",
    frontier: "stack size",
    pseudocode: [
      "stack = [start]",
      "while stack is not empty",
      "  tile = stack.pop(); mark visited",
      "  if tile == end: break",
      "  for each unvisited neighbour n of tile",
      "    n.parent = tile; stack.push(n)",
      "path = follow parents back from end",
    ],
  },
  DIJKSTRA: {
    label: "Dijkstra",
    description:
      "Always expands the closest unvisited tile from a priority queue. Each move costs the weight of the tile entered, so it finds the cheapest path and routes around weight tiles when that is cheaper.",
    guarantee: "cheapest path",
    frontier: "queue size",
    pseudocode: [
      "dist[start] = 0; pq = [start]",
      "while pq is not empty",
      "  tile = pq.popMin(dist); mark visited",
      "  if tile == end: break",
      "  for each unvisited neighbour n of tile",
      "    if dist[tile] + w(n) < dist[n]: update n",
      "path = follow parents back from end",
    ],
  },
  A_STAR: {
    label: "A* Search",
    description:
      "Like Dijkstra, but ranks tiles by distance so far plus a Manhattan-distance estimate to the end, so it heads toward the goal and visits far fewer tiles.",
    guarantee: "cheapest path",
    frontier: "open set size",
    pseudocode: [
      "g[start] = 0; open = [start]",
      "while open is not empty",
      "  tile = open.popMin(f = g + h); mark visited",
      "  if tile == end: break",
      "  for each unvisited neighbour n of tile",
      "    if g[tile] + w(n) < g[n]: update n",
      "path = follow parents back from end",
    ],
  },
};

export const ALGORITHM_OPTIONS = (Object.keys(PATHFINDING_ALGORITHMS) as AlgorithmType[]).map(
  (value) => ({ value, label: PATHFINDING_ALGORITHMS[value].label })
);
