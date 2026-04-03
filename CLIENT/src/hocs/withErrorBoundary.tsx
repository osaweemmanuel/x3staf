import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
}
