// URL parameters are untrusted: every reader validates and returns undefined when invalid.

export const pickParam = <T extends string>(value: string | null, allowed: readonly T[]) =>
  allowed.includes(value as T) ? (value as T) : undefined;

export function intParam(value: string | null, min: number, max: number) {
  if (value === null || !/^\d+$/.test(value)) return undefined;
  const n = Number(value);
  return n >= min && n <= max ? n : undefined;
}

export function buildQuery(params: Record<string, string | number | undefined>) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  return new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}
