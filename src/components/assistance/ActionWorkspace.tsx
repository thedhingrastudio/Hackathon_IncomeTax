import { ArrowRight, Check } from "lucide-react";
import type { RefObject } from "react";
import { Button } from "@/components/ui/button";
import type { DemandUnderstanding } from "@/lib/ai";
import { resolveActionSurface } from "@/lib/ai/action-surface";
import { formatIndianCurrency, formatIndianDate } from "@/lib/format-tax";
import { useTaxDemandCase } from "@/lib/storage/case-storage";

export default function ActionWorkspace({ headingRef, onReview, understanding }: { headingRef: RefObject<HTMLHeadingElement | null>; onReview: () => void; understanding: DemandUnderstanding }) {
  const resolved = resolveActionSurface(understanding.actionSpecification, understanding.evidence);
  const taxCase = useTaxDemandCase();
  const rectificationSubmitted = Boolean(taxCase?.rectificationReference);
  const [correction, response] = resolved.actionPlan.steps;
  return <section className="action-workspace-surface" aria-labelledby="action-workspace-title">
    <header><p className="assistance-kicker">Approved corrective plan</p><h2 id="action-workspace-title" ref={headingRef} tabIndex={-1}>Here&apos;s what needs to happen</h2><p>Two government steps are required, in this order.</p></header>
    <ol className="action-workspace-steps">
      <li className="action-workspace-step is-ready"><span className="action-step-number">01</span><div><h3>{correction.label}</h3><p className="action-step-term">Tax Credit Mismatch Correction</p><div className="action-readiness"><p><Check aria-hidden="true" />{resolved.checklist.label}</p><strong>{formatIndianCurrency(Number(resolved.checklist.amount), understanding.evidence.currency)}</strong><span>{formatIndianDate(String(resolved.checklist.date))} <span aria-hidden="true">·</span> {String(resolved.checklist.paymentType)}</span></div><p className="action-ready-status">Everything required is ready.</p><Button className="understanding-primary-action" onClick={onReview} size="lg" type="button">{resolved.primaryAction.label}<ArrowRight aria-hidden="true" /></Button></div></li>
      <li className={`action-workspace-step ${rectificationSubmitted ? "is-ready" : "is-dependent"}`}><span className="action-step-number">02</span><div><h3>{response.label}</h3><p>{rectificationSubmitted ? "The correction has been submitted." : "Prepared after Step 1."}</p><span className="action-dependency">{rectificationSubmitted ? "Ready for review" : String(resolved.dependency)}</span></div></li>
    </ol>
    <details className="government-process"><summary>Government process</summary><div><p><span>Step 1</span>Rectification <ArrowRight aria-hidden="true" /> Tax Credit Mismatch Correction</p><p><span>Step 2</span>Response to Outstanding Demand</p></div></details>
  </section>;
}
