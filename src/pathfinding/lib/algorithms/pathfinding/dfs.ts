import { getUntraversedNeighbors } from "../../../utils/getUntraversedNeighbors";
import { checkStack, isEqual } from "../../../utils/helpers";
import { GridType, TileType } from "../../../utils/types";

export const dfs = (grid: GridType, startTile: TileType, endTile: TileType) => {
  const traversedTiles = [];
  const base = grid[startTile.row][startTile.col];
  base.distance = 0;
  base.isTraversed = true;
  const untraversedTiles = [base];

  while (untraversedTiles.length > 0) {
    const currentTile = untraversedTiles.pop();
    if (currentTile) {
      if (currentTile.isWall) continue;
      if (currentTile.distance === Infinity) break;
      currentTile.isTraversed = true;
      traversedTiles.push(currentTile);
      if (isEqual(currentTile, endTile)) break;
      const neighbors = getUntraversedNeighbors(grid, currentTile);
      for (let i = 0; i < neighbors.length; i += 1) {
        if (!checkStack(neighbors[i], untraversedTiles)) {
          neighbors[i].distance = currentTile.distance + 1;
          neighbors[i].parent = currentTile;
          untraversedTiles.push(neighbors[i]);
        }
      }
    }
  }
  const path = [];
  let current = grid[endTile.row][endTile.col];
  while (current !== null) {
    current.isPath = true;
    path.unshift(current);
    current = current.parent!;
  }
  return { traversedTiles, path };
};
