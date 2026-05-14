import {
  useRef, useEffect, useLayoutEffect, useImperativeHandle,
  type RefObject, type ForwardedRef,
} from 'react';
import { createChartAdapter } from '../core-bridge/createChartAdapter';
import { createBatchScheduler } from '../utils/batching';
import { deepEqual } from '../utils/deepEqual';
import { resolveTheme } from '../theming/resolveTheme';
import { diffPlugins } from '../plugins/pluginDiffer';
import type {
  BubbleDataItem, ChartOptions, LayerPlugin,
  ChartAdapter, ChartEventName, ChartEventHandler,
} from '../adapter/ChartAdapter';
import type { BubbleChartProps } from '../BubbleChart';

export function useBubbleChart(
  containerRef: RefObject<HTMLElement | null>,
  props: BubbleChartProps,
  forwardedRef: ForwardedRef<BubbleChartHandle>,
) {
  const adapterRef   = useRef<ChartAdapter | null>(null);
  const schedulerRef = useRef(createBatchScheduler(props.updateMode ?? 'raf'));

  // ─── Update Mode ─────────────────────────────────────────────────────────
  // Update the scheduler mode if the user changes it at runtime
  useEffect(() => {
    schedulerRef.current.setMode(props.updateMode ?? 'raf');
  }, [props.updateMode]);


  // ─── Props-via-ref pattern ──────────────────────────────────────────────
  // EDGE CASE: stale closure trap.
  // useEffect([], []) captures props once. If any prop changes before init
  // completes (e.g. async init), the adapter would get stale values.
  // Solution: always read from propsRef, never from the closure directly.
  const propsRef = useRef(props);
  propsRef.current = props;

  // ─── Previous values for diffing ────────────────────────────────────────
  const prevOptionsRef = useRef<ChartOptions | undefined>(undefined);
  const prevPluginsRef = useRef<LayerPlugin[]>([]);
  const prevThemeRef   = useRef<string | object | undefined>(undefined);

  // ─── Initialization ──────────────────────────────────────────────────────
  // useLayoutEffect (not useEffect) so the chart is ready synchronously
  // after the DOM commit, preventing a visible flash.
  useLayoutEffect(() => {
    // EDGE CASE: containerRef.current is null on first render.
    // This guard is non-negotiable.
    if (!containerRef.current) return;

    // EDGE CASE: React StrictMode mounts → unmounts → remounts.
    // The cleanup below sets adapterRef.current = null.
    // On remount we fall through to re-init correctly.
    // Do NOT use an initialized.current flag — it prevents remount init.

    // Read initial size synchronously before ResizeObserver fires.
    // EDGE CASE: initial container size is 0×0 before first paint (e.g. lazy tabs).
    const rect   = containerRef.current.getBoundingClientRect();
    const width  = rect.width  || containerRef.current.offsetWidth;
    const height = rect.height || containerRef.current.offsetHeight;

    const p = propsRef.current;

    const adapter = createChartAdapter(p.onError);
    adapterRef.current = adapter;

    adapter.init({
      container: containerRef.current,
      data:      p.data ?? [],            // EDGE CASE: data=undefined → default to []
      options:   p.options ?? {},
      theme:     resolveTheme(p.theme),
      plugins:   p.plugins ?? [],
    });

    // If we got a real initial size, pass it in immediately
    if (width > 0 && height > 0) {
      adapter.resize(width, height);
    }

    // Store initial prev values
    prevOptionsRef.current = p.options;
    prevPluginsRef.current = p.plugins ?? [];
    prevThemeRef.current   = p.theme;

    return () => {
      // EDGE CASE: cancel the scheduler first, THEN flush.
      // Prevents the RAF callback from firing after destroy()
      // with a null adapterRef (unmount during async update).
      schedulerRef.current.cancel();
      adapter.destroy();
      adapterRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps — init runs once per mount cycle (StrictMode-safe)

  // ─── Data updates ────────────────────────────────────────────────────────
  // EDGE CASE: high-frequency data updates → batch through per-instance RAF.
  // EDGE CASE: updateMode prop controls throttle vs debounce vs RAF.
  const pendingDataRef = useRef<BubbleDataItem[] | null>(null);
  
  useEffect(() => {
    pendingDataRef.current = props.data ?? [];
    schedulerRef.current.schedule(() => {
      if (pendingDataRef.current) {
        adapterRef.current?.updateData(pendingDataRef.current);
        pendingDataRef.current = null;
      }
    });
  }, [props.data]);

  // ─── Options updates ─────────────────────────────────────────────────────
  // EDGE CASE: object identity — `options={{ physics: true }}` creates a new
  // object every render. Must deep-compare to prevent infinite update loops.
  useEffect(() => {
    if (deepEqual(props.options, prevOptionsRef.current)) return;
    prevOptionsRef.current = props.options;
    adapterRef.current?.updateOptions(props.options ?? {});
  }, [props.options]);

  // ─── Theme updates ───────────────────────────────────────────────────────
  // EDGE CASE: theme change at runtime — call updateTheme, not re-init.
  useEffect(() => {
    if (deepEqual(props.theme, prevThemeRef.current)) return;
    prevThemeRef.current = props.theme;
    adapterRef.current?.updateTheme(resolveTheme(props.theme));
  }, [props.theme]);

  // ─── Plugin updates ──────────────────────────────────────────────────────
  // EDGE CASE: plugin prop changes (array reference changes).
  // Diff old vs new arrays by plugin.id — add/remove only what changed.
  // Avoids a full destroy+reinit which causes a visual flash.
  // REQUIRES: every plugin must have a stable `id` property.
  useEffect(() => {
    const adapter    = adapterRef.current;
    if (!adapter) return;

    const nextPlugins = props.plugins ?? [];
    const prevPlugins = prevPluginsRef.current;

    const { toAdd, toRemove } = diffPlugins(prevPlugins, nextPlugins);
    for (const p of toRemove) adapter.removePlugin(p);
    for (const p of toAdd)    adapter.addPlugin(p);

    prevPluginsRef.current = nextPlugins;
  }, [props.plugins]);

  // ─── Event bridge ────────────────────────────────────────────────────────
  // EDGE CASE: event handler identity.
  // Inline handlers (`onBubbleClick={() => ...}`) create a new function
  // every render → continuous off/on cycle.
  // Solution: store the handler in a ref, register a stable wrapper once.
  useEventBridge(adapterRef, 'bubbleClick', props.onBubbleClick);
  useEventBridge(adapterRef, 'bubbleHover', props.onBubbleHover);
  useEventBridge(adapterRef, 'bubbleLeave', props.onBubbleLeave);

  // ─── Imperative handle (ref forwarding) ─────────────────────────────────
  // EDGE CASE: consumers need to call chart.exportPNG() etc. imperatively.
  // Without useImperativeHandle there is no way to expose the adapter.
  useImperativeHandle(forwardedRef, () => ({
    zoomIn:     () => adapterRef.current?.zoomIn(),
    zoomOut:    () => adapterRef.current?.zoomOut(),
    resetZoom:  () => adapterRef.current?.resetZoom(),
    exportPNG:  () => adapterRef.current?.exportPNG() ?? '',
    exportSVG:  () => adapterRef.current?.exportSVG() ?? '',
  }), []);

  return { adapterRef };
}

// ─── Stable event bridge ──────────────────────────────────────────────────────

function useEventBridge<E extends ChartEventName>(
  adapterRef: RefObject<ChartAdapter | null>,
  event: E,
  handler: ChartEventHandler<E> | undefined,
) {
  // Keep handler current without re-registering
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const adapter = adapterRef.current;
    if (!adapter) return;

    // Register a stable wrapper — identity never changes between renders
    const stableHandler = (...args: any[]) => {
      (handlerRef.current as any)?.(...args);
    };

    adapter.on(event, stableHandler as ChartEventHandler<E>);
    return () => {
      adapter.off(event, stableHandler as ChartEventHandler<E>);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Register once per mount — handler updates via ref
}

// ─── Exported handle type ─────────────────────────────────────────────────────

export interface BubbleChartHandle {
  zoomIn(): void;
  zoomOut(): void;
  resetZoom(): void;
  exportPNG(): string;
  exportSVG(): string;
}
