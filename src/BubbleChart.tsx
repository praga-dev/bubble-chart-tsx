import React, {
  forwardRef, useRef, useId, type ReactElement,
} from 'react';
import { useBubbleChart, type BubbleChartHandle } from './hooks/useBubbleChart';
import { useResizeObserver } from './utils/resizeObserver';
import { HiddenDataTable } from './a11y/HiddenDataTable';
import { BubbleChartErrorBoundary } from './error/BubbleChartErrorBoundary';
import type {
  BubbleDataItem, ChartOptions, LayerPlugin,
  ChartEventHandler
} from './adapter/ChartAdapter';



// ─── Props ────────────────────────────────────────────────────────────────────

export interface ResolvedThemeInput {
  background: string;
  text: string;
  bubbleColors?: string[];
}

export interface BubbleChartProps {
  /** Optional unique ID for the container element. Auto-generated if omitted. */
  id?: string;

  // Data
  data?: BubbleDataItem[];

  // Rendering
  renderer?: 'canvas' | 'svg';

  // Behaviour
  options?: ChartOptions;
  updateMode?: 'raf' | 'throttle' | 'debounce';
  worker?: boolean;

  // Appearance
  theme?: 'light' | 'dark' | Partial<ResolvedThemeInput>;
  style?: React.CSSProperties;
  className?: string;

  // Plugins
  plugins?: LayerPlugin[];

  // Events
  onBubbleClick?: ChartEventHandler<'bubbleClick'>;
  onBubbleHover?: ChartEventHandler<'bubbleHover'>;
  onBubbleLeave?: ChartEventHandler<'bubbleLeave'>;

  // Error
  onError?: (err: Error) => void;
}

// ─── Inner component (needs forwardRef) ───────────────────────────────────────

const BubbleChartInner = forwardRef<BubbleChartHandle, BubbleChartProps>(
  function BubbleChartInner(props, ref): ReactElement | null {
    const generatedId = useId();
    const containerId = props.id || `bubble-chart-${generatedId.replace(/:/g, '')}`;
    const containerRef = useRef<HTMLDivElement | null>(null);

    // All lifecycle logic lives in the hook
    // EDGE CASE: useBubbleChart must handle null containerRef.current on server
    const { adapterRef } = useBubbleChart(containerRef, { ...props, id: containerId }, ref);

    // Resize observer — notifies the adapter when the container changes size
    // EDGE CASE: useResizeObserver must handle null on server
    useResizeObserver(containerRef, adapterRef);

    return (
      <>
        <div
          id={containerId}
          ref={containerRef}
          className={props.className}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            ...props.style,
          }}
          // EDGE CASE: a11y — canvas has no semantic meaning for screen readers
          role="img"
          aria-label="Bubble chart"
        />
        {/* EDGE CASE: a11y — hidden data table for screen readers */}
        <HiddenDataTable data={props.data ?? []} />
      </>
    );
  }
);

// ─── Public component (wrapped in error boundary) ─────────────────────────────

export const BubbleChart = forwardRef<BubbleChartHandle, BubbleChartProps>(
  function BubbleChart(props, ref): ReactElement | null {
    return (
      <BubbleChartErrorBoundary onError={props.onError}>
        <BubbleChartInner {...props} ref={ref} />
      </BubbleChartErrorBoundary>
    );
  }
);
