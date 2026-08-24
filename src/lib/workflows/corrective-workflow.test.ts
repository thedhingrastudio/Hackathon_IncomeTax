import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { createEvidencePacket } from "../reconciliation/evidence-packet.ts";
import { reconcileTaxCase } from "../reconciliation/reconcile-tax-case.ts";
import { getApprovedWorkflowPlan } from "../rules/approved-workflows.ts";
import type { ReconciliationInput } from "../reconciliation/types.ts";
import {
  prepareAssistedDemandResponse,
  prepareRectificationDraft,
  submitAssistedDemandResponse,
  submitRectification,
  validateAssistedDemandResponse,
  validateRectificationDraft,
  type AssistedWorkflowContext,
} from "./corrective-workflow.ts";

const require = createRequire(import.meta.url);
const records = {
  taxReturn: require("../../data/mock/return.json"),
  payment: require("../../data/mock/payment.json"),
  form26as: require("../../data/mock/form26as.json"),
  processingResult: require("../../data/mock/processing-result.json"),
  outstandingDemand: require("../../data/mock/demand.json"),
} as Required<ReconciliationInput>;

function contextWith(overrides: Partial<AssistedWorkflowContext> = {}): AssistedWorkflowContext {
  const reconciliation = reconcileTaxCase(records);
  assert.equal(reconciliation.status, "matched");
  return {
    evidence: createEvidencePacket(reconciliation),
    records: structuredClone(records) as AssistedWorkflowContext["records"],
    approvedWorkflowPlan: getApprovedWorkflowPlan(reconciliation.diagnosis),
    ...overrides,
  };
}

test("supported evidence prepares the required Tax Credit Rectification", () => {
  const result = prepareRectificationDraft(contextWith());
  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal(result.data.assessmentYear, "2026-27");
  assert.equal(result.data.amount, 18420);
  assert.equal(result.data.challanReference, "MOCK-2481");
  assert.equal(result.data.correctionType, "tax_credit_mismatch_correction");
});

test("missing or invalid payment evidence fails safely", () => {
  const context = contextWith();
  context.records.payment = { ...context.records.payment, status: "pending", challanReference: "" };
  const result = prepareRectificationDraft(context);
  assert.equal(result.success, false);
  if (result.success) return;
  assert.ok(result.errors.includes("payment_not_confirmed"));
  assert.ok(result.errors.includes("challan_missing"));
});

test("valid Rectification produces the stable mock reference and cannot submit twice", () => {
  const context = contextWith();
  const prepared = prepareRectificationDraft(context);
  assert.equal(prepared.success, true);
  if (!prepared.success) return;
  assert.equal(validateRectificationDraft(prepared.data, context.evidence).success, true);
  const submitted = submitRectification(prepared.data, context.evidence);
  assert.equal(submitted.success, true);
  if (!submitted.success) return;
  assert.equal(submitted.data.reference, "RECT-DEMO-01842");
  const repeated = submitRectification(prepared.data, context.evidence, submitted.data);
  assert.equal(repeated.success, false);
});

test("Demand Response cannot be prepared before Rectification submission", () => {
  const result = prepareAssistedDemandResponse(contextWith(), null);
  assert.deepEqual(result, { success: false, errors: ["rectification_required"] });
});

test("submitted Rectification prepares and submits the approved Demand Response", () => {
  const context = contextWith();
  const prepared = prepareRectificationDraft(context);
  assert.equal(prepared.success, true);
  if (!prepared.success) return;
  const correction = submitRectification(prepared.data, context.evidence);
  assert.equal(correction.success, true);
  if (!correction.success) return;
  const response = prepareAssistedDemandResponse(context, correction.data);
  assert.equal(response.success, true);
  if (!response.success) return;
  assert.equal(response.data.response, "disagree");
  assert.equal(response.data.reason, "tax_credit_not_considered");
  assert.equal(response.data.disputedAmount, 18420);
  assert.equal(response.data.rectificationReference, "RECT-DEMO-01842");
  assert.equal(validateAssistedDemandResponse(response.data, null).success, false);
  const submitted = submitAssistedDemandResponse(response.data, correction.data);
  assert.equal(submitted.success, true);
  if (!submitted.success) return;
  assert.equal(submitted.data.reference, "DEMAND-RESP-DEMO-18420");
});
