import type { AssessmentYear, CurrencyCode } from "../../types/tax";

export type AssistedWorkflowState =
  | "plan_ready"
  | "rectification_review"
  | "rectification_submitted"
  | "demand_response_review"
  | "demand_response_submitted";

export interface RectificationDraft {
  taxpayerId: string;
  assessmentYear: AssessmentYear;
  amount: number;
  currency: CurrencyCode;
  paymentDate: string;
  challanReference: string;
  paymentStatus: "confirmed";
  form26asAmount: number;
  processedRecognisedAmount: number;
  correctionType: "tax_credit_mismatch_correction";
  reason: "self_assessment_tax_missing_from_processed_return";
}

export interface RectificationSubmission {
  reference: "RECT-DEMO-01842";
  status: "submitted";
  assessmentYear: AssessmentYear;
  amount: number;
  correction: "tax_credit_mismatch";
}

export interface AssistedDemandResponseDraft {
  taxpayerId: string;
  assessmentYear: AssessmentYear;
  demandAmount: number;
  currency: CurrencyCode;
  response: "disagree";
  reason: "tax_credit_not_considered";
  disputedAmount: number;
  rectificationReference: RectificationSubmission["reference"];
}

export interface AssistedDemandResponseSubmission {
  reference: "DEMAND-RESP-DEMO-18420";
  status: "submitted";
  assessmentYear: AssessmentYear;
  rectificationReference: RectificationSubmission["reference"];
}

export type WorkflowValidationError =
  | "unsupported_workflow"
  | "taxpayer_mismatch"
  | "assessment_year_mismatch"
  | "payment_not_confirmed"
  | "payment_amount_mismatch"
  | "challan_missing"
  | "form26as_not_reflected"
  | "processed_amount_not_zero"
  | "rectification_already_submitted"
  | "rectification_required"
  | "demand_amount_mismatch";

export type WorkflowResult<T> =
  | { success: true; data: T }
  | { success: false; errors: WorkflowValidationError[] };
