# bubble-chart-tsx

**The enterprise-grade React engine for `bubble-chart-js`. Build high-performance, physics-driven bubble visualizations with declarative elegance.**

[![npm version](https://img.shields.io/npm/v/bubble-chart-tsx.svg)](https://www.npmjs.com/package/bubble-chart-tsx)
[![React Version](https://img.shields.io/badge/react-18+-61dafb.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## The React Architect's Choice

`bubble-chart-tsx` isn't just a wrapper; it's a high-performance bridge designed for mission-critical dashboards. It abstracts the complexity of `bubble-chart-js` into a first-class React component, handling reconciliation, lifecycle synchronization, and accessibility out of the box.

### Key Architectural Features

-   **⚛️ Fully Declarative API** — Control complex physics simulations and rendering modes through standard React props.
-   **⚡ Zero-Lag Reconciliation** — High-frequency data updates are batched via requestAnimationFrame (RAF) to ensure smooth 60fps transitions without blocking the main thread.
-   **🛡️ Enterprise-Ready A11y** — Automatically generates hidden semantic data tables for screen readers (`ARIA` compliant).
-   **🧩 Pluggable Architecture** — Inject custom render layers via a reactive plugin system.
-   **📏 Smart Auto-Resize** — Built-in `ResizeObserver` integration ensures the chart scales perfectly within any responsive layout.
-   **🌲 Type-Safe** — Written in TypeScript with exhaustive prop definitions and IDE-friendly documentation.

---

## Installation

```bash
npm install bubble-chart-tsx bubble-chart-js
# or
yarn add bubble-chart-tsx bubble-chart-js
```

> [!IMPORTANT]
> `bubble-chart-js` is a peer dependency. Ensure it is installed alongside the wrapper.

---

## Quick Start

### Basic Implementation

```tsx
import { BubbleChart } from 'bubble-chart-tsx';

const MyDashboard = () => {
  const data = [
    { id: 1, label: 'Market Cap', value: 450, color: '#6366f1' },
    { id: 2, label: 'Revenue', value: 320, color: '#10b981' },
    { id: 3, label: 'Growth', value: 180, color: '#f43f5e' },
  ];

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <BubbleChart 
        data={data}
        renderer="canvas"
        theme="dark"
        onBubbleClick={(item) => console.log('Selected:', item.label)}
      />
    </div>
  );
};
```

---

## Advanced Usage

### Imperative Control (Refs)

Access the internal engine methods for advanced interactions like exporting or manual zoom control.

```tsx
import { useRef } from 'react';
import { BubbleChart, type BubbleChartHandle } from 'bubble-chart-tsx';

const ChartController = () => {
  const chartRef = useRef<BubbleChartHandle>(null);

  const handleExport = () => {
    const dataUrl = chartRef.current?.exportPNG();
    // Trigger download...
  };

  return (
    <>
      <button onClick={() => chartRef.current?.zoomIn()}>Zoom In</button>
      <button onClick={handleExport}>Export Image</button>
      
      <div style={{ height: '400px' }}>
        <BubbleChart ref={chartRef} data={myData} />
      </div>
    </>
  );
};
```

### Custom Plugin Layers

Extend the rendering pipeline by injecting custom Canvas/SVG draw calls.

```tsx
const haloPlugin = {
  id: 'glow-halo',
  draw: (ctx) => {
    // Custom Canvas 2D logic...
  }
};

<BubbleChart 
  data={data} 
  plugins={[haloPlugin]} 
/>
```

---

## API Reference

### `BubbleChart` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `BubbleDataItem[]` | `[]` | Array of data points. Reconciliation is keyed by `id`. |
| `renderer` | `'canvas' \| 'svg'` | `'canvas'` | Rendering engine. Use Canvas for high-density (>100 nodes). |
| `theme` | `'light' \| 'dark' \| ThemeObj` | `'light'` | Built-in themes or a custom color configuration. |
| `options` | `ChartOptions` | `{}` | Fine-grained control over physics, gravity, and friction. |
| `updateMode` | `'raf' \| 'throttle' \| 'debounce'` | `'raf'` | Strategy for high-frequency data updates. |
| `worker` | `boolean` | `false` | Offload physics simulation to a Web Worker (experimental). |
| `className` | `string` | — | CSS class for the container element. |
| `style` | `React.CSSProperties` | — | Inline styles for the container. |

### `BubbleChartHandle` (Ref Methods)

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `zoomIn()` | `void` | Incremental zoom in. |
| `zoomOut()` | `void` | Incremental zoom out. |
| `resetZoom()` | `void` | Reset to initial view. |
| `exportPNG()` | `string` | Returns a Base64 data URL of the current canvas. |
| `exportSVG()` | `string` | Returns an SVG string of the current chart. |

---

## Event System

| Prop | Signature | Description |
| :--- | :--- | :--- |
| `onBubbleClick` | `(item, event) => void` | Triggered on mouse/touch click. |
| `onBubbleHover` | `(item, event) => void` | Triggered on hover enter. |
| `onBubbleLeave` | `(event) => void` | Triggered when the pointer leaves a bubble. |
| `onError` | `(err) => void` | Catch-all for rendering or physics simulation errors. |

---

## Performance Optimization

For high-cardinality datasets (1,000+ items), `bubble-chart-tsx` implements several optimization strategies:

1.  **RAF Batching**: Even if you push data updates every 1ms, the component only re-renders the underlying engine once per animation frame.
2.  **Memoization-Aware**: Internal deep-equality checks on `options` and `theme` prevent unnecessary re-initializations when using inline objects.
3.  **Passive Observers**: Uses `ResizeObserver` for non-blocking layout recalculations.

---

## Contributing

We welcome contributions from the community. Please see our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## License

MIT © [Srisha Ravi](https://github.com/Srisha-Ravi)