import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'white', background: 'red', zIndex: 9999, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <h1>Sorry.. there was an error</h1>
          <p>{this.state.error?.toString()}</p>
          <pre>{this.state.error?.stack}</pre>
          <pre>{this.state.errorInfo?.componentStack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
