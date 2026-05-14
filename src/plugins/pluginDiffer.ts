import type { LayerPlugin } from '../adapter/ChartAdapter';

interface DiffResult {
  toAdd:    LayerPlugin[];
  toRemove: LayerPlugin[];
}

// EDGE CASE: plugin prop changes.
// Diffing by plugin.id avoids destroy+reinit on every render
// when the parent happens to re-create the plugins array.
// Stable plugin identity = same object reference (or same .id).
export function diffPlugins(
  prev: LayerPlugin[],
  next: LayerPlugin[],
): DiffResult {
  const prevMap = new Map(prev.map((p) => [p.id, p]));
  const nextMap = new Map(next.map((p) => [p.id, p]));

  const toRemove = prev.filter((p) => !nextMap.has(p.id));
  const toAdd    = next.filter((p) => !prevMap.has(p.id));

  return { toAdd, toRemove };
}
