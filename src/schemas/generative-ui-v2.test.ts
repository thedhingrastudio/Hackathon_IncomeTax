import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { MockAssistanceEngine } from "../lib/ai/mock-assistance-engine.ts";
import { resolveUnderstandingDataRef } from "../lib/ai/understanding-surface.ts";
import { createEvidencePacket } from "../lib/reconciliation/evidence-packet.ts";
import { reconcileTaxCase } from "../lib/reconciliation/reconcile-tax-case.ts";
import { safeParseUnderstandingSurface } from "./generative-ui-v2.ts";

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
