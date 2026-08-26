"use client";

import Link from "next/link";
import { useTaxDemandCase } from "../../lib/storage/case-storage";
import StatusJourney from "./StatusJourney";

export default function CaseAwareDemandProgress({ fallbackHref, fallbackLabel, horizontal = false }: { fallbackHref: string; fallbackLabel: string; horizontal?: boolean }) {
  const item = useTaxDemandCase();
  const waiting = item?.state === "WAITING_FOR_REVIEW";
  const resolved = item?.state === "RESOLVED";

  return <div className="case-aware-demand-progress">
    <p>{resolved ? "Resolved" : waiting ? "Waiting for Income Tax review" : "What happened"}</p>
    <StatusJourney compact horizontal={horizontal} />
    <Link className="app-action app-action-primary" href={item ? `/case/${item.caseId}` : fallbackHref}>{item ? "View case progress" : fallbackLabel}</Link>
  </div>;
}
