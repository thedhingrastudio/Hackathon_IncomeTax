"use client";

import { ChevronDown, Info } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatIndianCurrency, formatRecordLabel } from "@/lib/format-tax";
import type { CurrencyCode } from "@/types/tax";
import type { UnderstandingBindingValue } from "@/lib/ai/understanding-surface";

type SourceItem = { label: string; value: UnderstandingBindingValue; status?: UnderstandingBindingValue };

function toneFor(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("payment") || normalized.includes("26as")) return "complete";
  if (normalized.includes("processed return") || normalized.includes("outstanding demand")) return "action";
  return "neutral";
}

function helpFor(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("payment")) return "The Self-Assessment Tax payment exists and is confirmed.";
  if (normalized.includes("26as")) return "Form 26AS also reflects the payment, confirming that the tax record exists.";
  if (normalized.includes("processed return")) return "This is where the mismatch occurred: the processed return recognised ₹0 of this tax credit.";
  if (normalized.includes("outstanding demand")) return "Because the processed return did not count the payment, the same amount appears as an outstanding demand.";
  return "This record was used to explain the demand.";
}

export default function SourceTrace({ currency, defaultOpen = false, items }: { currency: CurrencyCode; defaultOpen?: boolean; items: SourceItem[] }) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <section className="source-trace" aria-labelledby="source-trace-title">
        <CollapsibleTrigger className="source-trace-trigger">
          <span id="source-trace-title">Why we think this</span><ChevronDown aria-hidden="true" />
        </CollapsibleTrigger>
        <CollapsibleContent className="source-trace-content">
          <p>We checked the records connected to this demand.</p>
          <ol>{items.map((item) => {
            const tone = toneFor(item.label);
            const help = helpFor(item.label);
            return <li key={item.label}>
              <span className={`source-trace-node source-trace-node--${tone}`} aria-hidden="true" />
              <div><strong>{item.label}<span className="source-trace-info" title={help} aria-label={help}><Info aria-hidden="true" /></span></strong><span>{typeof item.value === "number" ? formatIndianCurrency(item.value, currency) : formatRecordLabel(item.value)}</span></div>
              {item.status ? <small className={tone === "action" ? "source-trace-status--action" : undefined}>{typeof item.status === "number" ? formatIndianCurrency(item.status, currency) : formatRecordLabel(item.status)}</small> : null}
            </li>;
          })}</ol>
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
}
