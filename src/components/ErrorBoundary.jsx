
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 React Error Caught:', error, errorInfo);
    
    // Silently handle removeChild DOM errors from external scripts
    if (error.message && error.message.includes('removeChild')) {
      console.warn('🔧 DOM removeChild error handled silently');
      return;
    }
  }

  render() {
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
