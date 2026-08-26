"use client";

import { useTaxDemandCase } from "../../lib/storage/case-storage";
import type { OutstandingDemand } from "../../types/tax";
import { formatAssessmentYear, formatIndianCurrency, formatIndianDate } from "../../lib/format-tax";
import CaseAwareDemandProgress from "./CaseAwareDemandProgress";
import CaseStateLabel from "./CaseStateLabel";
import RecordDetails from "./RecordDetails";

function isWaitingForReview(item: ReturnType<typeof useTaxDemandCase>) {
  return item?.state === "WAITING_FOR_REVIEW" && Boolean(item.rectificationReference && item.demandResponseReference);
}

export function DashboardDemandCardContent({ demand }: { demand: OutstandingDemand }) {
  const item = useTaxDemandCase();
  const waiting = isWaitingForReview(item);
  const assessmentYear = formatAssessmentYear(demand.assessmentYear);

  return <>
    <p className="dashboard-section-label" id="attention-title">{waiting ? "Case status" : "Needs your attention"}</p>
    <div className="tax-account-demand-main"><p>Outstanding demand</p><strong>{formatIndianCurrency(demand.amount, demand.currency)}</strong><span>{waiting ? "Under review" : "Response pending"} <span aria-hidden="true">·</span> AY {assessmentYear}</span></div>
    <div className="tax-account-demand-action"><CaseAwareDemandProgress fallbackHref="/pending-actions/demand" fallbackLabel="Review outstanding demand" /></div>
    <p className="tax-account-demand-reference"><span>Demand reference</span><strong>{demand.demandId}</strong></p>
  </>;
}

export function PendingDemandCard({ demand }: { demand: OutstandingDemand }) {
  const item = useTaxDemandCase();
  const waiting = isWaitingForReview(item);

  return <section className="portal-surface demand-card" aria-labelledby="pending-demand-title">
    <div className="portal-surface__header demand-card__header">{waiting ? <div><p className="eyebrow">Waiting for review</p><h2 id="pending-demand-title">Waiting for Income Tax review</h2><p>You&apos;ve completed the required steps. Income Tax is reviewing your correction and demand response.</p><p>Outstanding demand · {formatIndianCurrency(demand.amount, demand.currency)}</p></div> : <><div><p className="eyebrow">Outstanding Demand</p><h2 id="pending-demand-title">{formatIndianCurrency(demand.amount, demand.currency)}</h2></div><CaseStateLabel /></>}</div>
    <div className="portal-surface__body demand-card__body"><RecordDetails details={[{ label: "Assessment Year", value: formatAssessmentYear(demand.assessmentYear) }, { label: "Created on", value: formatIndianDate(demand.createdOn) }, waiting ? { label: "Status", value: "Waiting for Income Tax review" } : { label: "Next step", value: "Review and respond" }]} /></div>
    <div className="demand-card__progress"><CaseAwareDemandProgress fallbackHref="/pending-actions/demand" fallbackLabel="Review demand" horizontal waitingCompact /></div>
  </section>;
}
