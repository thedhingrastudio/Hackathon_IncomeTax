import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { reconcileTaxCase } from "./reconcile-tax-case.ts";
import type { ReconciliationInput } from "./types.ts";

const require = createRequire(import.meta.url);
const realRecords: ReconciliationInput = {
  taxReturn: require("../../data/mock/return.json"),
  payment: require("../../data/mock/payment.json"),
  form26as: require("../../data/mock/form26as.json"),
  processingResult: require("../../data/mock/processing-result.json"),
  outstandingDemand: require("../../data/mock/demand.json"),
};

function recordsWith(overrides: Partial<ReconciliationInput>): ReconciliationInput {
  return {
    ...structuredClone(realRecords),
    ...overrides,
  };
}

function assertUnresolved(records: ReconciliationInput, reason: string) {
  const result = reconcileTaxCase(records);
  assert.equal(result.status, "unresolved");
  assert.equal(result.diagnosis, "undetermined");
  assert.equal(result.ruleCode, null);
  assert.ok(result.failureReasons.includes(reason as never));
}

test("the real synthetic scenario matches the supported diagnosis", () => {
  const before = structuredClone(realRecords);
  const result = reconcileTaxCase(realRecords);

  assert.equal(result.status, "matched");
  assert.equal(result.diagnosis, "payment_missing_from_processed_return");
  assert.equal(result.paymentAmount, 18420);
  assert.equal(result.processedRecognisedAmount, 0);
  assert.equal(result.difference, 18420);
  assert.equal(result.demandAmount, 18420);
  assert.deepEqual(realRecords, before, "reconciliation must not mutate its inputs");
});

test("a mismatched payment Assessment Year is unresolved", () => {
  assertUnresolved(
    recordsWith({ payment: { ...realRecords.payment!, assessmentYear: "2025-26" } }),
    "assessment_year_mismatch",
  );
});

test("an unconfirmed payment is unresolved", () => {
  assertUnresolved(
    recordsWith({ payment: { ...realRecords.payment!, status: "pending" } }),
    "payment_not_confirmed",
  );
});

test("a missing Form 26AS record is unresolved", () => {
  assertUnresolved(recordsWith({ form26as: null }), "missing_form26as");
});

test("a Form 26AS payment that is not reflected is unresolved", () => {
  const form26as = structuredClone(realRecords.form26as!);
  form26as.entries[0].status = "not_reflected";
  assertUnresolved(recordsWith({ form26as }), "form26as_payment_not_reflected");
});

test("a Form 26AS amount mismatch is unresolved", () => {
  const form26as = structuredClone(realRecords.form26as!);
  form26as.entries[0].amount += 1;
  assertUnresolved(recordsWith({ form26as }), "form26as_amount_mismatch");
});

test("a demand amount mismatch is unresolved", () => {
  assertUnresolved(
    recordsWith({ outstandingDemand: { ...realRecords.outstandingDemand!, amount: 100 } }),
    "demand_amount_mismatch",
  );
});

test("a fully recognised payment is unresolved", () => {
  assertUnresolved(
    recordsWith({
      processingResult: {
        ...realRecords.processingResult!,
        selfAssessmentTaxRecognised: realRecords.payment!.amount,
      },
    }),
    "processed_amount_not_zero",
  );
});

test("a partially recognised payment is unresolved rather than guessed", () => {
  assertUnresolved(
    recordsWith({
      processingResult: {
        ...realRecords.processingResult!,
        selfAssessmentTaxRecognised: 420,
      },
      outstandingDemand: { ...realRecords.outstandingDemand!, amount: 18000 },
    }),
    "processed_amount_not_zero",
  );
});

test("a missing required payment returns a safe unresolved result", () => {
  assertUnresolved(recordsWith({ payment: undefined }), "missing_payment");
});
