"use client";

import Link from "next/link";
import { formatAssessmentYear, formatIndianCurrency } from "../../lib/format-tax";
import { useTaxDemandCase } from "../../lib/storage/case-storage";
import StatusJourney from "./StatusJourney";

export default function CaseTracker({ caseId }: { caseId: string }) {
  const item = useTaxDemandCase();
  if (!item) return <div className="portal-alert portal-alert--info"><div><h1>Case not found</h1><p>Start from the outstanding demand to create this case.</p><Link className="app-action app-action-primary" href="/pending-actions/demand">View demand</Link></div></div>;
  if (item.caseId !== caseId) return null;
  return <div className="case-tracker"><header className="page-heading"><p className="eyebrow">Case {item.caseId}</p><h1>Outstanding Demand case</h1><p>{formatIndianCurrency(item.demandAmount, item.currency)} · AY {formatAssessmentYear(item.assessmentYear)}</p><p className="case-status" role="status"><strong>{item.state === "RESOLVED" ? "Resolved" : "Waiting for Income Tax review"}</strong></p><p>{item.state === "RESOLVED" ? "This case is complete." : "You have completed the required actions. Income Tax now needs to review the correction and demand response."}</p></header><section aria-labelledby="case-progress-title"><h2 id="case-progress-title">Case progress</h2><StatusJourney lifecycle /></section><section className="portal-surface"><div className="portal-surface__header"><h2>Submitted requests</h2></div><div className="portal-surface__body"><dl className="review-list"><div><dt>Tax credit correction</dt><dd>{item.rectificationReference}<br />Submitted</dd></div><div><dt>Demand response</dt><dd>{item.demandResponseReference}<br />Submitted</dd></div></dl></div></section><section><h2>Why this case was created</h2><p>You paid {formatIndianCurrency(item.demandAmount, item.currency)}, but the processed return recognised ₹0.</p><Link className="portal-tertiary-link" href="/pending-actions/demand/assist">View evidence</Link></section><div className="portal-alert portal-alert--info"><div><h2>What you need to do</h2><p><strong>Nothing right now.</strong></p><p>Income Tax needs to review the submitted correction and demand response.</p></div></div><section><h2>What happens next</h2><p>If the correction is accepted, the processed tax credit and outstanding demand can be updated.</p></section></div>;
}
