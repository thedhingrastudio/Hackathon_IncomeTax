import { Check } from "lucide-react";
import type { RefObject } from "react";
import type { EvidencePacket } from "@/lib/reconciliation/evidence-packet";
import { formatAssessmentYear, formatIndianCurrency } from "@/lib/format-tax";

const records = ["Self-Assessment Tax payment", "Form 26AS", "Processed return", "Processing result", "Outstanding demand"];

export default function CheckingRecords({ evidence, headingRef }: { evidence: EvidencePacket; headingRef: RefObject<HTMLHeadingElement | null> }) {
  return (
    <section className="assistance-checking" aria-labelledby="assistance-checking-title" aria-live="polite">
      <header>
        <p className="assistance-kicker">Outstanding demand</p>
        <p className="assistance-context-line">{formatIndianCurrency(evidence.demand.amount, evidence.currency)} · AY {formatAssessmentYear(evidence.assessmentYear)}</p>
        <p>Income Tax is waiting for your response.</p>
        <h2 id="assistance-checking-title" ref={headingRef} tabIndex={-1}>Checking why this is showing…</h2>
      </header>
      <div className="assistance-record-checks" role="status">
        <p>Checking records connected to this demand</p>
        <ul>{records.map((record) => <li key={record}><span>{record}</span><Check aria-label="Checked" /></li>)}</ul>
      </div>
    </section>
  );
}
