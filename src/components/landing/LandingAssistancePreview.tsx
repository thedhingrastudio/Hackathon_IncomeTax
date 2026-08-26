import { Check, ChevronDown, Circle, FileCheck2, Landmark, ReceiptText, SearchCheck, UserRound } from "lucide-react";

const records = [
  { icon: ReceiptText, label: "Payment", value: "₹18,420", status: "Confirmed" },
  { icon: FileCheck2, label: "Form 26AS", value: "₹18,420", status: "Reflected" },
  { icon: FileCheck2, label: "Processed return", value: "₹0", status: "recognised" },
  { icon: SearchCheck, label: "Outstanding demand", value: "₹18,420", status: "" },
] as const;

const progress = [
  ["Payment found", "complete"], ["Problem identified", "complete"], ["Correction submitted", "complete"],
  ["Demand response submitted", "complete"], ["Income Tax review", "current"], ["Resolved", "pending"],
] as const;

function Connector() {
  return <div aria-hidden="true" className="stage-connector"><ChevronDown /></div>;
}

export default function LandingAssistancePreview() {
  return <>
    <div className="intent-outcome-canvas intent-four-stage" aria-label="From citizen situation to Income Tax review">
      <section className="journey-stage journey-situation">
        <header><span className="actor-icon"><UserRound aria-hidden="true" /></span><p className="intent-stage-label">Your situation</p></header>
        <blockquote>“I already paid ₹18,420.<br />Why is there still a demand?”</blockquote>
        <p>Start with your situation.</p>
      </section>

      <Connector />

      <section className="journey-stage journey-finding">
        <header><span className="actor-icon"><SearchCheck aria-hidden="true" /></span><div><p className="intent-stage-label">What Assistance found</p><h3>Your payment was found.</h3></div></header>
        <div className="journey-records">{records.map(({ icon: Icon, label, value, status }) => <article key={label}><Icon aria-hidden="true" /><span><small>{label}</small><strong>{value}</strong>{status ? <em>{status}</em> : null}</span></article>)}</div>
        <strong className="journey-mismatch">₹18,420 wasn&apos;t counted in the processed return.</strong>
        <p>Your payment exists in Income Tax records, but it was not included when your return was processed.</p>
      </section>

      <Connector />

      <section className="journey-stage journey-next">
        <header><span className="actor-icon"><FileCheck2 aria-hidden="true" /></span><div><p className="intent-stage-label">What happens next</p><h3>Two next steps are prepared for you.</h3></div></header>
        <ol><li><span>01</span><div><strong>Correct your tax credit</strong><small>Tax Credit Mismatch Correction</small></div></li><li><span>02</span><div><strong>Respond to the outstanding demand</strong></div></li></ol>
        <p>Assistance prepares the right next steps for you to review.</p>
        <strong className="journey-control">Nothing is submitted automatically.</strong>
      </section>

      <Connector />

      <section className="journey-stage journey-review">
        <header><span className="actor-icon"><Landmark aria-hidden="true" /></span><div><p className="intent-stage-label">After you confirm</p><h3>Income Tax reviews submitted requests</h3></div></header>
        <ol>{progress.map(([label, state]) => <li className={`is-${state}`} key={label}>{state === "complete" ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}<span>{label}</span></li>)}</ol>
        <div><strong>Waiting for Income Tax review</strong><span>Nothing you need to do right now.</span></div>
      </section>
    </div>
    <footer className="intent-outcome-closing"><strong>Start with what you need.<br />We&apos;ll guide the next steps.</strong><p>You stay in control before anything is submitted.</p></footer>
  </>;
}
