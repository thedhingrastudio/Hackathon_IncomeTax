import { safeParseActionSurface, safeParseUnderstandingSurface } from "../../schemas/generative-ui-v2.ts";
import type { ActionSurfaceSpecification, UnderstandingSurfaceSpecification } from "../../types/generative-ui-v2.ts";
import { createEvidencePacket, reconcileTaxCase } from "../reconciliation/index.ts";
import type { EvidencePacket } from "../reconciliation/evidence-packet.ts";
import type { ReconciliationInput } from "../reconciliation/types.ts";
import type { AssistedWorkflowContext } from "../workflows";
import { getApprovedWorkflowPlan } from "../rules/approved-workflows.ts";
import { getAssistanceEngine } from "./provider.ts";

export type DemandUnderstanding = {
  evidence: EvidencePacket;
  workflowContext: AssistedWorkflowContext;
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
    const approvedWorkflowPlan = [...getApprovedWorkflowPlan(reconciliation.diagnosis)];
    const workflowContext: AssistedWorkflowContext = {
      evidence,
      approvedWorkflowPlan,
      records: {
        taxReturn: records.taxReturn!,
        payment: records.payment!,
        form26as: records.form26as!,
        processingResult: records.processingResult!,
        outstandingDemand: records.outstandingDemand!,
      },
    };
    return parsed.success && actionParsed.success ? { evidence, workflowContext, specification: parsed.data as UnderstandingSurfaceSpecification, actionSpecification: actionParsed.data as ActionSurfaceSpecification } : null;
  } catch {
    return null;
  }
}
