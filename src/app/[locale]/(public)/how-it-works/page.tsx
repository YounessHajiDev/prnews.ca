export const metadata = {
  title: 'How It Works — PR NEWS',
  description: 'Learn how PR NEWS distributes your press release to outlets across Canada.',
};

export default function HowItWorksPage() {
  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <h1 className="heading-lg mb-4">How It Works</h1>
        <p className="body-large text-wire-muted mb-16">
          Three simple steps to distribute your story nationwide.
        </p>

        <div className="space-y-16">
          {[
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
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-wire-amber/10 flex items-center justify-center font-display text-xl font-bold text-wire-amber">
                {step}
              </div>
              <div>
                <h2 className="heading-md mb-2">{title}</h2>
                <p className="body-base text-wire-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 card text-center">
          <h2 className="heading-md mb-4">Ready to Get Started?</h2>
          <p className="text-wire-muted mb-6">Publish your first press release today.</p>
          <a href="/signup">
            <button className="btn-primary">Create Account</button>
          </a>
        </div>
      </div>
    </section>
  );
}
