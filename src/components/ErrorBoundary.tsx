
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ProductHub application error:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary">
          <AlertTriangle size={48} />

          <h1>Something went wrong</h1>

          <p>
            An unexpected error occurred.
            Please try again.
          </p>

          <button type="button" onClick={this.handleRetry}>
            <RefreshCw size={17} />
            Try Again
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
