import { useContext } from "react";
import { PathfindingContext } from "../context/PathFindingContext";

export const usePathfinding = () => {
  const context = useContext(PathfindingContext);
  if (!context) {
    throw new Error("usePathfinding must be used within a PathFindingProvider");
  }
  return context;
};
