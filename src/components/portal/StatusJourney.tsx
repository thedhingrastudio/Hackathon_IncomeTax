"use client";

import { Check, CircleAlert, CircleDot, Info } from "lucide-react";
import { useTaxDemandCase } from "../../lib/storage/case-storage";

type Tone = "complete" | "action" | "waiting" | "future";
type Step = { label: string; tone: Tone; detail?: string; help?: string };

function buildSteps(state?: string): Step[] {
  const rectificationDone = ["RECTIFICATION_SUBMITTED", "DEMAND_RESPONSE_REVIEW", "DEMAND_RESPONSE_SUBMITTED", "WAITING_FOR_REVIEW", "RESOLVED"].includes(state ?? "");
  const responseDone = ["DEMAND_RESPONSE_SUBMITTED", "WAITING_FOR_REVIEW", "RESOLVED"].includes(state ?? "");
  const waiting = state === "WAITING_FOR_REVIEW";
  const resolved = state === "RESOLVED";

  const steps: Step[] = [
    { label: "Payment found", tone: "complete", detail: "₹18,420 confirmed", help: "The Self-Assessment Tax payment exists in your Income Tax records." },
    { label: "Return processed", tone: "complete", detail: "Tax credit recognised: ₹0", help: "The processed return completed, but it did not include the payment as tax credit." },
  ];

  if (!rectificationDone) {
    steps.push({ label: "Tax credit needs correction", tone: "action", detail: "Your payment was not counted", help: "The payment exists, but the processed return recognised ₹0. A Tax Credit Mismatch Correction is needed." });
    steps.push({ label: "Respond to demand", tone: "future", detail: "After the correction" });
  } else {
    steps.push({ label: "Tax credit correction submitted", tone: "complete", detail: "RECT-DEMO-01842", help: "The payment challan was added through Tax Credit Mismatch Correction." });
    if (!responseDone) steps.push({ label: "Respond to demand", tone: "action", detail: "Your response is required", help: "The correction is submitted. The outstanding demand still needs your response." });
    else steps.push({ label: "Demand response submitted", tone: "complete", detail: "DEMAND-RESP-DEMO-18420" });
  }

  if (responseDone) {
    steps.push(resolved
      ? { label: "Income Tax review", tone: "complete", detail: "Reviewed" }
      : { label: "Income Tax review", tone: waiting ? "waiting" : "waiting", detail: "Waiting for review", help: "You have completed the required actions. Income Tax now needs to review the submitted correction and response." });
    steps.push(resolved ? { label: "Resolved", tone: "complete" } : { label: "Resolved", tone: "future", detail: "Not reached yet" });
  }

  return steps;
}

function StepIcon({ tone }: { tone: Tone }) {
  if (tone === "complete") return <Check aria-hidden="true" />;
  if (tone === "action") return <CircleAlert aria-hidden="true" />;
  return <CircleDot aria-hidden="true" />;
}

export default function StatusJourney({ compact = false }: { compact?: boolean }) {
  const item = useTaxDemandCase();
  const steps = buildSteps(item?.state);
  return <ol className={`status-journey${compact ? " status-journey--compact" : ""}`} aria-label="Case progress">
    {steps.map((step) => <li className={`status-journey__step status-journey__step--${step.tone}`} key={step.label}>
      <span className="status-journey__marker"><StepIcon tone={step.tone} /></span>
      <span className="status-journey__copy"><strong>{step.label}</strong>{step.detail ? <small>{step.detail}</small> : null}</span>
      {step.help ? <span className="status-journey__help" title={step.help} aria-label={step.help}><Info aria-hidden="true" /></span> : null}
    </li>)}
  </ol>;
}
