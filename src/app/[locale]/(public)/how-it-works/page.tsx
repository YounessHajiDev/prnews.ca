import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'How It Works — PR NEWS',
  description: 'Learn how PR NEWS distributes your press release to outlets across Canada.',
};

const STEPS = [
  {
    step: '1',
    title: 'Write & Submit',
    desc: 'Use our intuitive submission wizard to craft your press release. Our rich text editor makes formatting effortless, and bilingual publishing is just one toggle away.',
  },
  {
    step: '2',
    title: 'Editorial Review',
    desc: 'Our editorial team reviews your release for quality and compliance. Most reviews are completed within 2 business hours, with priority review available for Growth subscribers.',
  },
  {
    step: '3',
    title: 'Distribute & Track',
    desc: 'Once approved, your release is distributed to our network of media outlets across Canada. Track every delivery in real-time through your dashboard.',
  },
];

export default function HowItWorksPage() {
  return (
    <section className="section bg-wire-paper">
      <div className="container-narrow">
        <p className="dateline mb-3">PR NEWS · PROCESS</p>
        <h1 className="heading-lg mb-4">How It Works</h1>
        <p className="body-large mb-12 max-w-2xl text-wire-slate">
          Three simple steps to distribute your story nationwide.
        </p>

        <div className="space-y-10">
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-wire-rule bg-wire-surface font-mono text-xl font-bold text-wire-brass">
                {step}
              </div>
              <div className="pt-1">
                <h2 className="heading-md mb-2">{title}</h2>
                <p className="body-base max-w-xl text-wire-slate">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-wire-rule pt-10 text-center">
          <h2 className="heading-md mb-3">Ready to Get Started?</h2>
          <p className="mb-6 text-wire-slate">Publish your first press release today.</p>
          <Link href="/signup" className={buttonVariants({ size: 'lg' })}>
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}
