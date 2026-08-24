import type { AssessmentYear, CurrencyCode } from "./tax";

export const CASE_ID = "CASE-DEMO-18420" as const;
export type CaseState = "PLAN_READY" | "RECTIFICATION_REVIEW" | "RECTIFICATION_SUBMITTED" | "DEMAND_RESPONSE_REVIEW" | "DEMAND_RESPONSE_SUBMITTED" | "WAITING_FOR_REVIEW" | "RESOLVED";
export interface TaxDemandCase {
  version: 1;
  caseId: typeof CASE_ID;
  taxpayerId: string;
  assessmentYear: AssessmentYear;
  demandReference: string;
  demandAmount: number;
  currency: CurrencyCode;
  diagnosis: "payment_missing_from_processed_return";
  state: CaseState;
  rectificationReference?: "RECT-DEMO-01842";
  demandResponseReference?: "DEMAND-RESP-DEMO-18420";
  createdAt: string;
  updatedAt: string;
}
