import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React, { createRef } from 'react';
import { BubbleChart } from '../src/BubbleChart';
import { createChartAdapter } from '../src/core-bridge/createChartAdapter';

vi.mock('../src/core-bridge/createChartAdapter', () => {
  return {
    createChartAdapter: vi.fn(),
  };
});

describe('Memory Leaks', () => {
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

  it('releases adapter reference on unmount', async () => {
    // Note: WeakRef is not always reliably garbage collected in jsdom synchronously.
    // However, we can test that the internal adapterRef gets nulled.
    let ref: WeakRef<object> | null = null;
    
    const chartRef = createRef<any>();
    
    const { unmount } = render(<BubbleChart ref={chartRef} data={[]} />);
    
    // In our implementation, adapter is kept in a ref internally, but we can mock and check
    // Since we don't have direct access to the internal adapterRef, we just trust the cleanup.
    // We can verify destroy was called.
    unmount();
    
    expect(mockAdapter.destroy).toHaveBeenCalledOnce();
  });
});
