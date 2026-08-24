export type DemandResponseChoice = "demand_correct" | "already_paid" | "disagree";

export type DisagreementReason =
  | "tax_credit_not_considered"
  | "amount_differs"
  | "payment_information_incorrect"
  | "correction_request_filed"
  | "other";

export interface ResponseDraft {
  choice: DemandResponseChoice | "";
  paymentAmount: string;
  paymentDate: string;
  challanReference: string;
  disagreementReason: DisagreementReason | "";
  otherReason: string;
  disputedAmount: string;
}

export interface ResponseSubmissionResult {
  reference: string;
  status: "submitted";
  submittedAt: string;
}
