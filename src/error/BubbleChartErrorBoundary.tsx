import React, { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  onError?: (err: Error) => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// EDGE CASE: React Error Boundary catches render-phase errors.
// Imperative errors (updateData, resize, plugins) are caught inside
// the adapter's safe() wrapper and routed to props.onError.
// Together they cover both paths.
export class BubbleChartErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error);
    console.error('[BubbleChart] render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div role="alert" style={{ padding: 16, color: 'red', fontSize: 13 }}>
          Chart failed to render.
        </div>
      );
    }
    return this.props.children;
  }
}
