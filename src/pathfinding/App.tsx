"use client";

import { useRef } from "react";
import { Grid } from "./components/Grid";
import { PathFindingProvider } from "./context/PathFindingContext";
import { SpeedProvider } from "./context/SpeedContext";
import { TileProvider } from "./context/TileContext";
import { Nav } from "./components/Nav";

function App() {
  const isVisualizingRunningRef = useRef(false);

  return (
    <PathFindingProvider>
      <TileProvider>
        <SpeedProvider>
          <div className="h-screen w-screen flex flex-col overflow-auto bg-[#242424] text-white/[.87]">
            <Nav isVisualizingRunningRef={isVisualizingRunningRef} />
            <Grid isVisualizingRunningRef={isVisualizingRunningRef} />
          </div>
        </SpeedProvider>
      </TileProvider>
    </PathFindingProvider>
  );
}

export default App;
