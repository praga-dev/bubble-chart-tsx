// Component
export { BubbleChart } from './BubbleChart';

// Types consumers need
export type { BubbleChartProps, ResolvedThemeInput } from './BubbleChart';
export type { BubbleChartHandle }      from './hooks/useBubbleChart';
export type {
  BubbleDataItem,
  ChartOptions,
  LayerPlugin,
  ChartEventHandler,
  ChartEventName,
}                                      from './adapter/ChartAdapter';

// HMR decline
if (typeof import.meta !== 'undefined' && (import.meta as any).hot) {
  (import.meta as any).hot.decline();
}
