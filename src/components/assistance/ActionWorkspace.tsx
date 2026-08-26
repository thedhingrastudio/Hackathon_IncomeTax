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
  const [correction, response] = resolved.actionPlan.steps;
  return <section className="action-workspace-surface" aria-labelledby="action-workspace-title">
    <header><p className="assistance-kicker">Corrective plan</p><h2 id="action-workspace-title" ref={headingRef} tabIndex={-1}><span className="assistance-desktop-copy">Here&apos;s what needs to happen</span><span className="assistance-mobile-copy">What happens next</span></h2><p><span className="assistance-desktop-copy">Two government steps are required, in this order.</span><span className="assistance-mobile-copy">Two steps, in this order.</span></p></header>
    <ol className="action-workspace-steps">
      <li className="action-workspace-step is-ready"><span className="action-step-number">01</span><div><h3>{correction.label}</h3><p className="action-step-term">Tax Credit Mismatch Correction</p>{rectificationSubmitted ? <div className="action-submitted-state"><p><Check aria-hidden="true" />Submitted</p><strong>{taxCase?.rectificationReference}</strong></div> : <><div className="action-readiness"><p><Check aria-hidden="true" />{resolved.checklist.label}</p><strong>{formatIndianCurrency(Number(resolved.checklist.amount), understanding.evidence.currency)}</strong><span>{formatIndianDate(String(resolved.checklist.date))} <span aria-hidden="true">·</span> {String(resolved.checklist.paymentType)}</span></div><p className="action-ready-status">Everything required is ready.</p><Button className="app-action app-action-primary understanding-primary-action" onClick={onReview} size="lg" type="button">{resolved.primaryAction.label}<ArrowRight aria-hidden="true" /></Button></>}</div></li>
      <li className={`action-workspace-step ${rectificationSubmitted ? "is-ready" : "is-dependent"}`}><span className="action-step-number">02</span><div><h3>{response.label}</h3><p>{rectificationSubmitted ? "The correction has been submitted." : <><span className="assistance-desktop-copy">Prepared after Step 1.</span><span className="assistance-mobile-copy">Starts after Step 1.</span></>}</p><span className="action-dependency">{rectificationSubmitted ? "Ready for review" : String(resolved.dependency)}</span>{rectificationSubmitted ? <Button className="app-action app-action-primary action-secondary-action" onClick={onReviewResponse} size="lg" type="button">Review response<ArrowRight aria-hidden="true" /></Button> : null}</div></li>
    </ol>
    <section className={`government-process ${processOpen ? "is-open" : ""}`}><button aria-expanded={processOpen} className="government-process-trigger" onClick={() => setProcessOpen((open) => !open)} type="button"><span><strong>Official government process</strong><small>2 steps</small></span><span className="government-process-action"><span>{processOpen ? "Hide process" : "View process"}</span><ChevronDown aria-hidden="true" /></span></button><div aria-hidden={!processOpen} className="government-process-reveal"><div><p><span>Step 1</span><strong>Rectification</strong><small>Tax Credit Mismatch Correction</small></p><p><span>Step 2</span><strong>Outstanding Demand</strong><small>Submit response</small></p></div></div></section>
  </section>;
}
