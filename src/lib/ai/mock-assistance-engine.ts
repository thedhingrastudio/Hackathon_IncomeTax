import { formatIndianCurrency, formatIndianDate } from "../format-tax.ts";
import type { AssistanceResponse } from "../../types/generative-ui";
import type { AssistanceEngine, AssistanceEngineInput } from "./types.ts";
import type { ActionSurfaceSpecification, UnderstandingSurfaceSpecification } from "../../types/generative-ui-v2.ts";

const workflowContent = {
  tax_credit_rectification: {
    title: "Correct your tax credit",
    status: "ready" as const,
  },
  respond_to_demand: {
    title: "Respond to the demand",
    status: "blocked" as const,
  },
};

export class MockAssistanceEngine implements AssistanceEngine {
  generateActionSurface(): unknown {
    const surface: ActionSurfaceSpecification = {
      surface: "action",
      blocks: [
        { type: "checklist", variant: "readiness", items: [{ label: "Payment identified", amountRef: "evidence.payment.amount", dateRef: "evidence.payment.date", typeRef: "evidence.payment.type", readinessRef: "workflow.tax_credit_rectification.ready" }] },
        { type: "action_plan", steps: [{ workflow: "tax_credit_rectification", label: "Correct your tax credit" }, { workflow: "respond_to_demand", label: "Respond to the demand", dependencyRef: "workflow.respond_to_demand.dependency" }] },
      ],
      primaryAction: { actionId: "review_rectification", label: "Review correction" },
    };
    return surface;
  }

  generateUnderstandingSurface(): unknown {
    const surface: UnderstandingSurfaceSpecification = {
      surface: "understanding",
      blocks: [
        {
          type: "comparison",
          variant: "financial_mismatch",
          items: [
            { label: "You paid", valueRef: "evidence.payment.amount", statusRef: "evidence.payment.status" },
            { label: "Return recognised", valueRef: "evidence.processedReturn.recognisedTax" },
          ],
          differenceRef: "reconciliation.difference",
        },
        { type: "explanation", factSetRef: "diagnosis.primary" },
        {
          type: "source_trace",
          collapsed: true,
          items: [
            { label: "Payment", valueRef: "evidence.payment.amount", statusRef: "evidence.payment.status" },
            { label: "Form 26AS", valueRef: "evidence.form26as.amount", statusRef: "evidence.form26as.status" },
            { label: "Processed return", valueRef: "evidence.processedReturn.recognisedTax" },
            { label: "Outstanding demand", valueRef: "evidence.demand.amount", statusRef: "evidence.demand.status" },
          ],
        },
      ],
      primaryAction: { actionId: "start_corrective_plan", label: "Fix this" },
    };
    return surface;
  }

  generate({ intent, evidence, approvedWorkflowPlan }: AssistanceEngineInput): unknown {
    const paymentAmount = formatIndianCurrency(evidence.payment.amount, evidence.currency);
    const demandAmount = formatIndianCurrency(evidence.demand.amount, evidence.currency);
    const processedAmount = formatIndianCurrency(evidence.processedReturn.selfAssessmentTaxRecognised, evidence.currency);
    const response: AssistanceResponse = {
      caseId: evidence.caseId,
      intent,
      diagnosis: evidence.diagnosis,
      summary: "Income Tax records have been compared for this demand.",
      blocks: [
        {
          id: "linked-records",
          type: "source_check",
          title: "Checking this demand",
          summary: "We're comparing the Income Tax records already linked to this demand.",
          sources: [
            { source: "outstanding_demand", label: "Outstanding Demand", status: "complete" },
            { source: "tax_payment", label: "Tax payment", status: "complete" },
            { source: "filed_return", label: "Filed return", status: "complete" },
            { source: "form_26as", label: "Form 26AS", status: "complete" },
            { source: "processed_return", label: "Processed return", status: "complete" },
          ],
        },
        {
          id: "authoritative-amounts",
          type: "amount_comparison",
          title: "We found the problem",
          left: { label: "You paid", amount: evidence.payment.amount, currency: evidence.currency, status: "Confirmed" },
          right: { label: "Processed return", amount: evidence.processedReturn.selfAssessmentTaxRecognised, currency: evidence.currency, status: "Tax recognised" },
          difference: { label: "Difference", amount: evidence.discrepancy, currency: evidence.currency },
        },
        {
          id: "supported-diagnosis",
          type: "diagnosis",
          title: "What this means",
          diagnosis: evidence.diagnosis,
          summary: `Your ${paymentAmount} payment exists, but it was not included in the return Income Tax processed.`,
        },
        {
          id: "supporting-evidence",
          type: "evidence",
          title: "Why we think this",
          items: [
            { source: "tax_payment", label: "Tax payment", value: `${paymentAmount} · Confirmed · ${formatIndianDate(evidence.payment.date)}`, status: "confirmed", reference: evidence.payment.challanReference },
            { source: "form_26as", label: "Form 26AS", value: `${formatIndianCurrency(evidence.form26as.amount, evidence.currency)} · Reflected`, status: "reflected", reference: evidence.form26as.entryId },
            { source: "processed_return", label: "Processed return", value: `${processedAmount} Self-Assessment Tax recognised`, status: "processed", reference: evidence.processedReturn.recordId },
            { source: "outstanding_demand", label: "Outstanding Demand", value: demandAmount, status: "action_required", reference: evidence.demand.recordId },
          ],
        },
        {
          id: "approved-action-plan",
          type: "action_plan",
          title: "Here's how we'll fix this",
          summary: "These are the approved government steps for this issue. Nothing has been submitted.",
          steps: approvedWorkflowPlan.map((action) => ({
            action,
            title: workflowContent[action].title,
            description: action === "respond_to_demand" ? `After the correction is submitted, respond to the ${demandAmount} demand.` : `Use the ${paymentAmount} Self-Assessment Tax payment already on record to correct the processed return.`,
            status: workflowContent[action].status,
          })),
        },
      ],
      actions: [
        { id: "view-evidence", action: "view_evidence", label: "View evidence" },
        { id: "view-demand", action: "view_demand", label: "Back to demand" },
      ],
    };
    return response;
  }
}
