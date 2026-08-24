import { safeParseActionSurface, safeParseUnderstandingSurface } from "../../schemas/generative-ui-v2.ts";
import type { ActionSurfaceSpecification, UnderstandingSurfaceSpecification } from "../../types/generative-ui-v2.ts";
import { createEvidencePacket, reconcileTaxCase } from "../reconciliation/index.ts";
import type { EvidencePacket } from "../reconciliation/evidence-packet.ts";
import type { ReconciliationInput } from "../reconciliation/types.ts";
import { getApprovedWorkflowPlan } from "../rules/approved-workflows.ts";
import { getAssistanceEngine } from "./provider.ts";

export type DemandUnderstanding = {
  evidence: EvidencePacket;
  specification: UnderstandingSurfaceSpecification;
  actionSpecification: ActionSurfaceSpecification;
};

export function createDemandUnderstanding(records: ReconciliationInput, provider = "mock"): DemandUnderstanding | null {
  const reconciliation = reconcileTaxCase(records);
  if (reconciliation.status !== "matched") return null;

  try {
    const evidence = createEvidencePacket(reconciliation);
    const output = getAssistanceEngine(provider).generateUnderstandingSurface({
      intent: "understand_outstanding_demand",
      evidence,
      approvedWorkflowPlan: getApprovedWorkflowPlan(reconciliation.diagnosis),
    });
    const parsed = safeParseUnderstandingSurface(output);
    const actionParsed = safeParseActionSurface(getAssistanceEngine(provider).generateActionSurface({ intent: "understand_outstanding_demand", evidence, approvedWorkflowPlan: getApprovedWorkflowPlan(reconciliation.diagnosis) }));
    return parsed.success && actionParsed.success ? { evidence, specification: parsed.data as UnderstandingSurfaceSpecification, actionSpecification: actionParsed.data as ActionSurfaceSpecification } : null;
  } catch {
    return null;
  }
}
