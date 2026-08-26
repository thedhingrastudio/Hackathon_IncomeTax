import PageHeading from "../../components/portal/PageHeading";
import { PendingDemandCard } from "../../components/portal/CaseAwareDemandCards";
import { getOutstandingDemand } from "../../data/mock";

export default function PendingActionsPage() {
  const demand = getOutstandingDemand();
  return <><PageHeading eyebrow="Account actions" title="Pending Actions" description="These items need something from you before they can move forward." /><PendingDemandCard demand={demand} /><section className="other-action-areas" aria-labelledby="other-actions-title"><div className="section-heading"><div><p className="eyebrow">Other action areas</p><h2 id="other-actions-title">More pending-action services</h2></div></div><ul><li><strong>Worklist</strong><span>No pending items</span></li><li><strong>e-Proceedings</strong><span>No pending items</span></li><li><strong>Compliance Portal</strong><span>External service</span></li></ul></section></>;
}
