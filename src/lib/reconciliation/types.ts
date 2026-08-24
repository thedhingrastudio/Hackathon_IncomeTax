import type {
  AssessmentYear,
  CurrencyCode,
  Form26ASRecord,
  Form26ASStatus,
  OutstandingDemand,
  PaymentStatus,
  ProcessingResult,
  TaxPayment,
  TaxReturn,
} from "../../types/tax";

export type ReconciliationDiagnosis =
  | "payment_missing_from_processed_return"
  | "undetermined";

export type ReconciliationStatus = "matched" | "unresolved";

export type ReconciliationRuleCode =
  "confirmed_self_assessment_payment_missing_from_processed_return";

export type ReconciliationFailureReason =
  | "missing_tax_return"
  | "missing_payment"
  | "missing_form26as"
  | "missing_processing_result"
  | "missing_outstanding_demand"
  | "assessment_year_mismatch"
  | "taxpayer_reference_mismatch"
  | "return_reference_mismatch"
  | "processing_reference_mismatch"
  | "currency_mismatch"
  | "payment_not_confirmed"
  | "payment_not_self_assessment_tax"
  | "form26as_payment_not_found"
  | "form26as_payment_not_reflected"
  | "form26as_amount_mismatch"
  | "processed_amount_not_zero"
  | "demand_not_action_required"
  | "demand_amount_mismatch";

export interface ReconciliationInput {
  taxReturn?: Readonly<TaxReturn> | null;
  payment?: Readonly<TaxPayment> | null;
  form26as?: Readonly<Form26ASRecord> | null;
  processingResult?: Readonly<ProcessingResult> | null;
  outstandingDemand?: Readonly<OutstandingDemand> | null;
}

export interface PaymentEvidence {
  paymentId: string;
  taxpayerId: string;
  assessmentYear: AssessmentYear;
  paymentType: TaxPayment["paymentType"];
  amount: number;
  currency: CurrencyCode;
  paymentDate: string;
  challanReference: string;
  status: PaymentStatus;
}

export interface Form26ASEvidence {
  recordId: string;
  entryId?: string;
  taxpayerId: string;
  assessmentYear: AssessmentYear;
  amount?: number;
  currency?: CurrencyCode;
  paymentDate?: string;
  challanReference?: string;
  status?: Form26ASStatus;
}

export interface TaxReturnEvidence {
  returnId: string;
  taxpayerId: string;
  assessmentYear: AssessmentYear;
  selfAssessmentTaxClaimed: number;
  currency: CurrencyCode;
}

export interface ProcessingEvidence {
  processingId: string;
  returnId: string;
  taxpayerId: string;
  assessmentYear: AssessmentYear;
  selfAssessmentTaxRecognised: number;
  currency: CurrencyCode;
}

export interface DemandEvidence {
  demandId: string;
  processingId: string;
  taxpayerId: string;
  assessmentYear: AssessmentYear;
  amount: number;
  currency: CurrencyCode;
  status: OutstandingDemand["status"];
}

export interface ReconciliationEvidence {
  taxReturn?: TaxReturnEvidence;
  payment?: PaymentEvidence;
  form26as?: Form26ASEvidence;
  processedReturn?: ProcessingEvidence;
  demand?: DemandEvidence;
}

export interface MatchedReconciliationResult {
  status: "matched";
  diagnosis: "payment_missing_from_processed_return";
  ruleCode: ReconciliationRuleCode;
  assessmentYear: AssessmentYear;
  paymentAmount: number;
  processedRecognisedAmount: number;
  difference: number;
  demandAmount: number;
  currency: CurrencyCode;
  evidence: Required<ReconciliationEvidence>;
}

export interface UnresolvedReconciliationResult {
  status: "unresolved";
  diagnosis: "undetermined";
  ruleCode: null;
  failureReasons: ReconciliationFailureReason[];
  evidence: ReconciliationEvidence;
}

export type ReconciliationResult =
  | MatchedReconciliationResult
  | UnresolvedReconciliationResult;
