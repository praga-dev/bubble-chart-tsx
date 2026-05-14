# bubble-chart-tsx

A React wrapper for `bubble-chart-js`, delivering a robust, high-performance bubble chart component with zero runtime dependencies.

## Installation

```bash
npm install bubble-chart-tsx bubble-chart-js
```

## Basic Usage

```tsx
import { BubbleChart } from 'bubble-chart-tsx';

function App() {
  const data = [
    { id: 1, label: 'React', value: 40 },
    { id: 2, label: 'Vue', value: 30 },
  ];

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <BubbleChart
        data={data}
        options={{ physics: true }}
        theme="dark"
        onBubbleClick={(item) => console.log('Clicked', item)}
      />
    </div>
  );
}
```

## Next.js & SSR Integration

Because `bubble-chart-js` interacts directly with canvas elements, you must prevent the component from rendering on the server. In Next.js, use dynamic imports:

```tsx
import dynamic from 'next/dynamic';

const BubbleChart = dynamic(
  () => import('bubble-chart-tsx').then((m) => m.BubbleChart),
  { ssr: false }
);
```

## Props

- `data`: Array of bubble data objects (`{ id, label, value, ... }`).
- `options`: Chart configuration.
- `theme`: `"light" | "dark"` or a custom theme object.
- `renderer`: `"canvas" | "svg"`
- `updateMode`: `"raf" | "throttle" | "debounce"`
- `plugins`: Array of layer plugins for extending the chart.
- `onBubbleClick`, `onBubbleHover`, `onBubbleLeave`: Interaction callbacks.