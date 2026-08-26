import assert from "node:assert/strict";
import test from "node:test";
import { routeAssistanceQuestion } from "./question-router.ts";

const cases = {
  attention: ["What needs my attention?", "Is there anything needing my attention?"],
  explain_demand: ["Why do I owe ₹18,420?", "Why is there an outstanding demand?"],
  payment_status: ["Did my payment go through?", "Did Income Tax receive my payment?", "Did my payment work?", "Where is my payment?"],
  next_action: ["What should I do next?", "How do I fix this?", "What happens next?"],
  dates: ["Any deadlines?", "What dates should I remember?"],
  form_26as: ["What does my Form 26AS show?", "Is the payment in 26AS?"],
  return_status: ["What happened to my return?", "Was my return processed?", "Is my return processed?"],
  source_trace: ["What records did you check?", "How do you know this?"],
  case_status: ["Where is my case?", "Show my case progress"],
  pay_again: ["Do I need to pay again?", "Should I pay ₹18,420 again?"],
} as const;

for (const [intent, questions] of Object.entries(cases)) for (const question of questions) test(`${question} routes to ${intent}`, () => assert.equal(routeAssistanceQuestion(question), intent));
test("unsupported questions remain inside the prototype boundary", () => assert.equal(routeAssistanceQuestion("Can you plan my holiday?"), "unsupported"));
