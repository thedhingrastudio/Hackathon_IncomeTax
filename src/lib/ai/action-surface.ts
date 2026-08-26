import type { EvidencePacket } from "../reconciliation/evidence-packet.ts";
import type { ActionDataRef, ActionSurfaceSpecification } from "../../types/generative-ui-v2.ts";

export function resolveActionDataRef(ref: ActionDataRef, evidence: EvidencePacket): number | string | boolean {
  switch (ref) {
    case "evidence.payment.amount": return evidence.payment.amount;
    case "evidence.payment.date": return evidence.payment.date;
    case "evidence.payment.type": return "Self-Assessment Tax";
    case "workflow.tax_credit_rectification.ready": return evidence.payment.status === "confirmed" && evidence.form26as.status === "reflected";
    case "workflow.respond_to_demand.dependency": return "Starts after Step 1";
  }
}

export function resolveActionSurface(specification: ActionSurfaceSpecification, evidence: EvidencePacket) {
  const [checklist, actionPlan] = specification.blocks; const item = checklist.items[0];
  return { checklist: { label: item.label, amount: resolveActionDataRef(item.amountRef, evidence), date: resolveActionDataRef(item.dateRef, evidence), paymentType: resolveActionDataRef(item.typeRef, evidence), ready: resolveActionDataRef(item.readinessRef, evidence) }, dependency: resolveActionDataRef(actionPlan.steps[1].dependencyRef, evidence), actionPlan, primaryAction: specification.primaryAction };
}
