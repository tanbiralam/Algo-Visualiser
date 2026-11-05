import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pathfinding Visualiser | Algo Visualiser",
};

export default function PathfindingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
