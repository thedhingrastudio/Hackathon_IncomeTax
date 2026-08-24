import { ArrowRight } from "lucide-react";
import type { RefObject } from "react";
import { Button } from "@/components/ui/button";
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
      <header className="understanding-header">
        <p className="assistance-kicker">Outstanding demand</p>
        <h2 id="understanding-title" ref={headingRef} tabIndex={-1}>Understanding your demand</h2>
        <p>We found why this is showing.</p>
      </header>
      <div className="understanding-comparison" aria-label="Tax payment comparison">
        <div aria-label={`${paid.label}: ${formatIndianCurrency(Number(paid.value), currency)}, ${formatRecordLabel(String(paid.status))}`}>
          <span>{paid.label}</span><strong>{formatIndianCurrency(Number(paid.value), currency)}</strong><small>{formatRecordLabel(String(paid.status))}</small>
        </div>
        <div aria-label={`${recognised.label}: ${formatIndianCurrency(Number(recognised.value), currency)}`}>
          <span>{recognised.label}</span><strong>{formatIndianCurrency(Number(recognised.value), currency)}</strong><small>Self-Assessment Tax</small>
        </div>
        <p className="understanding-difference"><strong>{formatIndianCurrency(Number(resolved.comparison.difference), currency)}</strong><span>not counted</span></p>
      </div>
      <div className="understanding-explanation">
        <p>Your payment exists in Income Tax records, but it wasn&apos;t included when your return was processed.</p>
        <p>That is why {formatIndianCurrency(understanding.evidence.demand.amount, currency)} is appearing as an outstanding demand.</p>
      </div>
      <Button className="understanding-primary-action" onClick={onFix} size="lg" type="button">{resolved.primaryAction.label}<ArrowRight aria-hidden="true" /></Button>
      <SourceTrace currency={currency} items={resolved.sourceTrace.items} />
    </section>
  );
}
