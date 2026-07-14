'use client';

export default function ErrorBoundary({
  error,
}: {
  error: Error;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-wire-bg">
      <div className="text-center">
        <h1 className="heading-lg mb-4">Something went wrong</h1>
        <p className="text-wire-muted mb-6">Please try refreshing the page.</p>
        <a href="/" className="btn-primary">Go Home</a>
      </div>
    </div>
  );
}
