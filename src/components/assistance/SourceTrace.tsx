"use client";

import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatIndianCurrency, formatRecordLabel } from "@/lib/format-tax";
import type { CurrencyCode } from "@/types/tax";
import type { UnderstandingBindingValue } from "@/lib/ai/understanding-surface";

type SourceItem = { label: string; value: UnderstandingBindingValue; status?: UnderstandingBindingValue };

export default function SourceTrace({ currency, defaultOpen = false, items }: { currency: CurrencyCode; defaultOpen?: boolean; items: SourceItem[] }) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <section className="source-trace" aria-labelledby="source-trace-title">
        <CollapsibleTrigger className="source-trace-trigger">
          <span id="source-trace-title">Why we think this</span><ChevronDown aria-hidden="true" />
        </CollapsibleTrigger>
        <CollapsibleContent className="source-trace-content">
          <p>These connected Income Tax records support the explanation.</p>
          <ol>{items.map((item) => <li key={item.label}>
            <span className="source-trace-node" aria-hidden="true" />
            <div><strong>{item.label}</strong><span>{typeof item.value === "number" ? formatIndianCurrency(item.value, currency) : formatRecordLabel(item.value)}</span></div>
            {item.status ? <small>{typeof item.status === "number" ? formatIndianCurrency(item.status, currency) : formatRecordLabel(item.status)}</small> : null}
          </li>)}</ol>
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
}
