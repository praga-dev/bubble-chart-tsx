import { useEffect, type RefObject } from 'react';
import type { ChartAdapter } from '../adapter/ChartAdapter';

// Separate hook so it can be tested in isolation
export function useResizeObserver(
  containerRef: RefObject<HTMLElement | null>,
  adapterRef:   RefObject<ChartAdapter | null>,
) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;

      // EDGE CASE: container hidden (display:none) → 0×0
      // Passing 0×0 to the physics engine causes divide-by-zero.
      if (width === 0 || height === 0) return;

      adapterRef.current?.resize(width, height);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, adapterRef]); // Registers once; ResizeObserver is always watching the current element
}
