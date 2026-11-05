import { useEffect, useState } from "react";

// Fixed locale so server and browser render identical text.
export const formatNumber = (n: number) => n.toLocaleString("en-US");

/** False during server render and hydration, true afterwards. Use for values that differ per run. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
