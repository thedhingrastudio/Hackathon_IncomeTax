import { CASE_ID, type CaseState, type TaxDemandCase } from "../../types/case.ts";
import type { EvidencePacket } from "../reconciliation/evidence-packet.ts";
import type { RectificationSubmission, AssistedDemandResponseSubmission } from "./types.ts";

const transitions: Partial<Record<CaseState, CaseState[]>> = {
  PLAN_READY: ["RECTIFICATION_REVIEW"], RECTIFICATION_REVIEW: ["RECTIFICATION_SUBMITTED"],
  RECTIFICATION_SUBMITTED: ["DEMAND_RESPONSE_REVIEW"], DEMAND_RESPONSE_REVIEW: ["DEMAND_RESPONSE_SUBMITTED"],
  DEMAND_RESPONSE_SUBMITTED: ["WAITING_FOR_REVIEW"], WAITING_FOR_REVIEW: ["RESOLVED"],
};
export function createTaxDemandCase(evidence: EvidencePacket, taxpayerId: string, now = new Date().toISOString()): TaxDemandCase {
  return { version: 1, caseId: CASE_ID, taxpayerId, assessmentYear: evidence.assessmentYear, demandReference: evidence.demand.recordId, demandAmount: evidence.demand.amount, currency: evidence.currency, diagnosis: evidence.diagnosis, state: "PLAN_READY", createdAt: now, updatedAt: now };
}
export function transitionCase(current: TaxDemandCase, next: CaseState, now = new Date().toISOString()): TaxDemandCase | null {
  return transitions[current.state]?.includes(next) ? { ...current, state: next, updatedAt: now } : null;
}
export function recordRectification(current: TaxDemandCase, submission: RectificationSubmission): TaxDemandCase | null {
  if (current.rectificationReference) return null;
  const next = transitionCase(current, "RECTIFICATION_SUBMITTED");
  return next ? { ...next, rectificationReference: submission.reference } : null;
}
export function recordDemandResponse(current: TaxDemandCase, submission: AssistedDemandResponseSubmission): TaxDemandCase | null {
  if (!current.rectificationReference || current.demandResponseReference) return null;
  const submitted = transitionCase(current, "DEMAND_RESPONSE_SUBMITTED");
  if (!submitted) return null;
  const waiting = transitionCase({ ...submitted, demandResponseReference: submission.reference }, "WAITING_FOR_REVIEW");
  return waiting;
}
