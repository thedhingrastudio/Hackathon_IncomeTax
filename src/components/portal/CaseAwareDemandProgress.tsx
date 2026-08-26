"use client";

import Link from "next/link";
import { useTaxDemandCase } from "../../lib/storage/case-storage";
import StatusJourney from "./StatusJourney";

export default function CaseAwareDemandProgress({ fallbackHref, fallbackLabel, horizontal = false, waitingCompact = false }: { fallbackHref: string; fallbackLabel: string; horizontal?: boolean; waitingCompact?: boolean }) {
  const item = useTaxDemandCase();
  const waiting = item?.state === "WAITING_FOR_REVIEW" && Boolean(item.rectificationReference && item.demandResponseReference);
  const resolved = item?.state === "RESOLVED";

  if (waiting && item.rectificationReference && item.demandResponseReference) return <div className={`case-aware-demand-progress case-waiting-status${waitingCompact ? "" : " case-waiting-status--dashboard"}`} role="status">
    {waitingCompact ? <p><strong>Nothing you need to do right now.</strong></p> : <><p className="eyebrow">Waiting for review</p><h3>Income Tax is reviewing your case</h3><p>Your correction and demand response have been submitted. Nothing else is needed from you right now.</p></>}
    <dl className="case-waiting-references"><div><dt>{waitingCompact ? "Correction submitted" : "Correction"}</dt><dd>{item.rectificationReference}</dd></div><div><dt>{waitingCompact ? "Demand response submitted" : "Demand response"}</dt><dd>{item.demandResponseReference}</dd></div></dl>
    <Link className="app-action app-action-primary" href={`/case/${item.caseId}`}>View case progress</Link>
  </div>;

  return <div className="case-aware-demand-progress">
    <p>{resolved ? "Resolved" : waiting ? "Waiting for Income Tax review" : "What happened"}</p>
    <StatusJourney compact horizontal={horizontal} />
    <Link className="app-action app-action-primary" href={item ? `/case/${item.caseId}` : fallbackHref}>{item ? "View case progress" : fallbackLabel}</Link>
  </div>;
}
