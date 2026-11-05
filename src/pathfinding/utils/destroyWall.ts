import { SPEEDS, TILE_STYLE } from "./constants";
import { sleep } from "./helpers";
import { GridType, SpeedType } from "./types";

// Helper function to update the wall status and class name
const updateWall = (grid: GridType, row: number, col: number) => {
  grid[row][col].isWall = false;
  document.getElementById(`${row}-${col}`)!.className = TILE_STYLE;
};

// Function to destroy a wall in the grid
export const destroyWall = async (
  grid: GridType,
  row: number,
  col: number,
  isRight: number,
  speed: SpeedType
) => {
  // Determine the speed value
  const speedValue = SPEEDS.find((s) => s.value === speed)!.value;
  const sleepTime = 20 * speedValue - 5;

  // If the wall is to the right and exists
  if (isRight && grid[row][col + 1]) {
    // Destroy the right wall
    updateWall(grid, row, col + 1);
    await sleep(sleepTime);

    // If the wall is below and exists
  } else if (grid[row + 1]) {
    // Destroy the bottom wall
    updateWall(grid, row + 1, col);
    await sleep(sleepTime);

    // Default case: destroy the current wall
  } else {
    updateWall(grid, row, col);
    await sleep(sleepTime);
  }
};
