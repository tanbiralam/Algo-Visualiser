# Algo Visualiser

An interactive web app for seeing how classic algorithms work, built with Next.js, TypeScript and Tailwind CSS.

## Visualisers

### Sorting (`/sorting`)

- Algorithms: Bubble, Insertion, Selection, Merge and Quick sort
- Adjustable animation speed
- Description and time complexity (best / average / worst) for each algorithm

### Pathfinding (`/pathfinding`)

- Algorithms: Breadth-First Search, Depth-First Search, Dijkstra and A*
- Click and drag on the grid to draw walls
- Maze generators: Binary Tree and Recursive Division
- Three animation speeds

## Getting started

Requires Node.js 18.17 or newer and [pnpm](https://pnpm.io/installation).

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

## Project structure

```
src/
  app/
    page.tsx              # landing page
    sorting/              # /sorting route
    pathfinding/          # /pathfinding route
  sorting/                # sorting algorithms, context, inputs
  pathfinding/            # pathfinding + maze algorithms, grid, context
```

## Author

[tanbiralam](https://github.com/tanbiralam)
