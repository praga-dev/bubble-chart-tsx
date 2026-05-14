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

describe('Plugins', () => {
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

  it('only removes/adds plugins that changed', () => {
    const pluginA = { id: 'a', draw: vi.fn() };
    const pluginB = { id: 'b', draw: vi.fn() };
    const pluginC = { id: 'c', draw: vi.fn() };

    const { rerender } = render(<BubbleChart data={[]} plugins={[pluginA, pluginB]} />);
    
    // Rerender with different array
    rerender(<BubbleChart data={[]} plugins={[pluginB, pluginC]} />);

    expect(mockAdapter.removePlugin).toHaveBeenCalledWith(pluginA);
    expect(mockAdapter.addPlugin).toHaveBeenCalledWith(pluginC);
    expect(mockAdapter.removePlugin).not.toHaveBeenCalledWith(pluginB);
  });
});
