export const metadata = { title: 'CASL Compliance — PR NEWS' };

export default function CASLPage() {
  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <h1 className="heading-lg mb-8">CASL Compliance</h1>
        <div className="prose-release">
          <p>PR NEWS complies with Canada's Anti-Spam Legislation (CASL). Our email practices include:</p>
          <ul>
            <li><strong>Explicit consent:</strong> We only send emails to people who have explicitly opted in.</li>
            <li><strong>Identification:</strong> All emails clearly identify PR NEWS as the sender.</li>
            <li><strong>Unsubscribe:</strong> Every marketing email includes a one-click unsubscribe link.</li>
            <li><strong>Physical address:</strong> Our mailing address appears in the footer of every email.</li>
          </ul>
          <p>For CASL-related inquiries, contact us at casl@prnews.ca.</p>
        </div>
      </div>
    </section>
  );
}
