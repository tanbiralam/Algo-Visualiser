import { MutableRefObject, useState } from "react";
import { usePathfinding } from "../hooks/usePathfinding";
import { useTile } from "../hooks/useTile";
import {
  EXTENDED_SLEEP_TIME,
  MAZES,
  PATHFINDING_ALGORITHMS,
  SLEEP_TIME,
  SPEEDS,
} from "../utils/constants";
import { resetGrid } from "../utils/ResetGrid";
import { AlgorithmType, MazeType, SpeedType } from "../utils/types";
import { Select } from "./Select";
import { runMazeAlgorithm } from "../utils/runMazeAlgorithm";
import { useSpeed } from "../hooks/useSpeed";
import { PlayButton } from "./PlayButton";
import { runPathfindingAlgorithm } from "../utils/runPathfindingAlgorithm";
import { animatePath } from "../utils/animatePath";

export function Nav({
  isVisualizingRunningRef,
}: {
  isVisualizingRunningRef: MutableRefObject<boolean>;
}) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [noPath, setNoPath] = useState(false);
  const {
    maze,
    setMaze,
    grid,
    setGrid,
    setIsGraphVisualized,
    isGraphVisualized,
    algorithm,
    setAlgorithm,
  } = usePathfinding();
  const { startTile, endTile } = useTile();
  const { speed, setSpeed } = useSpeed();

  const handleGenerateMaze = (maze: MazeType) => {
    setNoPath(false);
    resetGrid({ grid, startTile, endTile });
    if (maze === "NONE") {
      setMaze(maze);
      setIsGraphVisualized(false);
      return;
    }

    setMaze(maze);
    setIsDisabled(true);
    runMazeAlgorithm({
      maze,
      grid,
      startTile,
      endTile,
      setIsDisabled,
      speed,
    });
    const newGrid = grid.slice();
    setGrid(newGrid);
    setIsGraphVisualized(false);
  };

  const handlerRunVisualizer = () => {
    if (isGraphVisualized) {
      setIsGraphVisualized(false);
      setNoPath(false);
      resetGrid({ grid: grid.slice(), startTile, endTile });
      return;
    }
    const { traversedTiles, path } = runPathfindingAlgorithm({
      algorithm,
      grid,
      startTile,
      endTile,
    });

    animatePath(traversedTiles, path, startTile, endTile, speed);
    setNoPath(path.length === 0);
    setIsDisabled(true);
    isVisualizingRunningRef.current = true;

    setTimeout(() => {
      const newGrid = grid.slice();
      setGrid(newGrid);
      setIsGraphVisualized(true);
      setIsDisabled(false);
      isVisualizingRunningRef.current = false;
      // Same schedule as animatePath, plus time for the last tile's CSS animation.
    }, speed * (SLEEP_TIME * traversedTiles.length + EXTENDED_SLEEP_TIME * path.length) + 500);
  };
  return (
    <div className="relative flex items-center justify-center min-h-[4.5rem] border-b shadow-gray-600 sm:px-5 px-0">
      <div className="flex items-center lg:justify-between justify-center w-full sm:w-[52rem]">
        {/* Full reload on purpose: animations run on raw timers that must not outlive the page. */}
        <a
          href="/"
          className="lg:flex hidden w-[40%] text-2xl pl-1 hover:text-white"
        >
          Pathfinding Visualiser
        </a>
        <div className="flex sm:items-end items-center justify-start sm:justify-between sm:flex-row flex-col sm:space-y-0 space-y-3 sm:py-0 py-4 sm:space-x-4">
          <Select
            label="Maze"
            value={maze}
            options={MAZES}
            isDisabled={isDisabled}
            onChange={(e) => {
              handleGenerateMaze(e.target.value as MazeType);
            }}
          />
          <Select
            label="Graph"
            value={algorithm}
            options={PATHFINDING_ALGORITHMS}
            isDisabled={isDisabled}
            onChange={(e) => {
              setAlgorithm(e.target.value as AlgorithmType);
            }}
          />
          <Select
            label="Speed"
            value={speed}
            options={SPEEDS}
            isDisabled={isDisabled}
            onChange={(e) => {
              setSpeed(parseInt(e.target.value) as SpeedType);
            }}
          />
          <PlayButton
            isDisabled={isDisabled}
            isGraphVisualized={isGraphVisualized}
            handleRunVisualizer={handlerRunVisualizer}
          />
        </div>
      </div>
      {noPath && (
        <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-red-400">
          No path found: the end tile is walled off.
        </p>
      )}
    </div>
  );
}
