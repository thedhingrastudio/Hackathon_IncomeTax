import type { EvidencePacket } from "../reconciliation/evidence-packet.ts";
import type { ApprovedWorkflowAction } from "../../types/generative-ui.ts";
import type { ReconciliationInput } from "../reconciliation/types.ts";
import type {
  AssistedDemandResponseDraft,
  AssistedDemandResponseSubmission,
  RectificationDraft,
  RectificationSubmission,
  WorkflowResult,
  WorkflowValidationError,
} from "./types.ts";

export interface AssistedWorkflowContext {
  evidence: EvidencePacket;
  records: { [Key in keyof ReconciliationInput]-?: NonNullable<ReconciliationInput[Key]> };
  approvedWorkflowPlan: ApprovedWorkflowAction[];
}

export function prepareRectificationDraft(context: AssistedWorkflowContext): WorkflowResult<RectificationDraft> {
  const { evidence, records, approvedWorkflowPlan } = context;
  const errors: WorkflowValidationError[] = [];
  if (approvedWorkflowPlan[0] !== "tax_credit_rectification") errors.push("unsupported_workflow");
  const taxpayerIds = [records.taxReturn.taxpayerId, records.payment.taxpayerId, records.form26as.taxpayerId, records.processingResult.taxpayerId, records.outstandingDemand.taxpayerId];
  if (!taxpayerIds.every((id) => id === records.payment.taxpayerId)) errors.push("taxpayer_mismatch");
  const years = [records.taxReturn.assessmentYear, records.payment.assessmentYear, records.form26as.assessmentYear, records.processingResult.assessmentYear, records.outstandingDemand.assessmentYear];
  if (!years.every((year) => year === evidence.assessmentYear)) errors.push("assessment_year_mismatch");
  if (records.payment.status !== "confirmed") errors.push("payment_not_confirmed");
  if (records.payment.amount !== evidence.payment.amount) errors.push("payment_amount_mismatch");
  if (!records.payment.challanReference.trim()) errors.push("challan_missing");
  const formEntry = records.form26as.entries.find((entry) => entry.challanReference === records.payment.challanReference);
  if (!formEntry || formEntry.status !== "reflected" || formEntry.amount !== evidence.payment.amount) errors.push("form26as_not_reflected");
  if (records.processingResult.selfAssessmentTaxRecognised !== 0) errors.push("processed_amount_not_zero");
  if (errors.length) return { success: false, errors: [...new Set(errors)] };
  return { success: true, data: {
    taxpayerId: records.payment.taxpayerId,
    assessmentYear: evidence.assessmentYear,
    amount: evidence.payment.amount,
    currency: evidence.currency,
    paymentDate: evidence.payment.date,
    challanReference: evidence.payment.challanReference,
    paymentStatus: "confirmed",
    form26asAmount: evidence.form26as.amount,
    processedRecognisedAmount: evidence.processedReturn.selfAssessmentTaxRecognised,
    correctionType: "tax_credit_mismatch_correction",
    reason: "self_assessment_tax_missing_from_processed_return",
  } };
}

export function validateRectificationDraft(draft: RectificationDraft, evidence: EvidencePacket, existingSubmission?: RectificationSubmission | null): WorkflowResult<RectificationDraft> {
  const errors: WorkflowValidationError[] = [];
  if (existingSubmission) errors.push("rectification_already_submitted");
  if (draft.assessmentYear !== evidence.assessmentYear) errors.push("assessment_year_mismatch");
  if (draft.paymentStatus !== "confirmed") errors.push("payment_not_confirmed");
  if (draft.amount !== evidence.payment.amount) errors.push("payment_amount_mismatch");
  if (!draft.challanReference.trim()) errors.push("challan_missing");
  if (draft.form26asAmount !== draft.amount) errors.push("form26as_not_reflected");
  if (draft.processedRecognisedAmount !== 0) errors.push("processed_amount_not_zero");
  return errors.length ? { success: false, errors } : { success: true, data: draft };
}

export function submitRectification(draft: RectificationDraft, evidence: EvidencePacket, existingSubmission?: RectificationSubmission | null): WorkflowResult<RectificationSubmission> {
  const validation = validateRectificationDraft(draft, evidence, existingSubmission);
  if ("errors" in validation) return { success: false, errors: validation.errors };
  return { success: true, data: { reference: "RECT-DEMO-01842", status: "submitted", assessmentYear: draft.assessmentYear, amount: draft.amount, correction: "tax_credit_mismatch" } };
}

export function prepareAssistedDemandResponse(context: AssistedWorkflowContext, rectification?: RectificationSubmission | null): WorkflowResult<AssistedDemandResponseDraft> {
  if (!rectification || rectification.status !== "submitted") return { success: false, errors: ["rectification_required"] };
  if (context.approvedWorkflowPlan[1] !== "respond_to_demand") return { success: false, errors: ["unsupported_workflow"] };
  if (context.evidence.demand.amount !== rectification.amount) return { success: false, errors: ["demand_amount_mismatch"] };
  return { success: true, data: {
    taxpayerId: context.records.outstandingDemand.taxpayerId,
    assessmentYear: context.evidence.assessmentYear,
    demandAmount: context.evidence.demand.amount,
    currency: context.evidence.currency,
    response: "disagree",
    reason: "tax_credit_not_considered",
    disputedAmount: context.evidence.demand.amount,
    rectificationReference: rectification.reference,
  } };
}

export function validateAssistedDemandResponse(draft: AssistedDemandResponseDraft, rectification?: RectificationSubmission | null): WorkflowResult<AssistedDemandResponseDraft> {
  const errors: WorkflowValidationError[] = [];
  if (!rectification || draft.rectificationReference !== rectification.reference) errors.push("rectification_required");
  if (draft.disputedAmount !== draft.demandAmount) errors.push("demand_amount_mismatch");
  return errors.length ? { success: false, errors } : { success: true, data: draft };
}

export function submitAssistedDemandResponse(draft: AssistedDemandResponseDraft, rectification?: RectificationSubmission | null): WorkflowResult<AssistedDemandResponseSubmission> {
  const validation = validateAssistedDemandResponse(draft, rectification);
  if ("errors" in validation) return { success: false, errors: validation.errors };
  return { success: true, data: { reference: "DEMAND-RESP-DEMO-18420", status: "submitted", assessmentYear: draft.assessmentYear, rectificationReference: draft.rectificationReference } };
}
