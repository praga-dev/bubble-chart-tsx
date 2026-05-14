import React from 'react';
import type { BubbleDataItem } from '../adapter/ChartAdapter';

interface Props {
  data: BubbleDataItem[];
}

// Visually hidden but screen-reader accessible.
// EDGE CASE: aria-live="polite" announces data updates to screen readers
// without interrupting what they're currently reading.
const hiddenStyle: React.CSSProperties = {
  position:   'absolute',
  width:      '1px',
  height:     '1px',
  overflow:   'hidden',
  clip:       'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border:     0,
};

export function HiddenDataTable({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <div style={hiddenStyle}>
      <table aria-live="polite" aria-atomic="true">
        <caption>Bubble chart data</caption>
        <thead>
          <tr>
            <th scope="col">Label</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.label}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
