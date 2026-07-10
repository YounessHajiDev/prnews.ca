import { db } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <h1 className="heading-lg mb-8">Blog: {slug}</h1>
        <div className="prose-release">
          <p>Content coming soon.</p>
        </div>
      </div>
    </section>
  );
}
