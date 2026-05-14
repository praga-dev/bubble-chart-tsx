import React from 'react';

export function DebugOverlay({ info }: { info: Record<string, string | number | boolean | undefined> }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'rgba(0, 0, 0, 0.75)',
        color: '#0f0',
        padding: '8px 12px',
        fontFamily: 'monospace',
        fontSize: 11,
        borderRadius: 4,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#fff' }}>Debug Overlay</div>
      {Object.entries(info).map(([key, value]) => (
        <div key={key}>
          <span style={{ opacity: 0.7 }}>{key}: </span>
          <span>{String(value)}</span>
        </div>
      ))}
    </div>
  );
}
