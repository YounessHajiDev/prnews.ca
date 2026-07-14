import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-6xl font-bold text-wire-brass">404</h1>
      <p className="mt-4 text-xl font-semibold text-wire-charcoal">Page not found</p>
      <p className="mt-2 text-wire-muted">Sorry, we couldn&apos;t find the page you were looking for.</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-wire-charcoal px-6 py-3 text-sm font-medium text-white hover:bg-wire-ink"
      >
        Back to home
      </Link>
    </main>
  );
}
