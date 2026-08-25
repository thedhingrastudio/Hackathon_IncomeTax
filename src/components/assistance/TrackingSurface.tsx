"use client";

import Link from "next/link";
import { Check, Circle } from "lucide-react";
import type { RefObject } from "react";
import { buttonVariants } from "@/components/ui/button";
import { formatIndianCurrency } from "@/lib/format-tax";
import { useTaxDemandCase } from "@/lib/storage/case-storage";
import { createCaseTimeline } from "@/lib/workflows";

export default function TrackingSurface({ headingRef }: { headingRef: RefObject<HTMLHeadingElement | null> }) {
  const taxCase = useTaxDemandCase();
  if (!taxCase || taxCase.state !== "WAITING_FOR_REVIEW" || !taxCase.rectificationReference || !taxCase.demandResponseReference) return null;
  const timeline = createCaseTimeline(taxCase);

  return <section aria-labelledby="assistance-tracking-title" className="assistance-tracking">
    <header className="assistance-tracking-header"><p className="assistance-kicker">Outstanding demand · {formatIndianCurrency(taxCase.demandAmount, taxCase.currency)}</p><h2 id="assistance-tracking-title" ref={headingRef} tabIndex={-1}>Waiting for Income Tax review</h2><p>Nothing you need to do right now.</p></header>
    <ol aria-label="Case progress" className="assistance-timeline">{timeline.items.map((item) => <li aria-current={item.status === "current" ? "step" : undefined} className={`is-${item.status}`} key={item.id}><span className="assistance-timeline-marker" aria-hidden="true">{item.status === "complete" ? <Check /> : <Circle />}</span><div><strong>{item.title}</strong>{item.description ? <span>{item.description}</span> : null}<span className="sr-only">{item.status === "complete" ? "Completed" : item.status === "current" ? "Current step" : "Future step"}</span></div></li>)}</ol>
    <section className="assistance-next-step" aria-labelledby="assistance-next-step-title"><h3 id="assistance-next-step-title">What happens next</h3><p>Income Tax will review the correction and your response to the outstanding demand.</p><p>If accepted, the processed tax credit and demand can be updated.</p></section>
    <Link className={buttonVariants({ className: "assistance-view-case", size: "lg" })} href={`/case/${taxCase.caseId}`}>View full case</Link>
  </section>;
}
