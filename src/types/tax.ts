export type CurrencyCode = "INR";
export type AssessmentYear = `${number}-${number}`;
export type PaymentType = "self_assessment_tax";
export type PaymentStatus = "confirmed" | "pending" | "failed";
export type FilingStatus = "processed";
export type ProcessingStatus = "processed";
export type Form26ASStatus = "reflected" | "not_reflected";
export type DemandStatus = "action_required";

interface SyntheticRecord {
  prototypeData: true;
}

export interface Taxpayer extends SyntheticRecord {
  taxpayerId: string;
  name: string;
  pan: string;
  panMasked: string;
  accountType: "individual";
  profileStatus: "up_to_date";
  lastSignIn: string;
  preferredLanguage: "en";
}

export interface TaxReturn extends SyntheticRecord {
  returnId: string;
  taxpayerId: string;
  assessmentYear: AssessmentYear;
  filingStatus: FilingStatus;
  taxLiability: number;
  selfAssessmentTaxClaimed: number;
  currency: CurrencyCode;
  filedOn: string;
}

export interface TaxPayment extends SyntheticRecord {
  paymentId: string;
  taxpayerId: string;
  assessmentYear: AssessmentYear;
  paymentType: PaymentType;
  amount: number;
  currency: CurrencyCode;
  paymentDate: string;
  challanReference: string;
  status: PaymentStatus;
}

export interface Form26ASEntry {
  entryId: string;
  paymentType: PaymentType;
  amount: number;
  currency: CurrencyCode;
  paymentDate: string;
  challanReference: string;
  status: Form26ASStatus;
}

export interface Form26ASRecord extends SyntheticRecord {
  recordId: string;
  taxpayerId: string;
  assessmentYear: AssessmentYear;
  entries: Form26ASEntry[];
}

export interface ProcessingResult extends SyntheticRecord {
  processingId: string;
  taxpayerId: string;
  returnId: string;
  assessmentYear: AssessmentYear;
  status: ProcessingStatus;
  processedOn: string;
  selfAssessmentTaxRecognised: number;
  currency: CurrencyCode;
}

export interface OutstandingDemand extends SyntheticRecord {
  demandId: string;
  taxpayerId: string;
  assessmentYear: AssessmentYear;
  processingId: string;
  amount: number;
  currency: CurrencyCode;
  status: DemandStatus;
  createdOn: string;
  source: "simulated_cpc_processing";
}
