import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Layers3, ScanSearch, ShieldCheck } from "lucide-react";
import { DitherGradient } from "../components/dither-kit/gradient";

export default function LandingPage() {
  return (
    <div className="revised-public-site">
      <header className="revised-public-header">
        <div className="revised-public-rail">
          <Link className="revised-wordmark" href="/" aria-label="Civic Interface home">
            <span className="revised-wordmark-mark" aria-hidden="true"><Layers3 /></span>
            <span>CIVIC INTERFACE</span>
          </Link>
          <nav aria-label="Landing page">
            <a href="#principle">Principle</a>
            <a href="#adaptive-portal">Adaptive portal</a>
            <Link className="revised-header-login" href="/login">Open prototype</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="revised-hero">
          <DitherGradient bloom="aura" cell={3} className="revised-hero-wash" direction="up" from="purple" opacity={0.72} to="blue" />
          <div className="revised-public-rail revised-hero-content">
            <p className="revised-kicker"><span>01</span> A generative layer for public services</p>
            <h1>Government services,<br />shaped around <em>your situation.</em></h1>
            <p className="revised-hero-deck">Citizens begin with the outcome they need. The portal understands their intent, brings forward the right services and records, and generates the clearest path to completion.</p>
            <div className="revised-hero-actions">
              <Link className="revised-primary-link" href="/login">Open the prototype <ArrowRight aria-hidden="true" /></Link>
              <a href="#principle">See how it works <ArrowUpRight aria-hidden="true" /></a>
            </div>

            <div className="revised-system-preview revised-adaptive-preview" aria-label="How a portal is generated around a citizen's need">
              <div className="revised-preview-topline">
                <span>Generative service layer</span>
                <span>Portal state: ready to adapt</span>
              </div>
              <div className="revised-adaptive-question">
                <p>Start with your outcome</p>
                <h2>What do you need to get done?</h2>
                <p>Describe it in your own words. The portal will bring together the right information, explanation, and next action.</p>
                <div className="revised-example-needs" aria-label="Example citizen needs">
                  <span>Renew a document</span>
                  <span>Track an application</span>
                  <span>Understand a notice</span>
                </div>
              </div>
              <div className="revised-assembly-line">
                <article><span>01</span><div><strong>Understands your need</strong><p>No department or form names required.</p></div></article>
                <article><span>02</span><div><strong>Finds the right context</strong><p>Only relevant records and rules are brought forward.</p></div></article>
                <article><span>03</span><div><strong>Builds your interface</strong><p>The clearest explanation and action appear next.</p></div></article>
              </div>
              <div className="revised-generated-result"><span>Result</span><strong>A portal organised around your goal—not the government&apos;s internal structure.</strong></div>
            </div>
          </div>
        </section>

        <section className="revised-principle" id="principle">
          <div className="revised-public-rail">
            <div className="revised-section-intro">
              <p className="revised-kicker"><span>02</span> The interface is a function of the need</p>
              <h2>One service layer.<br />A different interface for every need.</h2>
              <p>Instead of forcing every citizen through the same portal, the system chooses the representation that best explains the current decision.</p>
            </div>
            <div className="revised-principle-grid">
              <article><span>01</span><h3>State the situation</h3><p>Start with the citizen&apos;s words—not a department, form number, or menu.</p></article>
              <article><span>02</span><h3>Reconcile records</h3><p>Deterministic checks compare authoritative records before any explanation is generated.</p></article>
              <article><span>03</span><h3>Generate the right view</h3><p>A comparison, guided workflow, review, or timeline appears only when it becomes useful.</p></article>
            </div>
          </div>
        </section>

        <section className="revised-demonstration" id="adaptive-portal">
          <DitherGradient cell={4} direction="right" from="blue" opacity={0.32} />
          <div className="revised-public-rail revised-demo-grid">
            <div><p className="revised-kicker revised-kicker-light"><span>03</span> One portal, assembled around you</p><h2>The service adapts to the citizen—not the citizen to the service.</h2><p>Every screen is generated for the decision in front of you. Detail appears progressively, actions stay understandable, and consequential choices remain yours.</p><Link className="revised-primary-link" href="/login">Explore the working prototype <ArrowRight aria-hidden="true" /></Link></div>
            <ul>
              <li><ShieldCheck aria-hidden="true" /><span><strong>Trusted by design</strong>Official records remain authoritative.</span></li>
              <li><ScanSearch aria-hidden="true" /><span><strong>Relevant by default</strong>Only what helps the current task appears.</span></li>
              <li><Check aria-hidden="true" /><span><strong>Citizen-controlled</strong>Nothing consequential happens without review.</span></li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="revised-public-footer"><div className="revised-public-rail"><p>Civic Interface</p><p>Generative public services · Working prototype</p></div></footer>
    </div>
  );
}
