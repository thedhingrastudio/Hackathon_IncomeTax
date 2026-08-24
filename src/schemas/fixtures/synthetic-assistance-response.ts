import type { AssistanceResponse } from "../../types/generative-ui.ts";

export const syntheticAssistanceResponse: AssistanceResponse = {
  caseId: "tax-demand-001",
  intent: "understand_outstanding_demand",
  diagnosis: "payment_missing_from_processed_return",
  summary: "The records support the approved synthetic diagnosis.",
  blocks: [
    {
      id: "sources",
      type: "source_check",
      title: "Records checked",
      sources: [
        { source: "outstanding_demand", label: "Outstanding Demand", status: "complete" },
        { source: "processed_return", label: "Processed return", status: "complete" },
        { source: "tax_payment", label: "Tax payment", status: "complete" },
        { source: "form_26as", label: "Form 26AS", status: "complete" },
      ],
    },
    {
      id: "amounts",
      type: "amount_comparison",
      title: "Amount comparison",
      left: { label: "Tax payment", amount: 18420, currency: "INR", status: "Confirmed" },
      right: { label: "Processed return recognised", amount: 0, currency: "INR" },
      difference: { label: "Difference", amount: 18420, currency: "INR" },
    },
    {
      id: "diagnosis",
      type: "diagnosis",
      title: "What the records show",
      diagnosis: "payment_missing_from_processed_return",
      summary: "The confirmed payment is reflected in Form 26AS but is not recognised in the processed return.",
    },
    {
      id: "evidence",
      type: "evidence",
      title: "Supporting records",
      items: [
        { source: "tax_payment", label: "Self-Assessment Tax payment", value: 18420, status: "confirmed", reference: "payment-demo-001" },
        { source: "form_26as", label: "Form 26AS amount", value: 18420, status: "reflected", reference: "26as-entry-demo-001" },
        { source: "processed_return", label: "Amount recognised", value: 0, status: "processed", reference: "processing-demo-2026-27-001" },
      ],
    },
    {
      id: "plan",
      type: "action_plan",
      title: "Approved action plan",
      steps: [
        { action: "tax_credit_rectification", title: "Tax Credit Rectification", description: "Request correction of the payment credit.", status: "ready" },
        { action: "respond_to_demand", title: "Response to Outstanding Demand", description: "Respond after reviewing the rectification information.", status: "pending" },
      ],
    },
  ],
  actions: [
    { id: "view-evidence", action: "view_evidence", label: "View evidence" },
    { id: "review-rectification", action: "review_rectification", label: "Review rectification" },
  ],
};
