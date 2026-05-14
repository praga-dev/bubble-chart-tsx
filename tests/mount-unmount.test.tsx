import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';
import { BubbleChart } from '../src/BubbleChart';
import { createChartAdapter } from '../src/core-bridge/createChartAdapter';

// Mock the adapter factory
vi.mock('../src/core-bridge/createChartAdapter', () => {
  return {
    createChartAdapter: vi.fn(),
  };
});

describe('Mount and Unmount', () => {
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

  it('initialises adapter on mount', () => {
    const { unmount } = render(<BubbleChart data={[]} />);
    expect(mockAdapter.init).toHaveBeenCalledOnce();
    
    unmount();
    expect(mockAdapter.destroy).toHaveBeenCalledOnce();
  });

  it('does not call updateData on an unmounted adapter if async init triggers', async () => {
    const { unmount } = render(<BubbleChart data={[]} />);
    // Simulate rapid unmount before RAF fires
    unmount();
    await act(async () => {
      await new Promise(r => requestAnimationFrame(r));
    });
    expect(mockAdapter.updateData).not.toHaveBeenCalled();
  });
});
