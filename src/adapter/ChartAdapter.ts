// ─── Data ────────────────────────────────────────────────────────────────────

export interface BubbleDataItem {
  id: string | number;
  label: string;
  value: number;
  color?: string;
  [key: string]: unknown;
}

// ─── Options ─────────────────────────────────────────────────────────────────

export interface ChartOptions {
  physics?: boolean;
  gravity?: number;
  friction?: number;
  renderer?: 'canvas' | 'svg';
  [key: string]: unknown;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export type ChartEventName = 'bubbleClick' | 'bubbleHover' | 'bubbleLeave';

export type ChartEventHandler<E = ChartEventName> =
  E extends 'bubbleClick' ? (item: BubbleDataItem, event: MouseEvent) => void :
  E extends 'bubbleHover' ? (item: BubbleDataItem, event: MouseEvent) => void :
  E extends 'bubbleLeave' ? (event: MouseEvent) => void :
  never;

// ─── Adapter interface ────────────────────────────────────────────────────────
// This is the ONLY thing React ever talks to.
// bubble-chart-js internals must never cross this boundary.

export interface ChartAdapter {
  init(config: AdapterInitConfig): void;
  updateData(data: BubbleDataItem[], options?: Partial<ChartOptions>): void;
  updateOptions(options: ChartOptions): void;
  updateTheme(theme: ResolvedTheme): void;
  resize(width: number, height: number): void;
  destroy(): void;
  on<E extends ChartEventName>(event: E, handler: ChartEventHandler<E>): void;
  off<E extends ChartEventName>(event: E, handler: ChartEventHandler<E>): void;
  addPlugin(plugin: LayerPlugin): void;
  removePlugin(plugin: LayerPlugin): void;
  // Imperative handle methods exposed via ref
  zoomIn(): void;
  zoomOut(): void;
  resetZoom(): void;
  exportPNG(): string;      // returns data URL
  exportSVG(): string;      // returns SVG string
}

export interface AdapterInitConfig {
  container: HTMLElement;
  data: BubbleDataItem[];
  options?: ChartOptions;
  theme?: ResolvedTheme;
  plugins?: LayerPlugin[];
}

export interface ResolvedTheme {
  background: string;
  text: string;
  bubbleColors?: string[];
}

export interface LayerPlugin {
  id: string;               // REQUIRED — used for diffing, must be stable
  init?(ctx: CanvasRenderingContext2D | SVGSVGElement): void;
  draw(ctx: CanvasRenderingContext2D | SVGSVGElement): void;
  destroy?(): void;
}
