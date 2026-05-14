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

describe('Options', () => {
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

  it('does not call updateOptions when options are structurally equal', () => {
    const { rerender } = render(<BubbleChart data={[]} options={{ physics: true }} />);
    
    // new object reference, same value
    rerender(<BubbleChart data={[]} options={{ physics: true }} />);
    
    expect(mockAdapter.updateOptions).not.toHaveBeenCalled();
  });
});
