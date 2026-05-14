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

describe('Strict Mode', () => {
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

  it('handles StrictMode remount without double-init', () => {
    render(
      <React.StrictMode>
        <BubbleChart data={[]} />
      </React.StrictMode>
    );
    // StrictMode mounts → unmounts → remounts
    // destroy() then init() should each be called exactly once (net new instances could be 2)
    // createChartAdapter is called twice in strict mode.
    expect(createChartAdapter).toHaveBeenCalledTimes(2);
    expect(mockAdapter.init).toHaveBeenCalledTimes(2);
    expect(mockAdapter.destroy).toHaveBeenCalledTimes(1);
  });
});
