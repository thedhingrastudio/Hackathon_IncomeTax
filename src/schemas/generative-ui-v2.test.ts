import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { MockAssistanceEngine } from "../lib/ai/mock-assistance-engine.ts";
import { resolveUnderstandingDataRef } from "../lib/ai/understanding-surface.ts";
import { resolveActionDataRef } from "../lib/ai/action-surface.ts";
import { createEvidencePacket } from "../lib/reconciliation/evidence-packet.ts";
import { reconcileTaxCase } from "../lib/reconciliation/reconcile-tax-case.ts";
import { safeParseActionSurface, safeParseUnderstandingSurface } from "./generative-ui-v2.ts";

const require = createRequire(import.meta.url);
const records = {
  taxReturn: require("../data/mock/return.json"),
  payment: require("../data/mock/payment.json"),
  form26as: require("../data/mock/form26as.json"),
  processingResult: require("../data/mock/processing-result.json"),
  outstandingDemand: require("../data/mock/demand.json"),
};
const reconciliation = reconcileTaxCase(records);
assert.equal(reconciliation.status, "matched");
const evidence = createEvidencePacket(reconciliation);

test("mock engine produces a valid minimal Understanding surface", () => {
  const output = new MockAssistanceEngine().generateUnderstandingSurface({
    intent: "understand_outstanding_demand",
    evidence,
    approvedWorkflowPlan: ["tax_credit_rectification", "respond_to_demand"],
  });
  assert.equal(safeParseUnderstandingSurface(output).success, true);
});

test("unknown data bindings are rejected rather than dynamically traversed", () => {
  const output = new MockAssistanceEngine().generateUnderstandingSurface({
    intent: "understand_outstanding_demand",
    evidence,
    approvedWorkflowPlan: ["tax_credit_rectification", "respond_to_demand"],
  }) as { blocks: Array<Record<string, unknown>> };
  const invalid = structuredClone(output);
  (invalid.blocks[0].items as Array<Record<string, unknown>>)[0].valueRef = "evidence.payment.__proto__";
  assert.equal(safeParseUnderstandingSurface(invalid).success, false);
});

test("trusted bindings resolve authoritative values from the Evidence Packet", () => {
  assert.equal(resolveUnderstandingDataRef("evidence.payment.amount", evidence), 18420);
  assert.equal(resolveUnderstandingDataRef("evidence.processedReturn.recognisedTax", evidence), 0);
  assert.equal(resolveUnderstandingDataRef("reconciliation.difference", evidence), 18420);
});

test("mock engine produces a valid ordered Action surface", () => {
  const output = new MockAssistanceEngine().generateActionSurface({ intent: "understand_outstanding_demand", evidence, approvedWorkflowPlan: ["tax_credit_rectification", "respond_to_demand"] });
  const parsed = safeParseActionSurface(output);
  assert.equal(parsed.success, true);
  if (parsed.success) assert.deepEqual(parsed.data.blocks[1].steps.map((step) => step.workflow), ["tax_credit_rectification", "respond_to_demand"]);
});

test("Action readiness and payment facts resolve from deterministic evidence", () => {
  assert.equal(resolveActionDataRef("evidence.payment.amount", evidence), 18420);
  assert.equal(resolveActionDataRef("evidence.payment.date", evidence), "2026-07-15");
  assert.equal(resolveActionDataRef("workflow.tax_credit_rectification.ready", evidence), true);
});

test("Action surfaces reject invented actions and reversed workflow order", () => {
  const output = new MockAssistanceEngine().generateActionSurface({ intent: "understand_outstanding_demand", evidence, approvedWorkflowPlan: ["tax_credit_rectification", "respond_to_demand"] }) as Record<string, unknown>;
  const invalidAction = structuredClone(output) as { primaryAction: { actionId: string } };
  invalidAction.primaryAction.actionId = "submit_rectification";
  assert.equal(safeParseActionSurface(invalidAction).success, false);
  const reversed = structuredClone(output) as { blocks: [{}, { steps: unknown[] }] };
  reversed.blocks[1].steps.reverse();
  assert.equal(safeParseActionSurface(reversed).success, false);
});
