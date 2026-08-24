import type { EvidencePacket } from "../reconciliation";
import type { AssistanceIntent, ApprovedWorkflowAction } from "../../types/generative-ui";

export interface AssistanceEngineInput {
  intent: AssistanceIntent;
  evidence: EvidencePacket;
  approvedWorkflowPlan: readonly ApprovedWorkflowAction[];
}

export interface AssistanceEngine {
  generate(input: AssistanceEngineInput): unknown;
}

export type AssistanceProvider = "mock";
