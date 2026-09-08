"use client";

import Link from "next/link";
import { ArrowRight, Check, Clock3, FileCheck2, ShieldCheck } from "lucide-react";
import { formatAssessmentYear, formatIndianCurrency } from "../../lib/format-tax";
import { useTaxDemandCase } from "../../lib/storage/case-storage";
import StatusJourney from "./StatusJourney";

export default function CaseTracker({ caseId }: { caseId: string }) {
  const item = useTaxDemandCase();
  if (!item) return <div className="portal-alert portal-alert--info"><div><h1>Case not found</h1><p>Start from the outstanding demand to create this case.</p><Link className="app-action app-action-primary" href="/pending-actions/demand">View demand</Link></div></div>;
  if (item.caseId !== caseId) return null;
  const resolved = item.state === "RESOLVED";
  return <div className="case-tracker civic-case-tracker">
    <header className="civic-case-hero">
      <div><p>Case {item.caseId}</p><h1>Outstanding Demand case</h1><span>{formatIndianCurrency(item.demandAmount, item.currency)} · AY {formatAssessmentYear(item.assessmentYear)}</span></div>
      <div className={`civic-case-status ${resolved ? "is-resolved" : "is-waiting"}`} role="status"><span aria-hidden="true">{resolved ? <Check /> : <Clock3 />}</span><div><small>Current status</small><strong>{resolved ? "Resolved" : "Waiting for Income Tax review"}</strong></div></div>
    </header>
    <section className="civic-case-summary" aria-label="What you need to do"><ShieldCheck aria-hidden="true" /><div><strong>{resolved ? "This case is complete" : "Nothing you need to do right now"}</strong><p>{resolved ? "Income Tax has completed its review." : "Your correction and demand response are submitted. Income Tax now needs to review them."}</p></div></section>
    <div className="civic-case-layout">
      <section className="civic-case-progress" aria-labelledby="case-progress-title"><header><p>Case progress</p><h2 id="case-progress-title">From payment to resolution</h2></header><StatusJourney lifecycle /></section>
      <aside className="civic-case-details" aria-labelledby="submitted-requests-title"><header><FileCheck2 aria-hidden="true" /><h2 id="submitted-requests-title">Submitted requests</h2></header><dl><div><dt>Tax-credit correction</dt><dd><strong>{item.rectificationReference}</strong><span><Check aria-hidden="true" />Submitted</span></dd></div><div><dt>Demand response</dt><dd><strong>{item.demandResponseReference}</strong><span><Check aria-hidden="true" />Submitted</span></dd></div></dl></aside>
    </div>
    <section className="civic-case-explanation"><div><p>Why this case was created</p><h2>Your payment was found, but the processed return recognised ₹0.</h2><span>That mismatch created an outstanding demand for the same amount.</span></div><Link href="/pending-actions/demand/workspace">Review the evidence <ArrowRight aria-hidden="true" /></Link></section>
    <section className="civic-case-next"><p>What happens next</p><h2>Income Tax reviews both linked requests.</h2><span>If the correction is accepted, the processed tax credit and outstanding demand can be updated.</span></section>
  </div>;
}
