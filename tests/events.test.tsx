import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { BubbleChart } from '../src/BubbleChart';
import { createChartAdapter } from '../src/core-bridge/createChartAdapter';

vi.mock('../src/core-bridge/createChartAdapter', () => {
  return {
    createChartAdapter: vi.fn(),
  };
});

describe('Events', () => {
  let mockAdapter: any;

  beforeEach(() => {
    mockAdapter = {
      init: vi.fn(),
      updateData: vi.fn(),
      updateOptions: vi.fn(),
      updateTheme: vi.fn(),
      resize: vi.fn(),
      destroy: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      addPlugin: vi.fn(),
      removePlugin: vi.fn(),
    };
    vi.mocked(createChartAdapter).mockReturnValue(mockAdapter);
  });

  it('does not re-register event handler on re-render', () => {
    const { rerender } = render(<BubbleChart data={[]} onBubbleClick={() => {}} />);
    
    // Re-render with new function reference
    rerender(<BubbleChart data={[]} onBubbleClick={() => {}} />);
    
    // Should register exactly once per event type
    expect(mockAdapter.on).toHaveBeenCalledTimes(3); // click, hover, leave
    // Should never remove it during re-renders
    expect(mockAdapter.off).not.toHaveBeenCalled();
  });
});
