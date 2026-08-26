import { ArrowRight, Check, ChevronDown } from "lucide-react";
import type { RefObject } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { DemandUnderstanding } from "@/lib/ai";
import { resolveActionSurface } from "@/lib/ai/action-surface";
import { formatIndianCurrency, formatIndianDate } from "@/lib/format-tax";
import { useTaxDemandCase } from "@/lib/storage/case-storage";

export default function ActionWorkspace({ headingRef, onReview, onReviewResponse, understanding }: { headingRef: RefObject<HTMLHeadingElement | null>; onReview: () => void; onReviewResponse: () => void; understanding: DemandUnderstanding }) {
  const [processOpen, setProcessOpen] = useState(false);
  const resolved = resolveActionSurface(understanding.actionSpecification, understanding.evidence);
  const taxCase = useTaxDemandCase();
  const rectificationSubmitted = Boolean(taxCase?.rectificationReference);

  return <section className="action-workspace-surface" aria-labelledby="action-workspace-title">
    <header><p className="assistance-kicker">{rectificationSubmitted ? "Next step" : "Next steps"}</p><h2 id="action-workspace-title" ref={headingRef} tabIndex={-1}>{rectificationSubmitted ? "One step left" : "Here's what to do next"}</h2><p>{rectificationSubmitted ? "Your correction has been submitted. Now respond to the outstanding demand." : "Two steps are needed. You'll review each one before anything is submitted."}</p></header>
    <ol className="action-workspace-steps">
      <li className="action-workspace-step is-ready"><span className="action-step-number">01</span><div><h3>{rectificationSubmitted ? "Correction submitted" : "Add the missing payment to your return"}</h3>{rectificationSubmitted ? <div className="action-submitted-state"><p><Check aria-hidden="true" />Submitted</p><strong>{taxCase?.rectificationReference}</strong></div> : <><p className="action-step-term">Tax Credit Mismatch Correction</p><div className="action-readiness"><p><Check aria-hidden="true" />Payment to add</p><strong>{formatIndianCurrency(Number(resolved.checklist.amount), understanding.evidence.currency)}</strong><span>{formatIndianDate(String(resolved.checklist.date))} <span aria-hidden="true">·</span> Self-Assessment Tax</span></div><p className="action-ready-status">Ready to review.</p><Button className="app-action app-action-primary understanding-primary-action" onClick={onReview} size="lg" type="button">Review correction<ArrowRight aria-hidden="true" /></Button></>}</div></li>
      <li className={`action-workspace-step ${rectificationSubmitted ? "is-ready" : "is-dependent"}`}><span className="action-step-number">02</span><div><h3>Respond to the outstanding demand</h3><p>{rectificationSubmitted ? "Tell Income Tax you disagree because a correction has already been filed." : "Tell Income Tax you disagree after the correction is submitted."}</p><span className="action-dependency">{rectificationSubmitted ? "Ready to review" : "Next after Step 1"}</span>{rectificationSubmitted ? <Button className="app-action app-action-primary action-secondary-action" onClick={onReviewResponse} size="lg" type="button">Review response<ArrowRight aria-hidden="true" /></Button> : null}</div></li>
    </ol>
    <section className={`government-process ${processOpen ? "is-open" : ""}`}><button aria-expanded={processOpen} className="government-process-trigger" onClick={() => setProcessOpen((open) => !open)} type="button"><span><strong>Official government process</strong><small>2 steps</small></span><span className="government-process-action"><span>{processOpen ? "Hide process" : "View process"}</span><ChevronDown aria-hidden="true" /></span></button><div aria-hidden={!processOpen} className="government-process-reveal"><div><p><span>Step 1</span><strong>Rectification</strong><small>Tax Credit Mismatch Correction</small></p><p><span>Step 2</span><strong>Outstanding Demand</strong><small>Submit response</small></p></div></div></section>
  </section>;
}
