import { db } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';

export default async function ResourcePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <h1 className="heading-lg mb-8">Resource: {slug}</h1>
        <div className="prose-release">
          <p>Content coming soon.</p>
        </div>
      </div>
    </section>
  );
}
