import type { MatchedReconciliationResult } from "./types";

export interface EvidencePacket {
  caseId: string;
  assessmentYear: MatchedReconciliationResult["assessmentYear"];
  diagnosis: MatchedReconciliationResult["diagnosis"];
  currency: MatchedReconciliationResult["currency"];
  payment: {
    recordId: string;
    amount: number;
    status: "confirmed";
    date: string;
    challanReference: string;
  };
  form26as: {
    recordId: string;
    entryId: string;
    amount: number;
    status: "reflected";
  };
  filedReturn: {
    recordId: string;
    selfAssessmentTaxClaimed: number;
  };
  processedReturn: {
    recordId: string;
    returnId: string;
    selfAssessmentTaxRecognised: number;
  };
  demand: {
    recordId: string;
    amount: number;
    status: "action_required";
  };
  discrepancy: number;
}

export function createEvidencePacket(result: MatchedReconciliationResult): EvidencePacket {
  const { evidence } = result;
  if (
    evidence.payment.status !== "confirmed" ||
    evidence.form26as.status !== "reflected" ||
    evidence.form26as.entryId === undefined ||
    evidence.form26as.amount === undefined ||
    evidence.demand.status !== "action_required"
  ) {
    throw new Error("Matched reconciliation evidence violates the supported rule invariant.");
  }

  return {
    caseId: evidence.demand.demandId,
    assessmentYear: result.assessmentYear,
    diagnosis: result.diagnosis,
    currency: result.currency,
    payment: {
      recordId: evidence.payment.paymentId,
      amount: result.paymentAmount,
      status: evidence.payment.status,
      date: evidence.payment.paymentDate,
      challanReference: evidence.payment.challanReference,
    },
    form26as: {
      recordId: evidence.form26as.recordId,
      entryId: evidence.form26as.entryId,
      amount: evidence.form26as.amount,
      status: evidence.form26as.status,
    },
    filedReturn: {
      recordId: evidence.taxReturn.returnId,
      selfAssessmentTaxClaimed: evidence.taxReturn.selfAssessmentTaxClaimed,
    },
    processedReturn: {
      recordId: evidence.processedReturn.processingId,
      returnId: evidence.processedReturn.returnId,
      selfAssessmentTaxRecognised: result.processedRecognisedAmount,
    },
    demand: {
      recordId: evidence.demand.demandId,
      amount: result.demandAmount,
      status: evidence.demand.status,
    },
    discrepancy: result.difference,
  };
}
