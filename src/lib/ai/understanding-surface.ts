import type { EvidencePacket } from "../reconciliation/evidence-packet.ts";
import type { UnderstandingDataRef, UnderstandingSurfaceSpecification } from "../../types/generative-ui-v2.ts";

export type UnderstandingBindingValue = number | "confirmed" | "reflected" | "action_required";

export function resolveUnderstandingDataRef(ref: UnderstandingDataRef, evidence: EvidencePacket): UnderstandingBindingValue {
  switch (ref) {
    case "evidence.payment.amount": return evidence.payment.amount;
    case "evidence.payment.status": return evidence.payment.status;
    case "evidence.form26as.amount": return evidence.form26as.amount;
    case "evidence.form26as.status": return evidence.form26as.status;
    case "evidence.processedReturn.recognisedTax": return evidence.processedReturn.selfAssessmentTaxRecognised;
    case "evidence.demand.amount": return evidence.demand.amount;
    case "evidence.demand.status": return evidence.demand.status;
    case "reconciliation.difference": return evidence.discrepancy;
  }
}

export function resolveUnderstandingSurface(specification: UnderstandingSurfaceSpecification, evidence: EvidencePacket) {
  const [comparison, explanation, sourceTrace] = specification.blocks;
  return {
    comparison: {
      variant: comparison.variant,
      items: comparison.items.map((item) => ({
        label: item.label,
        value: resolveUnderstandingDataRef(item.valueRef, evidence),
        status: item.statusRef ? resolveUnderstandingDataRef(item.statusRef, evidence) : undefined,
      })),
      difference: resolveUnderstandingDataRef(comparison.differenceRef, evidence),
    },
    explanation: { factSetRef: explanation.factSetRef },
    sourceTrace: {
      collapsed: sourceTrace.collapsed,
      items: sourceTrace.items.map((item) => ({
        label: item.label,
        value: resolveUnderstandingDataRef(item.valueRef, evidence),
        status: item.statusRef ? resolveUnderstandingDataRef(item.statusRef, evidence) : undefined,
      })),
    },
    primaryAction: specification.primaryAction,
  };
}
