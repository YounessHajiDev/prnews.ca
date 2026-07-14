import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata = { title: 'Contact — PR NEWS' };

export default function ContactPage() {
  return (
    <section className="section bg-wire-paper">
      <div className="container-narrow">
        <p className="dateline mb-3">PR NEWS · CONTACT DESK</p>
        <h1 className="heading-lg mb-8">Contact Us</h1>

        <p className="body-large mb-10 max-w-2xl text-wire-slate">
          Have questions about PR NEWS? We&apos;d love to hear from you.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card p-6">
            <Mail className="mb-4 h-6 w-6 text-wire-brass" />
            <h2 className="heading-sm mb-1">Email</h2>
            <a
              href="mailto:hello@prnews.ca"
              className="text-wire-ink underline-offset-4 hover:text-wire-brass hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wire-brass focus-visible:ring-offset-2 rounded-sm"
            >
              hello@prnews.ca
            </a>
          </div>

          <div className="card p-6">
            <Phone className="mb-4 h-6 w-6 text-wire-brass" />
            <h2 className="heading-sm mb-1">Phone</h2>
            <span className="font-mono text-wire-slate">1-800-PR-NEWS</span>
          </div>

          <div className="card p-6 sm:col-span-2 lg:col-span-1">
            <MapPin className="mb-4 h-6 w-6 text-wire-brass" />
            <h2 className="heading-sm mb-1">Address</h2>
            <p className="text-wire-slate">Toronto, Ontario, Canada</p>
          </div>
        </div>
      </div>
    </section>
  );
}
