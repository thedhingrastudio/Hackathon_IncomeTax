import Link from "next/link";
import { ArrowRight, Landmark, ReceiptText, SearchCheck } from "lucide-react";
import LandingAssistancePreview from "../components/landing/LandingAssistancePreview";

const announcements = [
  "Tax payments and AIS records may take time to appear after processing.",
  "Review related tax records before responding to an outstanding demand.",
  "September tax timelines may require attention for applicable taxpayers.",
] as const;

export default function LandingPage() {
  return <div className="public-site">
    <header className="public-header"><div className="public-container public-header-inner"><Link className="public-brand" href="/"><span aria-hidden="true">IT</span><div><strong>Income Tax</strong><small>Citizen assistance prototype</small></div></Link><nav aria-label="Landing page"><a href="#announcements">Announcements</a><a href="#assistance">Assistance</a><a href="#capabilities">Citizen capabilities</a><Link className="public-login-link" href="/login">Login</Link></nav></div></header>

    <main>
      <section className="public-hero"><div className="public-container public-hero-grid">
        <div className="public-hero-copy"><h1>Your taxes, made clearer.</h1><p>See what needs attention, why it happened, and what to do next.</p><div className="public-actions"><Link className="public-button public-button-primary" href="/login">Login<ArrowRight aria-hidden="true" /></Link><a className="public-text-link hero-assistance-link" href="#assistance">See how Assistance works <ArrowRight aria-hidden="true" /></a></div></div>
      </div></section>

      <section className="public-section public-announcements" id="announcements"><div className="public-container"><header className="public-section-heading"><h2>Announcements</h2></header><div className="announcement-viewport" tabIndex={0} aria-label="Synthetic announcements; scroll horizontally to review"><div className="announcement-ticker">{announcements.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></article>)}<div className="announcement-ticker-copy" aria-hidden="true">{announcements.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></article>)}</div></div></div></div></section>

      <section className="public-section public-assistance-preview-section" id="assistance"><div className="public-container"><header className="public-section-heading public-preview-heading"><p className="public-kicker">From intent to outcome</p><h2>Tell us what you need to get done.</h2><p>You shouldn&apos;t have to know the right menu, form or government process. Start with your situation. Assistance checks the relevant records, explains what happened and prepares the next step for you to review.</p></header><LandingAssistancePreview /></div></section>

      <section className="public-section" id="capabilities"><div className="public-container"><header className="public-section-heading"><h2>One account. Clearer tax actions.</h2></header><div className="citizen-capability-grid"><article><ReceiptText aria-hidden="true" /><h3>Your records</h3><ul><li>Return status</li><li>Tax payments</li><li>Form 26AS</li><li>Pending actions</li><li>Processing records</li></ul></article><article><SearchCheck aria-hidden="true" /><h3>When you need help</h3><ul><li>Understand a demand</li><li>Compare related records</li><li>Prepare the next action</li><li>Track the case afterwards</li></ul></article></div></div></section>

      <section className="public-demo-cta"><div className="public-container public-demo-cta-inner"><span><Landmark aria-hidden="true" /></span><div><h2>See the redesigned citizen journey.</h2><p>Sign in to a synthetic taxpayer account and follow an outstanding demand from confusion to a clear next step.</p></div><div className="public-actions"><Link className="public-button public-button-primary" href="/login">Login<ArrowRight aria-hidden="true" /></Link><a className="public-button public-button-secondary" href="#assistance">How Assistance works</a></div></div></section>
    </main>

    <footer className="public-footer"><div className="public-container"><p>Income Tax citizen assistance prototype</p><p>Synthetic data · Not connected to live Income Tax systems</p></div></footer>
  </div>;
}
