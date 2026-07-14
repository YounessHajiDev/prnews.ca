import Link from 'next/link';

export default function LocaleNotFound() {
  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow text-center">
        <h1 className="heading-lg mb-4">Page not found</h1>
        <p className="text-wire-muted mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    </section>
  );
}
