"use client";

import { useTaxDemandCase } from "../../lib/storage/case-storage";

function getState(state?: string) {
  if (state === "RESOLVED") return { label: "Resolved", detail: "No action needed", tone: "complete" };
  if (state === "WAITING_FOR_REVIEW") return { label: "Waiting for Income Tax review", detail: "Your actions are complete", tone: "waiting" };
  if (["DEMAND_RESPONSE_SUBMITTED"].includes(state ?? "")) return { label: "Response submitted", detail: "Waiting for review", tone: "waiting" };
  if (["RECTIFICATION_SUBMITTED", "DEMAND_RESPONSE_REVIEW"].includes(state ?? "")) return { label: "Demand response required", detail: "Correction submitted", tone: "action" };
  return { label: "Your response is required", detail: "Tax credit needs correction", tone: "action" };
}

export default function CaseStateLabel({ compact = false }: { compact?: boolean }) {
  const item = useTaxDemandCase();
  const current = getState(item?.state);
  return <span className={`case-state-label case-state-label--${current.tone}${compact ? " case-state-label--compact" : ""}`}><strong>{current.label}</strong><small>{current.detail}</small></span>;
}
