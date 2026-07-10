export const metadata = { title: 'Accessibility Statement — PR NEWS' };

export default function AccessibilityPage() {
  return (
    <section className="section bg-wire-bg">
      <div className="container-narrow">
        <h1 className="heading-lg mb-8">Accessibility Statement</h1>
        <div className="prose-release">
          <p>PR NEWS is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
          <h2>Conformance Status</h2>
          <p>The <a href="https://www.w3.org/WAI/standards-guidelines/wcag/">Web Content Accessibility Guidelines (WCAG)</a> defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.</p>
          <p>PR NEWS is partially conformant with <strong>WCAG 2.1 Level AA</strong>. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.</p>
          <h2>Feedback</h2>
          <p>We welcome your feedback on the accessibility of PR NEWS. Please let us know if you encounter accessibility barriers:</p>
          <ul>
            <li>Email: accessibility@prnews.ca</li>
            <li>Phone: 1-800-PR-NEWS</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
