import { usePathfinding } from "../hooks/usePathfinding";
import { Tile } from "./Tile";
import { MutableRefObject, useState } from "react";
import { checkIfStartOrEnd, createNewGrid } from "../utils/helpers";

export function Grid({
  isVisualizingRunningRef,
}: {
  isVisualizingRunningRef: MutableRefObject<boolean>;
}) {
  const { grid, setGrid } = usePathfinding();
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (row: number, col: number) => {
    if (isVisualizingRunningRef.current || checkIfStartOrEnd(row, col)) {
      return;
    }

    setIsMouseDown(true);

    const newGrid = createNewGrid(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => setIsMouseDown(false);

  const handleMouseEnter = (row: number, col: number) => {
    if (isVisualizingRunningRef.current || checkIfStartOrEnd(row, col)) {
      return;
    }

    if (isMouseDown) {
      const newGrid = createNewGrid(grid, row, col);
      setGrid(newGrid);
    }
  };

  return (
    <div
      className="flex items-center flex-col justify-center border-sky-300 mt-10"
      onMouseLeave={handleMouseUp}
    >
      {grid.map((r, rowIndex) => (
        <div key={rowIndex} className="flex">
          {r.map((tile, tileIndex) => {
            const { row, col, isStart, isEnd, isPath, isTraversed, isWall } =
              tile;
            return (
              <Tile
                key={tileIndex}
                row={tile.row}
                col={tile.col}
                isEnd={isEnd}
                isStart={isStart}
                isPath={isPath}
                isTraversed={isTraversed}
                isWall={isWall}
                handleMouseDown={() => handleMouseDown(row, col)}
                handleMouseEnter={() => handleMouseEnter(row, col)}
                handleMouseUp={handleMouseUp}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
