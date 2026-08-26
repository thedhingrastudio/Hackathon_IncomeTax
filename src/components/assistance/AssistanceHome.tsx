import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTaxDemandCase } from "@/lib/storage/case-storage";
import type { OutstandingDemand } from "@/types/tax";
import AttentionItem from "./AttentionItem";
import UpcomingReminders from "./UpcomingReminders";

export default function AssistanceHome({ demand, onUnderstand, onViewCase }: { taxpayerName: string; demand: OutstandingDemand; onUnderstand: () => void; onViewCase: () => void }) {
  const taxCase = useTaxDemandCase();
  const waitingForReview = taxCase?.state === "WAITING_FOR_REVIEW" && Boolean(taxCase.rectificationReference && taxCase.demandResponseReference);

  if (waitingForReview && taxCase?.rectificationReference && taxCase.demandResponseReference) {
    return <div className="assistance-home assistance-case-review">
      <header className="assistance-home-header">
        <p className="assistance-kicker">Assistance</p>
        <h2>Your case is being reviewed</h2>
        <p>Nothing you need to do right now.</p>
      </header>
      <section className="assistance-case-current" aria-labelledby="assistance-case-current-title">
        <p id="assistance-case-current-title">Waiting for Income Tax review</p>
        <dl className="assistance-case-submissions">
          <div><dt><Check aria-hidden="true" />Tax-credit correction submitted</dt><dd>{taxCase.rectificationReference}</dd></div>
          <div><dt><Check aria-hidden="true" />Demand response submitted</dt><dd>{taxCase.demandResponseReference}</dd></div>
        </dl>
        <Button className="assistance-inline-action assistance-view-case" onClick={onViewCase} type="button" variant="link">View case <ArrowRight aria-hidden="true" /></Button>
      </section>
      <UpcomingReminders waitingForReview />
    </div>;
  }

  return <div className="assistance-home">
    <header className="assistance-home-header">
      <p className="assistance-kicker">Assistance</p>
      <h2>1 item needs your attention</h2>
      <p>Review what needs attention or ask about your Income Tax account.</p>
    </header>
    <section className="assistance-attention" aria-labelledby="assistance-attention-title">
      <h3 className="visually-hidden" id="assistance-attention-title">Outstanding demand requiring attention</h3>
      <AttentionItem demand={demand} onUnderstand={onUnderstand} />
    </section>
    <UpcomingReminders />
  </div>;
}
