export default function HeroProductMockup() {
  return <div className="hero-assistance-preview" aria-label="Assistance explanation preview">
    <article className="hero-preview-finding">
      <p className="hero-preview-label">Assistance</p>
      <h2>Your payment was found.</h2>
      <dl><div><dt>You paid</dt><dd>₹18,420</dd></div><div><dt>Return recognised</dt><dd>₹0</dd></div></dl>
      <strong className="hero-mobile-mismatch">₹18,420 wasn&apos;t counted</strong>
    </article>
    <article className="hero-preview-explanation-card">
      <strong className="hero-preview-highlight">₹18,420 wasn&apos;t counted</strong>
      <p className="hero-preview-explanation">Your payment exists in your Income Tax records,<br />but wasn&apos;t included when your return was processed.</p>
      <p className="hero-preview-footer">Payment · Form 26AS · Processed return checked</p>
    </article>
  </div>;
}
