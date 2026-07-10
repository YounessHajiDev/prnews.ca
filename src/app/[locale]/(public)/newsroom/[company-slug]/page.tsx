import { Breadcrumb } from '@/components/layout/breadcrumb';

export default function NewsroomPage() {
  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <Breadcrumb items={[{ label: 'Newsrooms', href: '/newsroom' }, { label: 'MapleAI Inc.' }]} />
        <h1 className="heading-lg mb-4">MapleAI Inc.</h1>
        <p className="text-wire-muted mb-8">Press releases from MapleAI Inc.</p>
        <div className="card p-8 text-center">
          <p className="text-wire-muted">Newsroom page coming soon.</p>
        </div>
      </div>
    </section>
  );
}
