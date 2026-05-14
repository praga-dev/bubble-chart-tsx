import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';
import { BubbleChart } from '../src/BubbleChart';
import { createChartAdapter } from '../src/core-bridge/createChartAdapter';

vi.mock('../src/core-bridge/createChartAdapter', () => {
  return {
    createChartAdapter: vi.fn(),
  };
});

describe('Data Updates', () => {
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

  it('batches rapid data updates into one adapter call per frame', async () => {
    const { rerender } = render(<BubbleChart data={[{ id: 1, label: 'A', value: 10 }]} updateMode="raf" />);
    
    // Multiple rapid state updates from parent
    rerender(<BubbleChart data={[{ id: 1, label: 'A', value: 20 }]} updateMode="raf" />);
    rerender(<BubbleChart data={[{ id: 1, label: 'A', value: 30 }]} updateMode="raf" />);
    
    // Wait for next RAF
    await act(async () => {
      await new Promise(r => requestAnimationFrame(r));
    });
    
    // updateData should have been called exactly once with the latest data
    expect(mockAdapter.updateData).toHaveBeenCalledOnce();
    expect(mockAdapter.updateData).toHaveBeenCalledWith([{ id: 1, label: 'A', value: 30 }]);
  });
});
