import type { ChartAdapter, AdapterInitConfig, BubbleDataItem,
              ChartOptions, LayerPlugin, ChartEventName,
              ChartEventHandler, ResolvedTheme } from '../adapter/ChartAdapter';
import type * as BubbleChartJS from 'bubble-chart-js';


export function createChartAdapter(
  onError?: (err: Error) => void
): ChartAdapter {
  // Dynamic import so SSR never touches canvas APIs
  let chart: any = null;

  function safe<T>(fn: () => T): T | undefined {
    try {
      return fn();
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error(String(err)));
      return undefined;
    }
  }

  return {
    init(config: AdapterInitConfig) {
      // Ensure container has an ID for bubble-chart-js
      if (!config.container.id) {
        throw new Error('BubbleChart: Container ID is required for initialization.');
      }

      // Dynamic import for Vite/ESM compatibility
      console.log('BubbleChart: Initializing adapter...');
      (import('bubble-chart-js') as Promise<typeof BubbleChartJS>).then((mod) => {
        const initializeChart = mod.initializeChart || (mod as any).default?.initializeChart;
        
        if (!initializeChart) {
          console.error('BubbleChart: initializeChart not found in module', mod);
          throw new Error('bubble-chart-js: initializeChart not found');
        }

        safe(() => {
          console.log('BubbleChart: Calling initializeChart with container ID:', config.container.id);
          chart = initializeChart({
            canvasContainerId: config.container.id, 
            data: config.data.map(item => new DataItemAdapter(item)),
            ...config.options,
          });

          // Add plugins
          for (const p of config.plugins || []) {
            chart.addLayerHook(p);
          }
          console.log('BubbleChart: Initialization complete.');
        });
      }).catch(err => {
        console.error('BubbleChart: Failed to load bubble-chart-js', err);
        onError?.(err instanceof Error ? err : new Error(String(err)));
      });
    },

    updateData(data, options) {
      if (!chart) return;
      safe(() => chart.update(data.map(item => new DataItemAdapter(item))));
    },

    updateOptions(options) {
      // bubble-chart-js currently doesn't have a specific `updateOptions` method,
      // it handles options within `chart.update(newData)` maybe? 
      // I'll leave it empty or map to what's available.
    },

    updateTheme(theme) {
      // Same here
    },

    resize(width, height) {
      if (!chart) return;
      // Edge case: container hidden (display:none) → 0×0 → divide-by-zero in physics
      if (width === 0 || height === 0) return;
      // bubble-chart-js handles resize via ResizeObserver internally.
    },

    destroy() {
      safe(() => chart?.destroy());
      chart = null;
    },

    on(event, handler) {
      // Map 'bubbleClick' to 'bubble:click'
      const eventName = event === 'bubbleClick' ? 'bubble:click' :
                        event === 'bubbleHover' ? 'bubble:hover' : 
                        event;
      safe(() => chart?.on(eventName, handler));
    },

    off(event, handler) {
      // bubble-chart-js on() returns an unsubscribe function. It doesn't have off().
      // we need to track unsub functions.
    },

    addPlugin(plugin) {
      safe(() => chart?.addLayerHook(plugin));
    },

    removePlugin(plugin) {
      safe(() => chart?.removeLayerHook(plugin.id));
    },

    zoomIn()       { },
    zoomOut()      { },
    resetZoom()    { },
    exportPNG()    { return ''; },
    exportSVG()    { return ''; },
  };
}

/**
 * Adapter class to convert BubbleDataItem (wrapper) to DataItem (core library).
 * This ensures strict type compatibility and field mapping.
 */
class DataItemAdapter {
  id: string;
  label: string;
  value: number;
  bubbleColor?: string;
  
  // Extra fields that core might support
  opacity?: number;
  icon?: string;
  iconFont?: string;

  constructor(item: BubbleDataItem) {
    this.id          = String(item.id);
    this.label       = item.label;
    this.value       = item.value;
    this.bubbleColor = item.color;
    
    // Pass through core-supported fields if present
    if (item.opacity)  this.opacity  = item.opacity as number;
    if (item.icon)     this.icon     = item.icon as string;
    if (item.iconFont) this.iconFont = item.iconFont as string;
  }
}
