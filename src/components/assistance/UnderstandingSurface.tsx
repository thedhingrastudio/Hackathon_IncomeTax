import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { RefObject } from "react";
import { formatIndianCurrency, formatRecordLabel } from "@/lib/format-tax";
import type { DemandUnderstanding } from "@/lib/ai";
import { resolveUnderstandingSurface } from "@/lib/ai/understanding-surface";
import SourceTrace from "./SourceTrace";

export default function UnderstandingSurface({ understanding, headingRef, onFix }: { understanding: DemandUnderstanding; headingRef: RefObject<HTMLHeadingElement | null>; onFix: () => void }) {
  const resolved = resolveUnderstandingSurface(understanding.specification, understanding.evidence);
  const [paid, recognised] = resolved.comparison.items;
  const currency = understanding.evidence.currency;

  return (
    <section className="understanding-surface" aria-labelledby="understanding-title">
      <div className="civic-generated-hero"><header className="understanding-header">
        <p className="assistance-kicker"><span className="assistance-desktop-copy">Income Tax services</span><span className="assistance-mobile-copy">Outstanding demand</span></p>
        <h2 id="understanding-title" ref={headingRef} tabIndex={-1}><span className="assistance-desktop-copy">Resolve your outstanding tax demand</span><span className="assistance-mobile-copy">Your payment was found.</span></h2>
        <p>We checked the records connected to this demand and assembled the safest path to resolve the mismatch.</p>
      </header><div className="civic-generated-art"><Image alt="Tax records connected to this demand" fill priority sizes="280px" src="/assets/civic/tax-records.webp" unoptimized /></div></div>
      <div className="civic-generated-assurances"><p><strong>Secure and official</strong><span>Your records stay protected</span></p><p><strong>About 10 minutes</strong><span>Review at your own pace</span></p><p><strong>You stay in control</strong><span>Nothing submits without you</span></p></div>
      <div className="civic-eligibility"><strong>Your payment record is eligible for correction</strong><span>₹18,420 is confirmed in Form 26AS but missing from the processed return.</span></div>
      <div className="understanding-comparison" aria-label="Tax payment comparison">
        <div aria-label={`${paid.label}: ${formatIndianCurrency(Number(paid.value), currency)}, ${formatRecordLabel(String(paid.status))}`}>
          <span>{paid.label}</span><strong>{formatIndianCurrency(Number(paid.value), currency)}</strong><small>{formatRecordLabel(String(paid.status))}</small>
        </div>
        <div aria-label={`${recognised.label}: ${formatIndianCurrency(Number(recognised.value), currency)}`}>
          <span>{recognised.label}</span><strong>{formatIndianCurrency(Number(recognised.value), currency)}</strong><small>Self-Assessment Tax</small>
        </div>
        <p className="understanding-difference"><strong>{formatIndianCurrency(Number(resolved.comparison.difference), currency)}</strong><span><span className="assistance-desktop-copy">not counted</span><span className="assistance-mobile-copy">wasn&apos;t counted</span></span></p>
      </div>
      <div className="understanding-explanation">
        <p>Your payment exists in Income Tax records, but it wasn&apos;t included when your return was processed.</p>
        <p className="understanding-detail">That is why {formatIndianCurrency(understanding.evidence.demand.amount, currency)} is appearing as an outstanding demand.</p>
      </div>
      <Link className="app-action app-action-primary understanding-primary-action" href="/pending-actions/demand/workspace/action" onClick={(event) => { event.preventDefault(); onFix(); }}>{resolved.primaryAction.label}<ArrowRight aria-hidden="true" /></Link>
      <SourceTrace currency={currency} items={resolved.sourceTrace.items} />
    </section>
  );
}
