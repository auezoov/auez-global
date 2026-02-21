import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('🚨 React Error Caught:', error, errorInfo);
    
    // Silently handle removeChild DOM errors from external scripts
    if (error.message && error.message.includes('removeChild')) {
      console.warn('🔧 DOM removeChild error handled silently');
      return;
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
