import assert from "node:assert/strict";
import test from "node:test";
import { syntheticAssistanceResponse } from "./fixtures/synthetic-assistance-response.ts";
import { safeParseAssistanceResponse } from "./generative-ui.ts";

function withReplacement(search: string, replacement: unknown) {
  const payload = structuredClone(syntheticAssistanceResponse) as Record<string, unknown>;
  const blocks = payload.blocks as Array<Record<string, unknown>>;
  const block = blocks.find((item) => item.type === search);
  assert.ok(block);
  return { payload, block, replacement };
}

test("a complete approved assistance response validates", () => {
  const result = safeParseAssistanceResponse(syntheticAssistanceResponse);
  assert.equal(result.success, true);
});

test("unknown and executable-style block types are rejected", () => {
  for (const type of ["custom_html", "javascript", "https://example.test/component"]) {
    const payload = structuredClone(syntheticAssistanceResponse) as Record<string, unknown>;
    (payload.blocks as Array<Record<string, unknown>>)[0].type = type;
    assert.equal(safeParseAssistanceResponse(payload).success, false, type);
  }
});

test("an unsupported diagnosis is rejected", () => {
  const payload = structuredClone(syntheticAssistanceResponse) as Record<string, unknown>;
  payload.diagnosis = "invented_diagnosis";
  assert.equal(safeParseAssistanceResponse(payload).success, false);
});

test("an unknown exposed action is rejected", () => {
  const payload = structuredClone(syntheticAssistanceResponse) as Record<string, unknown>;
  (payload.actions as Array<Record<string, unknown>>)[0].action = "delete_tax_record";
  assert.equal(safeParseAssistanceResponse(payload).success, false);
});

test("an invented government workflow is rejected", () => {
  const { payload, block } = withReplacement("action_plan", null);
  (block.steps as Array<Record<string, unknown>>)[0].action = "erase_demand";
  assert.equal(safeParseAssistanceResponse(payload).success, false);
});

test("malformed amounts are rejected", () => {
  for (const invalidAmount of ["18420", -1, 18.42, Number.NaN]) {
    const { payload, block } = withReplacement("amount_comparison", invalidAmount);
    (block.left as Record<string, unknown>).amount = invalidAmount;
    assert.equal(safeParseAssistanceResponse(payload).success, false);
  }
});

test("a missing required block field is rejected", () => {
  const { payload, block } = withReplacement("diagnosis", null);
  delete block.title;
  assert.equal(safeParseAssistanceResponse(payload).success, false);
});

test("unknown fields cannot smuggle executable concepts into approved blocks", () => {
  const { payload, block } = withReplacement("diagnosis", null);
  block.html = "<script>unsafe()</script>";
  assert.equal(safeParseAssistanceResponse(payload).success, false);
});
