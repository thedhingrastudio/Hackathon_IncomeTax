import AssistedCorrectiveWorkflow from "../../../../../components/portal/AssistedCorrectiveWorkflow";
import { getForm26AS, getOutstandingDemand, getProcessingResult, getTaxPayment, getTaxReturn } from "../../../../../data/mock";
import { createEvidencePacket, reconcileTaxCase } from "../../../../../lib/reconciliation";
import { getApprovedWorkflowPlan } from "../../../../../lib/rules";
import { prepareRectificationDraft } from "../../../../../lib/workflows";

export default function AssistedRectificationPage() {
  const records = { taxReturn: getTaxReturn(), payment: getTaxPayment(), form26as: getForm26AS(), processingResult: getProcessingResult(), outstandingDemand: getOutstandingDemand() };
  const reconciliation = reconcileTaxCase(records);
  if (reconciliation.status !== "matched") return null;
  const context = { evidence: createEvidencePacket(reconciliation), records, approvedWorkflowPlan: getApprovedWorkflowPlan(reconciliation.diagnosis) };
  return <AssistedCorrectiveWorkflow context={context} preparedRectification={prepareRectificationDraft(context)} />;
}
