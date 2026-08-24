import { safeParseAssistanceResponse } from "../../schemas/generative-ui.ts";
import type { AssistanceResponse } from "../../types/generative-ui";
import { createEvidencePacket } from "../reconciliation/evidence-packet.ts";
import type { ReconciliationResult } from "../reconciliation/types.ts";
import { getApprovedWorkflowPlan } from "../rules/approved-workflows.ts";
import { getAssistanceEngine } from "./provider.ts";

export type DemandAssistanceResult =
  | { status: "ready"; response: AssistanceResponse }
  | { status: "unresolved" }
  | { status: "invalid_provider_output" };

export function createDemandAssistance(
  reconciliation: ReconciliationResult,
  provider = "mock",
): DemandAssistanceResult {
  if (reconciliation.status !== "matched") return { status: "unresolved" };

  try {
    const evidence = createEvidencePacket(reconciliation);
    const approvedWorkflowPlan = getApprovedWorkflowPlan(reconciliation.diagnosis);
    const output = getAssistanceEngine(provider).generate({
      intent: "understand_outstanding_demand",
      evidence,
      approvedWorkflowPlan,
    });
    const parsed = safeParseAssistanceResponse(output);

    return parsed.success
      ? { status: "ready", response: parsed.data as AssistanceResponse }
      : { status: "invalid_provider_output" };
  } catch {
    return { status: "invalid_provider_output" };
  }
}
