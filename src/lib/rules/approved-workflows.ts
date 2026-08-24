import type { ReconciliationDiagnosis } from "../reconciliation/types.ts";
import type { ApprovedWorkflowAction } from "../../types/generative-ui";

const workflowRules: Partial<Record<ReconciliationDiagnosis, readonly ApprovedWorkflowAction[]>> = {
  payment_missing_from_processed_return: ["tax_credit_rectification", "respond_to_demand"],
};

export function getApprovedWorkflowPlan(diagnosis: ReconciliationDiagnosis): ApprovedWorkflowAction[] {
  return [...(workflowRules[diagnosis] ?? [])];
}
