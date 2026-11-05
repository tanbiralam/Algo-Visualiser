import { useContext } from "react";
import { SpeedContext } from "../context/SpeedContext";

export const useSpeed = () => {
  const context = useContext(SpeedContext);
  if (!context) {
    throw new Error("useSpeed must be within SpeedProvider");
  }
  return context;
};
