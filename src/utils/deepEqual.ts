// Structural equality — prevents re-firing useEffect when the user passes
// options={{ physics: true }} as an object literal (new reference each render).
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  if (keysA.length !== keysB.length) return false;

  for (const k of keysA) {
    if (!deepEqual((a as any)[k], (b as any)[k])) return false;
  }
  return true;
}
