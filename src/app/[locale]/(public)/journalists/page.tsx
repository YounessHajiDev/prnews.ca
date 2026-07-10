export const metadata = { title: 'Journalists — PR NEWS' };

export default function JournalistsPage() {
  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <h1 className="heading-lg mb-8">Journalists</h1>
        <div className="prose-release">
          <p>PR NEWS provides journalists with easy access to press releases across Canada. Browse releases by category, province, or topic.</p>
          <h2>For Journalists</h2>
          <ul>
            <li>Access to verified press releases from Canadian companies</li>
            <li>Option to join our media list for beat-matching alerts</li>
            <li>Embargo access for time-sensitive stories</li>
          </ul>
          <h2>Join Our Media List</h2>
          <p>Sign up to receive press releases relevant to your beat.</p>
        </div>
      </div>
    </section>
  );
}
