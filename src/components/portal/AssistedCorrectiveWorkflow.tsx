"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatAssessmentYear, formatIndianCurrency, formatIndianDate } from "../../lib/format-tax";
import {
  prepareAssistedDemandResponse,
  submitAssistedDemandResponse,
  submitRectification,
  type AssistedDemandResponseDraft,
  type AssistedDemandResponseSubmission,
  type AssistedWorkflowContext,
  type AssistedWorkflowState,
  type RectificationDraft,
  type RectificationSubmission,
  type WorkflowResult,
} from "../../lib/workflows";

export default function AssistedCorrectiveWorkflow({ context, preparedRectification }: { context: AssistedWorkflowContext; preparedRectification: WorkflowResult<RectificationDraft> }) {
  const [state, setState] = useState<AssistedWorkflowState>("rectification_review");
  const [rectification, setRectification] = useState<RectificationSubmission | null>(null);
  const [responseDraft, setResponseDraft] = useState<AssistedDemandResponseDraft | null>(null);
  const [responseSubmission, setResponseSubmission] = useState<AssistedDemandResponseSubmission | null>(null);
  const [errors, setErrors] = useState<string[]>("errors" in preparedRectification ? preparedRectification.errors : []);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { headingRef.current?.focus(); }, [state]);

  if (!preparedRectification.success) return <ValidationFailure errors={errors} />;
  const draft = preparedRectification.data;

  function confirmRectification() {
    const result = submitRectification(draft, context.evidence, rectification);
    if ("errors" in result) { setErrors(result.errors); return; }
    setRectification(result.data);
    setErrors([]);
    setState("rectification_submitted");
  }

  function reviewDemandResponse() {
    const result = prepareAssistedDemandResponse(context, rectification);
    if ("errors" in result) { setErrors(result.errors); return; }
    setResponseDraft(result.data);
    setErrors([]);
    setState("demand_response_review");
  }

  function confirmDemandResponse() {
    if (!responseDraft) { setErrors(["rectification_required"]); return; }
    const result = submitAssistedDemandResponse(responseDraft, rectification);
    if ("errors" in result) { setErrors(result.errors); return; }
    setResponseSubmission(result.data);
    setErrors([]);
    setState("demand_response_submitted");
  }

  if (errors.length) return <ValidationFailure errors={errors} />;
  if (state === "rectification_review") return <RectificationReview draft={draft} headingRef={headingRef} onSubmit={confirmRectification} />;
  if (state === "rectification_submitted" && rectification) return <RectificationSubmitted draft={draft} submission={rectification} headingRef={headingRef} onContinue={reviewDemandResponse} />;
  if (state === "demand_response_review" && responseDraft) return <DemandResponseReview draft={responseDraft} headingRef={headingRef} onBack={() => setState("rectification_submitted")} onSubmit={confirmDemandResponse} />;
  if (state === "demand_response_submitted" && rectification && responseSubmission) return <Completion rectification={rectification} response={responseSubmission} headingRef={headingRef} />;
  return <ValidationFailure errors={["rectification_required"]} />;
}

function WorkflowHeader({ eyebrow, title, description, headingRef }: { eyebrow: string; title: string; description: string; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  return <header className="workflow-heading"><p className="eyebrow">{eyebrow}</p><h1 ref={headingRef} tabIndex={-1}>{title}</h1><p>{description}</p></header>;
}

function FactsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="ux4g-card ux4g-card-outline ux4g-card-vertical corrective-card" aria-labelledby={`corrective-${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`}><div className="ux4g-card-header"><h2 id={`corrective-${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`}>{title}</h2></div><div className="ux4g-card-body">{children}</div></section>;
}

function RectificationReview({ draft, headingRef, onSubmit }: { draft: RectificationDraft; headingRef: React.RefObject<HTMLHeadingElement | null>; onSubmit: () => void }) {
  return <section className="workflow-panel corrective-workflow" aria-label="Tax credit correction review">
    <WorkflowHeader eyebrow="Step 1 of 2" title="Correct your tax credit" description="We found a Self-Assessment Tax payment that was not included in the processed return." headingRef={headingRef} />
    <FactsCard title="Payment we found"><dl className="review-list"><Fact label="Amount" value={formatIndianCurrency(draft.amount, draft.currency)} /><Fact label="Payment date" value={formatIndianDate(draft.paymentDate)} /><Fact label="Assessment Year" value={formatAssessmentYear(draft.assessmentYear)} /><Fact label="Challan" value={draft.challanReference} /><Fact label="Status" value="Confirmed" /></dl></FactsCard>
    <FactsCard title="Government record"><dl className="review-list"><Fact label="Form 26AS" value={`${formatIndianCurrency(draft.form26asAmount, draft.currency)} reflected`} /><Fact label="Processed return recognised" value={formatIndianCurrency(draft.processedRecognisedAmount, draft.currency)} /></dl></FactsCard>
    <FactsCard title="What this request will do"><p>Ask Income Tax to include this Self-Assessment Tax payment in the processed return for AY {formatAssessmentYear(draft.assessmentYear)}.</p><p className="formal-action-label">Rectification Â· Tax Credit Mismatch Correction</p></FactsCard>
    <div className="ux4g-context-alert ux4g-alert-info consequence-message" role="note"><strong>Nothing has been submitted yet.</strong><p>You are requesting a Tax Credit Mismatch Correction for {formatIndianCurrency(draft.amount, draft.currency)} using challan {draft.challanReference} because the payment was missing from the processed return.</p></div>
    <div className="workflow-actions"><button className="ux4g-btn ux4g-btn-primary ux4g-btn-md" type="button" onClick={onSubmit}>Confirm and submit correction</button><Link className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md" href="/pending-actions/demand/assist">Back</Link></div>
  </section>;
}

function RectificationSubmitted({ draft, submission, headingRef, onContinue }: { draft: RectificationDraft; submission: RectificationSubmission; headingRef: React.RefObject<HTMLHeadingElement | null>; onContinue: () => void }) {
  return <section className="workflow-panel corrective-workflow" aria-label="Correction submitted">
    <div className="ux4g-alert ux4g-alert-success response-success" role="status"><div><h1 ref={headingRef} tabIndex={-1}>Correction submitted</h1><p>Your correction request has been recorded.</p></div></div>
    <FactsCard title="Submitted correction"><dl className="review-list"><Fact label="Reference" value={submission.reference} /><Fact label="Assessment Year" value={formatAssessmentYear(submission.assessmentYear)} /><Fact label="Correction" value="Tax Credit Mismatch" /><Fact label="Amount" value={formatIndianCurrency(submission.amount, draft.currency)} /><Fact label="Status" value="Submitted" /></dl></FactsCard>
    <section className="next-action" aria-labelledby="next-action-title"><h2 id="next-action-title">Next: respond to the demand</h2><p>Now that the correction request exists, you can respond to the {formatIndianCurrency(draft.amount, draft.currency)} outstanding demand.</p><button className="ux4g-btn ux4g-btn-primary ux4g-btn-md" type="button" onClick={onContinue}>Review demand response</button></section>
  </section>;
}

function DemandResponseReview({ draft, headingRef, onBack, onSubmit }: { draft: AssistedDemandResponseDraft; headingRef: React.RefObject<HTMLHeadingElement | null>; onBack: () => void; onSubmit: () => void }) {
  return <section className="workflow-panel corrective-workflow" aria-label="Assisted demand response review">
    <WorkflowHeader eyebrow="Step 2 of 2" title="Respond to the outstanding demand" description={`A correction request has been submitted for the ${formatIndianCurrency(draft.demandAmount, draft.currency)} tax payment that was not included in your processed return.`} headingRef={headingRef} />
    <FactsCard title="Response"><dl className="review-list"><Fact label="Demand" value={formatIndianCurrency(draft.demandAmount, draft.currency)} /><Fact label="Assessment Year" value={formatAssessmentYear(draft.assessmentYear)} /><Fact label="Response" value="I disagree with this demand" /><Fact label="Reason" value="Tax payment / tax credit has not been considered" /><Fact label="Amount disputed" value={formatIndianCurrency(draft.disputedAmount, draft.currency)} /><Fact label="Related correction" value={draft.rectificationReference} /></dl></FactsCard>
    <div className="ux4g-context-alert ux4g-alert-info consequence-message" role="note"><strong>Nothing has been submitted yet.</strong><p>You are confirming this response and the full disputed amount shown above.</p></div>
    <div className="workflow-actions"><button className="ux4g-btn ux4g-btn-primary ux4g-btn-md" type="button" onClick={onSubmit}>Confirm and submit response</button><button className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md" type="button" onClick={onBack}>Back</button></div>
  </section>;
}

function Completion({ rectification, response, headingRef }: { rectification: RectificationSubmission; response: AssistedDemandResponseSubmission; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  return <section className="workflow-panel corrective-workflow" aria-label="Assisted corrective workflow complete">
    <div className="ux4g-alert ux4g-alert-success response-success" role="status"><div><h1 ref={headingRef} tabIndex={-1}>Your requests have been submitted</h1><p>Income Tax still needs to review these requests.</p></div></div>
    <FactsCard title="Submitted requests"><ul className="submission-summary"><li><span aria-hidden="true">âœ“</span><div><strong>Tax credit correction</strong><span>{rectification.reference}</span></div></li><li><span aria-hidden="true">âœ“</span><div><strong>Demand response</strong><span>{response.reference}</span></div></li></ul><p className="supporting-text">The outstanding demand has not been marked as resolved.</p></FactsCard>
    <div className="workflow-actions"><Link className="ux4g-btn ux4g-btn-primary ux4g-btn-md" href="/">Back to Dashboard</Link><Link className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md" href="/pending-actions/demand">View demand details</Link></div>
  </section>;
}

function Fact({ label, value }: { label: string; value: string }) { return <div><dt>{label}</dt><dd>{value}</dd></div>; }

function ValidationFailure({ errors }: { errors: string[] }) {
  return <section className="workflow-panel"><div className="ux4g-alert ux4g-alert-warning" role="alert"><div><h1>We could not verify this request</h1><p>Some required payment or tax-record information could not be verified, so nothing has been submitted.</p>{errors.length ? <p className="supporting-text">Verification code: {errors.join(", ")}</p> : null}</div></div><div className="workflow-actions"><Link className="ux4g-btn ux4g-btn-primary ux4g-btn-md" href="/pending-actions/demand/assist">Back to explanation</Link><Link className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md" href="/pending-actions/demand">View demand records</Link></div></section>;
}
