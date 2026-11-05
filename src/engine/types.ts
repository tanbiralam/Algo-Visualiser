/** Every step points at a pseudocode line and carries the live variables at that moment. */
export type Trace = { line: number; vars: Record<string, number | string> };
