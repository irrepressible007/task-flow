/**
 * ErrorBoundary.jsx — React Error Boundary
 *
 * Catches any unhandled JavaScript errors in the component tree below it
 * and shows a user-friendly fallback UI instead of a blank white screen.
 *
 * Must be a CLASS component — React error boundaries cannot be written
 * as functional components (as of React 18).
 *
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 */

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // hasError drives which UI to render
    this.state = { hasError: false, errorMessage: '' };
  }

  // Called when a descendant component throws during rendering
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  // Called after an error is caught — good place to log to an error service
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__box">
            <div className="error-boundary__icon">⚠</div>
            <h2 className="error-boundary__title">Something went wrong</h2>
            <p className="error-boundary__message">
              The app encountered an unexpected error. Please refresh the page.
            </p>
            <p className="error-boundary__detail">{this.state.errorMessage}</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    // Normal render — pass children through untouched
    return this.props.children;
  }
}

export default ErrorBoundary;
