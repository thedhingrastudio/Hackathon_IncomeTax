import type { TaxDemandCase } from "../../types/case";
import type { TimelineBlock } from "../../types/generative-ui";

export function createCaseTimeline(taxCase: TaxDemandCase): TimelineBlock {
  const waitingForReview = taxCase.state === "WAITING_FOR_REVIEW";
  const resolved = taxCase.state === "RESOLVED";
  return { id: "case-timeline", type: "timeline", title: "Case progress", items: [
    { id: "payment", title: "Payment found", status: "complete" },
    { id: "diagnosis", title: "Problem identified", status: "complete" },
    { id: "rectification", title: "Tax-credit correction submitted", description: taxCase.rectificationReference, status: taxCase.rectificationReference ? "complete" : "pending" },
    { id: "response", title: "Demand response submitted", description: taxCase.demandResponseReference, status: taxCase.demandResponseReference ? "complete" : "pending" },
    { id: "review", title: "Income Tax review", description: waitingForReview ? "In progress" : undefined, status: waitingForReview ? "current" : resolved ? "complete" : "pending" },
    { id: "resolved", title: "Resolved", status: resolved ? "complete" : "pending" },
  ] };
}
