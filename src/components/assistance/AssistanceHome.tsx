import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatIndianCurrency } from "@/lib/format-tax";
import { useTaxDemandCase } from "@/lib/storage/case-storage";
import type { OutstandingDemand } from "@/types/tax";
import AttentionItem from "./AttentionItem";
import ImportantDates from "./ImportantDates";

export default function AssistanceHome({ taxpayerName, demand, onUnderstand }: { taxpayerName: string; demand: OutstandingDemand; onUnderstand: () => void }) {
  const firstName = taxpayerName.split(" ")[0];
  const taxCase = useTaxDemandCase();

  if (taxCase?.state === "WAITING_FOR_REVIEW" && taxCase.rectificationReference && taxCase.demandResponseReference) {
    return <div className="assistance-home assistance-case-review">
      <header className="assistance-home-header">
        <p className="assistance-kicker">Case status</p>
        <h2>Your case is being reviewed</h2>
        <p>Outstanding demand · {formatIndianCurrency(taxCase.demandAmount, taxCase.currency)}</p>
      </header>
      <section className="assistance-case-current" aria-labelledby="assistance-case-current-title">
        <p id="assistance-case-current-title">Waiting for Income Tax review</p>
        <strong>Nothing you need to do right now.</strong>
      </section>
      <dl className="assistance-case-submissions">
        <div><dt><Check aria-hidden="true" />Correction submitted</dt><dd>{taxCase.rectificationReference}</dd></div>
        <div><dt><Check aria-hidden="true" />Demand response submitted</dt><dd>{taxCase.demandResponseReference}</dd></div>
      </dl>
      <Link className={buttonVariants({ className: "assistance-view-case", size: "lg" })} href={`/case/${taxCase.caseId}`}>View case</Link>
    </div>;
  }

  return (
    <div className="assistance-home">
      <header className="assistance-home-header">
        <p className="assistance-kicker">Your Income Tax context</p>
        <h2>Welcome, {firstName}</h2>
        <p>See what needs attention and ask for help without leaving the portal.</p>
      </header>
      <section className="assistance-attention" aria-labelledby="assistance-attention-title">
        <div className="assistance-section-heading">
          <h3 id="assistance-attention-title">Things that need your attention</h3>
          <span>1 item</span>
        </div>
        <AttentionItem demand={demand} onUnderstand={onUnderstand} />
      </section>
      <ImportantDates />
    </div>
  );
}
