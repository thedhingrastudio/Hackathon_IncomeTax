export type AssistanceQuestionIntent = "attention" | "explain_demand" | "payment_status" | "next_action" | "dates" | "form_26as" | "return_status" | "source_trace" | "case_status" | "pay_again" | "unsupported";

export function normalizeAssistanceQuestion(input: string) {
  return input.trim().toLowerCase().replace(/[₹,?!.']/g, " ").replace(/\s+/g, " ");
}

export function routeAssistanceQuestion(input: string): AssistanceQuestionIntent {
  const q = normalizeAssistanceQuestion(input);
  if (!q) return "unsupported";
  if (/(pay again|pay .* again|have to pay|duplicate payment)/.test(q)) return "pay_again";
  if (/(form 26as|26as)/.test(q)) return "form_26as";
  if (/(where did you get|records did you|records .* (check|use)|how do you know|what.*source|evidence)/.test(q)) return "source_trace";
  if (/(date|deadline|coming up|remember)/.test(q)) return "dates";
  if (/(payment go through|payment work|where is my payment|payment received|receive my payment|show my payment|payment status|check my payment)/.test(q)) return "payment_status";
  if (/(what happened to my return|return processed|is my return processed|return status|explain my return)/.test(q)) return "return_status";
  if (/(where is my case|case status|income tax reviewed|submitted request|happens after.*submit|case progress)/.test(q)) return "case_status";
  if (/(what happens next|what should i do|what do i need to do|how do i fix|next step|two steps|do i need to do anything|review pending action)/.test(q)) return "next_action";
  if (/(what needs my attention|needs attention|anything.*attention|pending action)/.test(q)) return "attention";
  if (/(why do i owe|why.*demand|outstanding demand|owe money|explain.*demand)/.test(q)) return "explain_demand";
  return "unsupported";
}
