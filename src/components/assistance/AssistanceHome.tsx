import type { OutstandingDemand } from "@/types/tax";
import AttentionItem from "./AttentionItem";
import ImportantDates from "./ImportantDates";

export default function AssistanceHome({ taxpayerName, demand, onUnderstand }: { taxpayerName: string; demand: OutstandingDemand; onUnderstand: () => void }) {
  const firstName = taxpayerName.split(" ")[0];

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
