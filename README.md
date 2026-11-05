# Algo Visualiser

An interactive web app for understanding classic algorithms, not just memorising them. Built with Next.js, TypeScript and Tailwind CSS.

Every algorithm runs once up front and records each step. The page then renders the state at any step, so you can pause, step backwards, scrub the timeline and compare two algorithms on identical input.

## Features

**Both visualisers**

- Play / pause, step forward and back, a draggable timeline and a speed control
- Keyboard shortcuts: `Space` play/pause, `←` / `→` step
- Pseudocode panel that highlights the current line and shows the live variables
- Live stats that track the current step
- Learning card for every algorithm: what it does, the intuition, real-life uses, when to use it, what to watch for, a common mistake and a question that checks understanding
- Predict the next line: pick the pseudocode line you think runs next and see if you were right
- Compare mode: two algorithms on the same input with one timeline, a head-to-head scoreboard and a bet on which needs fewer steps; pathfinding can overlay both searches on one grid
- Light and dark themes, following the system by default
- Share button: copies a link that reproduces the exact setup

**Sorting** (`/sorting`)

- Bubble, Insertion, Selection, Merge, Quick, Heap and Radix sort
- Input presets: random, nearly sorted, reversed, few unique values
- Array size from 8 to 200
- Counts comparisons, swaps and writes; radix sort makes zero comparisons

**Pathfinding** (`/pathfinding`)

- Breadth-First Search, Depth-First Search, Dijkstra and A*
- Paint walls or weight tiles (cost 5); Dijkstra and A* route around weights, BFS and DFS ignore them
- Drag the start and end tiles to move them (mouse or touch)
- Mazes: Binary Tree, Recursive Division, Recursive Backtracker and Prim's
- Shows tiles visited, path length, path cost and search time, and reports when no path exists

## Getting started

Requires Node.js 26 and [pnpm](https://pnpm.io/installation).

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

| Command      | What it does               |
| ------------ | -------------------------- |
| `pnpm dev`   | Start the dev server       |
| `pnpm build` | Production build           |
| `pnpm start` | Serve the production build |
| `pnpm lint`  | Run ESLint                 |
| `pnpm test`  | Run the Vitest suite       |

CI runs lint, tests and build on every push and pull request.

## How it works

```
algorithm(input) → Step[]          each step: what changed + pseudocode line + variables
replay(input, steps, i) → state    state after the first i steps
usePlayer(total)                   index, play/pause, seek, speed, keyboard
```

Algorithms are pure functions, so they are tested directly: sorts are replayed and checked against a sorted copy, and searches are checked against an independent shortest-path reference on random boards with walls and weights.

## Project structure

```
src/
  app/                  routes: /, /sorting, /pathfinding
  components/           shared UI: shell, player, pseudocode, stats, learning cards, compare, predictions
  engine/               usePlayer hook and the shared step type
  learn/                plain-language explanation for each algorithm
  lib/                  seeded random, formatting, URL params
  sorting/              algorithms, replay, input presets, bars
  pathfinding/          search algorithms, mazes, grid, share codec
```

## Author

[tanbiralam](https://github.com/tanbiralam)
