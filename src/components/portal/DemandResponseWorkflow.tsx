"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { OutstandingDemand, TaxPayment } from "../../types/tax";
import type { DemandResponseChoice, DisagreementReason, ResponseDraft, ResponseSubmissionResult } from "../../types/demand-response";
import { formatAssessmentYear, formatIndianCurrency, formatIndianDate } from "../../lib/format-tax";

type Step = "response" | "details" | "review" | "submitted";
type Errors = Partial<Record<keyof ResponseDraft, string>>;

const responseOptions: { value: DemandResponseChoice; title: string; description: string }[] = [
  { value: "demand_correct", title: "The demand is correct", description: "I agree that this amount is payable." },
  { value: "already_paid", title: "This amount has already been paid", description: "I have payment details for this amount." },
  { value: "disagree", title: "I disagree with this demand", description: "I believe some or all of this demand is incorrect." },
];

const disagreementReasons: { value: DisagreementReason; label: string }[] = [
  { value: "tax_credit_not_considered", label: "Tax payment / tax credit has not been considered" },
  { value: "amount_differs", label: "Amount differs from my records" },
  { value: "payment_information_incorrect", label: "Credit or payment information is incorrect" },
  { value: "correction_request_filed", label: "Another correction request has been filed" },
  { value: "other", label: "Other" },
];

const responseLabels: Record<DemandResponseChoice, string> = {
  demand_correct: "The demand is correct",
  already_paid: "This amount has already been paid",
  disagree: "I disagree with this demand",
};

export default function DemandResponseWorkflow({ demand, payment }: { demand: OutstandingDemand; payment: TaxPayment }) {
  const [step, setStep] = useState<Step>("response");
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<ResponseSubmissionResult | null>(null);
  const [draft, setDraft] = useState<ResponseDraft>({ choice: "", paymentAmount: String(payment.amount), paymentDate: payment.paymentDate, challanReference: payment.challanReference, disagreementReason: "", otherReason: "", disputedAmount: String(demand.amount) });
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { headingRef.current?.focus(); }, [step]);

  function update<K extends keyof ResponseDraft>(field: K, value: ResponseDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function continueFromResponse() {
    if (!draft.choice) { setErrors({ choice: "Select how you want to respond." }); return; }
    setErrors({}); setStep("details");
  }

  function validateDetails() {
    const nextErrors: Errors = {};
    if (draft.choice === "already_paid") {
      if (!draft.paymentAmount || Number(draft.paymentAmount) <= 0) nextErrors.paymentAmount = "Enter a payment amount greater than zero.";
      if (!draft.paymentDate) nextErrors.paymentDate = "Enter the payment date.";
      if (!draft.challanReference.trim()) nextErrors.challanReference = "Enter the challan reference.";
    }
    if (draft.choice === "disagree") {
      if (!draft.disagreementReason) nextErrors.disagreementReason = "Select a reason for disagreeing with the demand.";
      if (draft.disagreementReason === "other" && !draft.otherReason.trim()) nextErrors.otherReason = "Briefly explain your reason.";
      const amount = Number(draft.disputedAmount);
      if (!draft.disputedAmount || amount <= 0) nextErrors.disputedAmount = "Enter an amount greater than zero.";
      else if (amount > demand.amount) nextErrors.disputedAmount = `The disputed amount cannot exceed ${formatIndianCurrency(demand.amount, demand.currency)}.`;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep("review");
  }

  function submitResponse() {
    setResult({ reference: "DEMAND-RESP-DEMO-18420", status: "submitted", submittedAt: new Date().toISOString() });
    setStep("submitted");
  }

  if (step === "submitted" && result) return <section className="workflow-panel" aria-labelledby="submitted-title"><div className="ux4g-alert ux4g-alert-success response-success" role="status"><div><h1 id="submitted-title" ref={headingRef} tabIndex={-1}>Response submitted</h1><p>Your response to the {formatIndianCurrency(demand.amount, demand.currency)} outstanding demand has been recorded.</p></div></div><div className="ux4g-card ux4g-card-outline ux4g-card-vertical"><div className="ux4g-card-body"><dl className="review-list"><div><dt>Response reference</dt><dd>{result.reference}</dd></div><div><dt>Assessment Year</dt><dd>{formatAssessmentYear(demand.assessmentYear)}</dd></div><div><dt>Response status</dt><dd>Submitted</dd></div></dl></div></div><div className="workflow-actions"><Link className="ux4g-btn ux4g-btn-primary ux4g-btn-md" href="/pending-actions">Back to Pending Actions</Link><Link className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md" href="/">Back to Dashboard</Link></div></section>;

  const activeStep = step === "response" ? 1 : step === "details" ? 2 : 3;
  return <section className="workflow-panel" aria-labelledby="workflow-title">
    <div className="ux4g-stepper ux4g-stepper-horizontal ux4g-stepper-center response-stepper" aria-label={`Step ${activeStep} of 3`}><div className={`ux4g-stepper-step ${activeStep > 1 ? "completed" : "active"}`}>1. Response</div><div className={`ux4g-stepper-step ${activeStep > 2 ? "completed" : activeStep === 2 ? "active" : ""}`}>2. Details</div><div className={`ux4g-stepper-step ${activeStep === 3 ? "active" : ""}`}>3. Review</div></div>
    <p className="response-context">Outstanding Demand · {formatIndianCurrency(demand.amount, demand.currency)} · AY {formatAssessmentYear(demand.assessmentYear)}</p>
    {step === "response" ? <><header className="workflow-heading"><p className="eyebrow">Step 1 of 3</p><h1 id="workflow-title" ref={headingRef} tabIndex={-1}>How do you want to respond?</h1><p>Select one response. Income Tax will record the option you choose.</p></header><fieldset className={`response-options ${errors.choice ? "has-error" : ""}`} aria-describedby={errors.choice ? "choice-error" : undefined}><legend className="visually-hidden">Demand response</legend>{responseOptions.map((option) => <label className="ux4g-radio ux4g-radio-md response-option" key={option.value}><input className="ux4g-radio-input" type="radio" name="response-choice" value={option.value} checked={draft.choice === option.value} onChange={() => update("choice", option.value)} /><span className="ux4g-radio-control"><span className="ux4g-radiomark" /></span><span className="ux4g-radio-content"><strong>{option.title}</strong><small>{option.description}</small></span></label>)}</fieldset>{errors.choice ? <p className="field-error" id="choice-error">{errors.choice}</p> : null}<div className="workflow-actions"><button className="ux4g-btn ux4g-btn-primary ux4g-btn-md" type="button" onClick={continueFromResponse}>Continue</button><Link className="ux4g-btn ux4g-btn-text-neutral ux4g-btn-md" href="/pending-actions/demand">Cancel</Link></div></> : null}
    {step === "details" ? <DetailsStep draft={draft} demand={demand} errors={errors} headingRef={headingRef} update={update} onBack={() => setStep("response")} onContinue={validateDetails} /> : null}
    {step === "review" ? <ReviewStep draft={draft} demand={demand} headingRef={headingRef} onBack={() => setStep("details")} onSubmit={submitResponse} /> : null}
  </section>;
}

function DetailsStep({ draft, demand, errors, headingRef, update, onBack, onContinue }: { draft: ResponseDraft; demand: OutstandingDemand; errors: Errors; headingRef: RefObject<HTMLHeadingElement | null>; update: <K extends keyof ResponseDraft>(field: K, value: ResponseDraft[K]) => void; onBack: () => void; onContinue: () => void }) {
  if (draft.choice === "demand_correct") return <><header className="workflow-heading"><p className="eyebrow">Step 2 of 3</p><h1 id="workflow-title" ref={headingRef} tabIndex={-1}>Payment is the next step</h1><p>You have agreed that the outstanding amount is payable.</p></header><div className="ux4g-card ux4g-card-outline ux4g-card-vertical"><div className="ux4g-card-body"><dl className="review-list"><div><dt>Outstanding amount</dt><dd>{formatIndianCurrency(demand.amount, demand.currency)}</dd></div><div><dt>Assessment Year</dt><dd>{formatAssessmentYear(demand.assessmentYear)}</dd></div></dl></div></div><div className="workflow-actions"><Link className="ux4g-btn ux4g-btn-primary ux4g-btn-md" href="/pending-actions/demand/pay">Continue to payment</Link><button className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md" type="button" onClick={onBack}>Back</button></div></>;
  return <><header className="workflow-heading"><p className="eyebrow">Step 2 of 3</p><h1 id="workflow-title" ref={headingRef} tabIndex={-1}>{draft.choice === "already_paid" ? "Provide payment details" : "Tell us why you disagree"}</h1><p>{draft.choice === "already_paid" ? "Enter the payment information you want recorded with this response." : "Select a reason and enter the amount you dispute."}</p></header>
    {draft.choice === "already_paid" ? <div className="form-grid"><InputField label="Assessment Year" value={formatAssessmentYear(demand.assessmentYear)} readOnly /><InputField label="Amount (₹)" value={draft.paymentAmount} type="number" error={errors.paymentAmount} onChange={(value) => update("paymentAmount", value)} /><InputField label="Payment date" value={formatIndianDate(draft.paymentDate)} readOnly error={errors.paymentDate} /><InputField label="Challan reference" value={draft.challanReference} error={errors.challanReference} onChange={(value) => update("challanReference", value)} /><input type="hidden" name="paymentDate" value={draft.paymentDate} /></div> : <><fieldset className={`reason-options ${errors.disagreementReason ? "has-error" : ""}`} aria-describedby={errors.disagreementReason ? "reason-error" : undefined}><legend>Reason for disagreement</legend>{disagreementReasons.map((reason) => <label className="ux4g-radio ux4g-radio-md" key={reason.value}><input className="ux4g-radio-input" type="radio" name="disagreement-reason" checked={draft.disagreementReason === reason.value} onChange={() => update("disagreementReason", reason.value)} /><span className="ux4g-radio-control"><span className="ux4g-radiomark" /></span><span className="ux4g-radio-content">{reason.label}</span></label>)}</fieldset>{errors.disagreementReason ? <p className="field-error" id="reason-error">{errors.disagreementReason}</p> : null}<div className="form-grid">{draft.disagreementReason === "other" ? <InputField label="Short explanation" value={draft.otherReason} error={errors.otherReason} onChange={(value) => update("otherReason", value)} /> : null}<InputField label="Amount disputed (₹)" value={draft.disputedAmount} type="number" error={errors.disputedAmount} onChange={(value) => update("disputedAmount", value)} /></div></>}
    <div className="workflow-actions"><button className="ux4g-btn ux4g-btn-primary ux4g-btn-md" type="button" onClick={onContinue}>Continue</button><button className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md" type="button" onClick={onBack}>Back</button></div></>;
}

function ReviewStep({ draft, demand, headingRef, onBack, onSubmit }: { draft: ResponseDraft; demand: OutstandingDemand; headingRef: RefObject<HTMLHeadingElement | null>; onBack: () => void; onSubmit: () => void }) {
  const reason = disagreementReasons.find((item) => item.value === draft.disagreementReason)?.label;
  const details = [{ label: "Outstanding Demand", value: formatIndianCurrency(demand.amount, demand.currency) }, { label: "Assessment Year", value: formatAssessmentYear(demand.assessmentYear) }, { label: "Response", value: responseLabels[draft.choice as DemandResponseChoice] }];
  if (draft.choice === "already_paid") details.push({ label: "Payment amount", value: formatIndianCurrency(Number(draft.paymentAmount), demand.currency) }, { label: "Payment date", value: formatIndianDate(draft.paymentDate) }, { label: "Challan reference", value: draft.challanReference });
  if (draft.choice === "disagree") details.push({ label: "Reason", value: draft.disagreementReason === "other" ? draft.otherReason : reason ?? "" }, { label: "Amount disputed", value: formatIndianCurrency(Number(draft.disputedAmount), demand.currency) });
  return <><header className="workflow-heading"><p className="eyebrow">Step 3 of 3</p><h1 id="workflow-title" ref={headingRef} tabIndex={-1}>Review your response</h1><p>Check this information before submitting your response.</p></header><div className="ux4g-card ux4g-card-outline ux4g-card-vertical"><div className="ux4g-card-body"><dl className="review-list">{details.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl></div></div><div className="ux4g-context-alert ux4g-alert-info consequence-message"><strong>Nothing has been submitted yet.</strong></div><div className="workflow-actions"><button className="ux4g-btn ux4g-btn-primary ux4g-btn-md" type="button" onClick={onSubmit}>Confirm and submit</button><button className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md" type="button" onClick={onBack}>Back</button></div></>;
}

function InputField({ label, value, type = "text", readOnly, error, onChange }: { label: string; value: string; type?: string; readOnly?: boolean; error?: string; onChange?: (value: string) => void }) {
  const id = `field-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;
  return <div className={`ux4g-input-container ux4g-input-md ${error ? "ux4g-input-error" : "ux4g-input-default"}`}><label htmlFor={id}>{label}</label><input id={id} type={type} value={value} readOnly={readOnly} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => onChange?.(event.currentTarget.value)} />{error ? <span className="ux4g-input-helper" id={`${id}-error`}>{error}</span> : null}</div>;
}
