import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Something went wrong</h1>
              <p className="text-gray-600 mb-6">We're sorry for the inconvenience. Please try refreshing the page.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
