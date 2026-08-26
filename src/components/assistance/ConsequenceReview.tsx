import { Check, Info } from "lucide-react";
import type { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { formatAssessmentYear, formatIndianCurrency, formatIndianDate } from "@/lib/format-tax";
import type { AssistedDemandResponseDraft, AssistedDemandResponseSubmission, RectificationDraft, RectificationSubmission } from "@/lib/workflows";

function ReviewHeader({ eyebrow, id, title, description, headingRef }: { eyebrow: string; id: string; title: string; description: string; headingRef: RefObject<HTMLHeadingElement | null> }) {
  return <header className="consequence-review-header"><p className="assistance-kicker">{eyebrow}</p><h2 id={id} ref={headingRef} tabIndex={-1}>{title}</h2><p>{description}</p></header>;
}

function Fact({ label, value, highlight = false, help }: { label: string; value: string; highlight?: boolean; help?: string }) {
  return <div className={highlight ? "fact-highlight" : undefined}><dt><span className="fact-label-row">{label}{help ? <span className="fact-help" title={help} aria-label={help}><Info aria-hidden="true" /></span> : null}</span></dt><dd>{value}</dd></div>;
}

function ConsequenceNotice() {
  return <div className="consequence-review-notice" role="note"><strong>Nothing has been submitted yet.</strong><p>Review the government request below before you confirm.</p></div>;
}

export function RectificationReview({ draft, headingRef, onBack, onConfirm }: { draft: RectificationDraft; headingRef: RefObject<HTMLHeadingElement | null>; onBack: () => void; onConfirm: () => void }) {
  return <section aria-labelledby="rectification-review-title" className="consequence-review">
    <ReviewHeader eyebrow="Step 1 of 2" id="rectification-review-title" title="Review correction" description="You're asking Income Tax to include this payment in your processed return." headingRef={headingRef} />
    <dl className="consequence-review-facts">
      <Fact label="Amount" value={formatIndianCurrency(draft.amount, draft.currency)} />
      <Fact label="Assessment Year" value={formatAssessmentYear(draft.assessmentYear)} />
      <Fact label="Payment date" value={formatIndianDate(draft.paymentDate)} />
      <Fact label="Payment type" value="Self-Assessment Tax" />
      <Fact label="Challan added" value={draft.challanReference} highlight help="This challan proves the ₹18,420 payment. It is being added because the processed return did not count that payment as tax credit." />
    </dl>
    <section className="government-request" aria-labelledby="government-request-title"><p className="assistance-kicker">Government request</p><h3 id="government-request-title">Correct tax-credit details</h3><p>Tax Credit Mismatch Correction</p></section>
    <ConsequenceNotice />
    <div className="consequence-review-actions"><Button className="app-action app-action-primary consequence-primary-action" size="lg" type="button" onClick={onConfirm}>Confirm and submit correction</Button><Button className="app-action app-action-tertiary consequence-back-action" size="lg" type="button" variant="ghost" onClick={onBack}>Back</Button></div>
  </section>;
}

export function DemandResponseReview({ draft, headingRef, onBack, onConfirm }: { draft: AssistedDemandResponseDraft; headingRef: RefObject<HTMLHeadingElement | null>; onBack: () => void; onConfirm: () => void }) {
  return <section aria-labelledby="demand-response-review-title" className="consequence-review">
    <ReviewHeader eyebrow="Step 2 of 2" id="demand-response-review-title" title="Review demand response" description="Review the response that will be sent for this outstanding demand." headingRef={headingRef} />
    <dl className="consequence-review-facts">
      <Fact label="Response" value="I disagree with this demand" />
      <Fact label="Reason" value="Rectification / Revised Return filed at CPC" />
      <Fact label="Amount disputed" value={formatIndianCurrency(draft.disputedAmount, draft.currency)} />
      <Fact label="Related rectification" value={draft.rectificationReference} highlight help="This response points to the tax-credit correction you already submitted, so Income Tax can review the demand together with the corrected payment record." />
      <Fact label="Assessment Year" value={formatAssessmentYear(draft.assessmentYear)} />
    </dl>
    <ConsequenceNotice />
    <div className="consequence-review-actions"><Button className="app-action app-action-primary consequence-primary-action" size="lg" type="button" onClick={onConfirm}>Confirm and submit response</Button><Button className="app-action app-action-tertiary consequence-back-action" size="lg" type="button" variant="ghost" onClick={onBack}>Back</Button></div>
  </section>;
}

export function DemandResponseSubmitted({ headingRef, onViewCase, rectification, response }: { headingRef: RefObject<HTMLHeadingElement | null>; onViewCase: () => void; rectification: RectificationSubmission; response: AssistedDemandResponseSubmission }) {
  return <section aria-labelledby="response-submitted-title" className="consequence-review submission-result">
    <span className="submission-result-icon" aria-hidden="true"><Check /></span>
    <ReviewHeader eyebrow="Submitted" id="response-submitted-title" title="Response submitted" description="Income Tax review is pending. The outstanding demand has not been marked as resolved." headingRef={headingRef} />
    <dl className="consequence-review-facts"><Fact label="Demand response" value={response.reference} /><Fact label="Related rectification" value={rectification.reference} highlight /><Fact label="Status" value="Waiting for Income Tax review" /></dl>
    <Button className="app-action app-action-secondary submission-view-case" onClick={onViewCase} size="lg" type="button">View case status</Button>
  </section>;
}
