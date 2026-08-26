"use client";

import { Check, CircleAlert, CircleDot, Info } from "lucide-react";
import { getForm26AS, getOutstandingDemand, getProcessingResult, getTaxPayment } from "../../data/mock";
import { formatIndianCurrency, formatRecordLabel } from "../../lib/format-tax";
import { useTaxDemandCase } from "../../lib/storage/case-storage";

type Tone = "complete" | "action" | "waiting" | "future";
type Step = { label: string; tone: Tone; detail?: string; help?: string };

function buildLifecycleSteps(rectificationReference?: string, demandResponseReference?: string, state?: string): Step[] {
  const waiting = state === "WAITING_FOR_REVIEW";
  const resolved = state === "RESOLVED";
  return [
    { label: "Payment found", tone: "complete" },
    { label: "Issue found", tone: "complete", detail: "Processed return did not include the payment" },
    { label: "Correction submitted", tone: rectificationReference ? "complete" : "future", detail: rectificationReference },
    { label: "Demand response submitted", tone: demandResponseReference ? "complete" : "future", detail: demandResponseReference },
    { label: "Income Tax review", tone: resolved ? "complete" : waiting ? "waiting" : "future", detail: waiting ? "Waiting for review" : resolved ? "Reviewed" : undefined },
    { label: "Resolved", tone: resolved ? "complete" : "future", detail: resolved ? undefined : "Not reached yet" },
  ];
}

function buildSteps(state?: string): Step[] {
  const rectificationDone = ["RECTIFICATION_SUBMITTED", "DEMAND_RESPONSE_REVIEW", "DEMAND_RESPONSE_SUBMITTED", "WAITING_FOR_REVIEW", "RESOLVED"].includes(state ?? "");
  const responseDone = ["DEMAND_RESPONSE_SUBMITTED", "WAITING_FOR_REVIEW", "RESOLVED"].includes(state ?? "");
  const waiting = state === "WAITING_FOR_REVIEW";
  const resolved = state === "RESOLVED";

  const payment = getTaxPayment();
  const form26as = getForm26AS();
  const form26asEntry = form26as.entries[0];
  const processing = getProcessingResult();
  const demand = getOutstandingDemand();

  if (!rectificationDone) return [
    { label: "Payment", tone: "complete", detail: `${formatIndianCurrency(payment.amount, payment.currency)} · ${formatRecordLabel(payment.status)}`, help: "The Self-Assessment Tax payment exists and is confirmed." },
    { label: "Form 26AS", tone: "complete", detail: `${formatIndianCurrency(form26asEntry.amount, form26asEntry.currency)} · ${formatRecordLabel(form26asEntry.status)}`, help: "Form 26AS reflects the payment, confirming that the tax record exists." },
    { label: "Processed return", tone: "action", detail: `${formatIndianCurrency(processing.selfAssessmentTaxRecognised, processing.currency)} · Mismatch`, help: "The processed return recognised ₹0 of this Self-Assessment Tax payment." },
    { label: "Outstanding demand", tone: "action", detail: `${formatIndianCurrency(demand.amount, demand.currency)} · Action required`, help: "Because the processed return did not count the payment, the same amount appears as an outstanding demand." },
  ];

  const steps: Step[] = [
    { label: "Payment", tone: "complete", detail: `${formatIndianCurrency(payment.amount, payment.currency)} · ${formatRecordLabel(payment.status)}`, help: "The Self-Assessment Tax payment exists and is confirmed." },
    { label: "Form 26AS", tone: "complete", detail: `${formatIndianCurrency(form26asEntry.amount, form26asEntry.currency)} · ${formatRecordLabel(form26asEntry.status)}`, help: "Form 26AS reflects the payment, confirming that the tax record exists." },
    { label: "Processed return", tone: "action", detail: `${formatIndianCurrency(processing.selfAssessmentTaxRecognised, processing.currency)} · Mismatch`, help: "The processed return recognised ₹0 of this Self-Assessment Tax payment." },
  ];

  steps.push({ label: "Correction submitted", tone: "complete", detail: "RECT-DEMO-01842", help: "Your payment challan was added through Tax Credit Mismatch Correction." });
  if (!responseDone) steps.push({ label: "Outstanding demand", tone: "action", detail: `${formatIndianCurrency(demand.amount, demand.currency)} · Action required`, help: "The correction is submitted. You still need to respond to the outstanding demand." });
  else steps.push({ label: "Demand response submitted", tone: "complete", detail: "DEMAND-RESP-DEMO-18420" });

  if (responseDone) {
    steps.push(resolved
      ? { label: "Income Tax review", tone: "complete", detail: "Reviewed" }
      : { label: "Income Tax review", tone: waiting ? "waiting" : "waiting", detail: "Waiting for review", help: "You have completed the required actions. Income Tax now needs to review the correction and response." });
    steps.push(resolved ? { label: "Resolved", tone: "complete" } : { label: "Resolved", tone: "future", detail: "Not reached yet" });
  }

  return steps;
}

function StepIcon({ tone }: { tone: Tone }) {
  if (tone === "complete") return <Check aria-hidden="true" />;
  if (tone === "action") return <CircleAlert aria-hidden="true" />;
  return <CircleDot aria-hidden="true" />;
}

export default function StatusJourney({ compact = false, horizontal = false, lifecycle = false }: { compact?: boolean; horizontal?: boolean; lifecycle?: boolean }) {
  const item = useTaxDemandCase();
  const steps = lifecycle ? buildLifecycleSteps(item?.rectificationReference, item?.demandResponseReference, item?.state) : buildSteps(item?.state);
  return <ol className={`status-journey${compact ? " status-journey--compact" : ""}${horizontal ? " status-journey--horizontal" : ""}`} aria-label="Case progress">
    {steps.map((step) => <li className={`status-journey__step status-journey__step--${step.tone}`} key={step.label}>
      <span className="status-journey__marker"><StepIcon tone={step.tone} /></span>
      <span className="status-journey__copy"><strong>{step.label}</strong>{step.detail ? <small>{step.detail}</small> : null}</span>
      {step.help ? <span className="status-journey__help" title={step.help} aria-label={step.help}><Info aria-hidden="true" /></span> : null}
    </li>)}
  </ol>;
}
