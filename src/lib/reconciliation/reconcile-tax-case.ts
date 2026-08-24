import type { Form26ASEntry } from "../../types/tax";
import type {
  ReconciliationEvidence,
  ReconciliationFailureReason,
  ReconciliationInput,
  ReconciliationResult,
} from "./types";

function buildEvidence(
  records: ReconciliationInput,
  form26asEntry?: Readonly<Form26ASEntry>,
): ReconciliationEvidence {
  const { taxReturn, payment, form26as, processingResult, outstandingDemand } = records;

  return {
    ...(taxReturn && {
      taxReturn: {
        returnId: taxReturn.returnId,
        taxpayerId: taxReturn.taxpayerId,
        assessmentYear: taxReturn.assessmentYear,
        selfAssessmentTaxClaimed: taxReturn.selfAssessmentTaxClaimed,
        currency: taxReturn.currency,
      },
    }),
    ...(payment && {
      payment: {
        paymentId: payment.paymentId,
        taxpayerId: payment.taxpayerId,
        assessmentYear: payment.assessmentYear,
        paymentType: payment.paymentType,
        amount: payment.amount,
        currency: payment.currency,
        paymentDate: payment.paymentDate,
        challanReference: payment.challanReference,
        status: payment.status,
      },
    }),
    ...(form26as && {
      form26as: {
        recordId: form26as.recordId,
        taxpayerId: form26as.taxpayerId,
        assessmentYear: form26as.assessmentYear,
        ...(form26asEntry && {
          entryId: form26asEntry.entryId,
          amount: form26asEntry.amount,
          currency: form26asEntry.currency,
          paymentDate: form26asEntry.paymentDate,
          challanReference: form26asEntry.challanReference,
          status: form26asEntry.status,
        }),
      },
    }),
    ...(processingResult && {
      processedReturn: {
        processingId: processingResult.processingId,
        returnId: processingResult.returnId,
        taxpayerId: processingResult.taxpayerId,
        assessmentYear: processingResult.assessmentYear,
        selfAssessmentTaxRecognised: processingResult.selfAssessmentTaxRecognised,
        currency: processingResult.currency,
      },
    }),
    ...(outstandingDemand && {
      demand: {
        demandId: outstandingDemand.demandId,
        processingId: outstandingDemand.processingId,
        taxpayerId: outstandingDemand.taxpayerId,
        assessmentYear: outstandingDemand.assessmentYear,
        amount: outstandingDemand.amount,
        currency: outstandingDemand.currency,
        status: outstandingDemand.status,
      },
    }),
  };
}

export function reconcileTaxCase(records: ReconciliationInput): ReconciliationResult {
  const { taxReturn, payment, form26as, processingResult, outstandingDemand } = records;
  const failureReasons = new Set<ReconciliationFailureReason>();

  if (!taxReturn) failureReasons.add("missing_tax_return");
  if (!payment) failureReasons.add("missing_payment");
  if (!form26as) failureReasons.add("missing_form26as");
  if (!processingResult) failureReasons.add("missing_processing_result");
  if (!outstandingDemand) failureReasons.add("missing_outstanding_demand");

  if (!taxReturn || !payment || !form26as || !processingResult || !outstandingDemand) {
    return {
      status: "unresolved",
      diagnosis: "undetermined",
      ruleCode: null,
      failureReasons: [...failureReasons],
      evidence: buildEvidence(records),
    };
  }

  const form26asEntry = form26as.entries.find(
    (entry) =>
      entry.paymentType === payment.paymentType &&
      entry.challanReference === payment.challanReference &&
      entry.paymentDate === payment.paymentDate,
  );
  const assessmentYears = [
    taxReturn.assessmentYear,
    payment.assessmentYear,
    form26as.assessmentYear,
    processingResult.assessmentYear,
    outstandingDemand.assessmentYear,
  ];
  const taxpayerIds = [
    taxReturn.taxpayerId,
    payment.taxpayerId,
    form26as.taxpayerId,
    processingResult.taxpayerId,
    outstandingDemand.taxpayerId,
  ];
  const currencies = [
    taxReturn.currency,
    payment.currency,
    processingResult.currency,
    outstandingDemand.currency,
    form26asEntry?.currency,
  ];
  const difference = payment.amount - processingResult.selfAssessmentTaxRecognised;

  if (new Set(assessmentYears).size !== 1) failureReasons.add("assessment_year_mismatch");
  if (new Set(taxpayerIds).size !== 1) failureReasons.add("taxpayer_reference_mismatch");
  if (processingResult.returnId !== taxReturn.returnId) failureReasons.add("return_reference_mismatch");
  if (outstandingDemand.processingId !== processingResult.processingId) {
    failureReasons.add("processing_reference_mismatch");
  }
  if (new Set(currencies).size !== 1) failureReasons.add("currency_mismatch");
  if (payment.status !== "confirmed") failureReasons.add("payment_not_confirmed");
  if (payment.paymentType !== "self_assessment_tax") {
    failureReasons.add("payment_not_self_assessment_tax");
  }
  if (!form26asEntry) {
    failureReasons.add("form26as_payment_not_found");
  } else {
    if (form26asEntry.status !== "reflected") {
      failureReasons.add("form26as_payment_not_reflected");
    }
    if (form26asEntry.amount !== payment.amount) {
      failureReasons.add("form26as_amount_mismatch");
    }
  }
  if (processingResult.selfAssessmentTaxRecognised !== 0) {
    failureReasons.add("processed_amount_not_zero");
  }
  if (outstandingDemand.status !== "action_required") {
    failureReasons.add("demand_not_action_required");
  }
  if (outstandingDemand.amount !== payment.amount || outstandingDemand.amount !== difference) {
    failureReasons.add("demand_amount_mismatch");
  }

  const evidence = buildEvidence(records, form26asEntry);

  if (failureReasons.size > 0) {
    return {
      status: "unresolved",
      diagnosis: "undetermined",
      ruleCode: null,
      failureReasons: [...failureReasons],
      evidence,
    };
  }

  return {
    status: "matched",
    diagnosis: "payment_missing_from_processed_return",
    ruleCode: "confirmed_self_assessment_payment_missing_from_processed_return",
    assessmentYear: payment.assessmentYear,
    paymentAmount: payment.amount,
    processedRecognisedAmount: processingResult.selfAssessmentTaxRecognised,
    difference,
    demandAmount: outstandingDemand.amount,
    currency: payment.currency,
    evidence: evidence as Required<ReconciliationEvidence>,
  };
}
