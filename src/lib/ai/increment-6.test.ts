import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { safeParseAssistanceResponse } from "../../schemas/generative-ui.ts";
import { createEvidencePacket } from "../reconciliation/evidence-packet.ts";
import { reconcileTaxCase } from "../reconciliation/reconcile-tax-case.ts";
import type { ReconciliationInput } from "../reconciliation/types.ts";
import { getApprovedWorkflowPlan } from "../rules/approved-workflows.ts";
import { createDemandAssistance } from "./create-demand-assistance.ts";
import { MockAssistanceEngine } from "./mock-assistance-engine.ts";

const require = createRequire(import.meta.url);
const records: ReconciliationInput = {
  taxReturn: require("../../data/mock/return.json"),
  payment: require("../../data/mock/payment.json"),
  form26as: require("../../data/mock/form26as.json"),
  processingResult: require("../../data/mock/processing-result.json"),
  outstandingDemand: require("../../data/mock/demand.json"),
};

test("the supported diagnosis maps to exactly the approved two-step workflow", () => {
  assert.deepEqual(getApprovedWorkflowPlan("payment_missing_from_processed_return"), [
    "tax_credit_rectification",
    "respond_to_demand",
  ]);
  assert.deepEqual(getApprovedWorkflowPlan("undetermined"), []);
});

test("the Evidence Packet preserves deterministic amounts and record references", () => {
  const reconciliation = reconcileTaxCase(records);
  assert.equal(reconciliation.status, "matched");
  const packet = createEvidencePacket(reconciliation);

  assert.equal(packet.payment.amount, records.payment!.amount);
  assert.equal(packet.payment.challanReference, records.payment!.challanReference);
  assert.equal(packet.processedReturn.selfAssessmentTaxRecognised, records.processingResult!.selfAssessmentTaxRecognised);
  assert.equal(packet.demand.amount, records.outstandingDemand!.amount);
  assert.equal(packet.discrepancy, records.payment!.amount - records.processingResult!.selfAssessmentTaxRecognised);
  assert.equal(packet.form26as.entryId, records.form26as!.entries[0].entryId);
});

test("the mock engine produces schema-valid trusted blocks from approved inputs", () => {
  const reconciliation = reconcileTaxCase(records);
  assert.equal(reconciliation.status, "matched");
  const evidence = createEvidencePacket(reconciliation);
  const plan = getApprovedWorkflowPlan(reconciliation.diagnosis);
  const output = new MockAssistanceEngine().generate({
    intent: "understand_outstanding_demand",
    evidence,
    approvedWorkflowPlan: plan,
  });
  const parsed = safeParseAssistanceResponse(output);

  assert.equal(parsed.success, true);
  if (!parsed.success) return;
  assert.deepEqual(parsed.data.blocks.map((block) => block.type), [
    "source_check",
    "amount_comparison",
    "diagnosis",
    "evidence",
    "action_plan",
  ]);
  const actionPlan = parsed.data.blocks.find((block) => block.type === "action_plan");
  assert.ok(actionPlan && actionPlan.type === "action_plan");
  assert.deepEqual(actionPlan.steps.map((step) => step.action), plan);
  assert.equal(actionPlan.steps[0].description, "Use the ₹18,420 Self-Assessment Tax payment already on record to correct the processed return.");
  assert.equal(actionPlan.steps[0].status, "ready");
  assert.equal(actionPlan.steps[1].description, "After the correction is submitted, respond to the ₹18,420 demand.");
  assert.equal(actionPlan.steps[1].status, "blocked");
  const comparison = parsed.data.blocks.find((block) => block.type === "amount_comparison");
  assert.ok(comparison && comparison.type === "amount_comparison");
  assert.equal(comparison.title, "We found the problem");
  assert.equal(comparison.left.label, "You paid");
  assert.equal(comparison.right.label, "Processed return");
});

test("an unresolved reconciliation never produces a diagnosis or action plan", () => {
  const unresolved = reconcileTaxCase({ ...records, payment: null });
  assert.equal(unresolved.status, "unresolved");
  assert.deepEqual(createDemandAssistance(unresolved), { status: "unresolved" });
});

test("an unsupported provider fails safely", () => {
  const reconciliation = reconcileTaxCase(records);
  assert.equal(reconciliation.status, "matched");
  assert.deepEqual(createDemandAssistance(reconciliation, "unsupported"), { status: "invalid_provider_output" });
});
