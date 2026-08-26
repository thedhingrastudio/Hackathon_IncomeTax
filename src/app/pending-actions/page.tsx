import PageHeading from "../../components/portal/PageHeading";
import RecordDetails from "../../components/portal/RecordDetails";
import CaseAwareDemandProgress from "../../components/portal/CaseAwareDemandProgress";
import CaseStateLabel from "../../components/portal/CaseStateLabel";
import { getOutstandingDemand } from "../../data/mock";
import { formatAssessmentYear, formatIndianCurrency, formatIndianDate } from "../../lib/format-tax";

export default function PendingActionsPage() {
  const demand = getOutstandingDemand();
  return <><PageHeading eyebrow="Account actions" title="Pending Actions" description="These items need something from you before they can move forward." /><section className="portal-surface demand-card" aria-labelledby="pending-demand-title"><div className="portal-surface__header demand-card__header"><div><p className="eyebrow">Outstanding Demand</p><h2 id="pending-demand-title">{formatIndianCurrency(demand.amount, demand.currency)}</h2></div><CaseStateLabel /></div><div className="portal-surface__body demand-card__body"><RecordDetails details={[{ label: "Assessment Year", value: formatAssessmentYear(demand.assessmentYear) }, { label: "Created on", value: formatIndianDate(demand.createdOn) }, { label: "Next step", value: "Review and respond" }]} /></div><div className="demand-card__progress"><CaseAwareDemandProgress fallbackHref="/pending-actions/demand" fallbackLabel="Review demand" horizontal /></div></section><section className="other-action-areas" aria-labelledby="other-actions-title"><div className="section-heading"><div><p className="eyebrow">Other action areas</p><h2 id="other-actions-title">More pending-action services</h2></div></div><ul><li><strong>Worklist</strong><span>No pending items</span></li><li><strong>e-Proceedings</strong><span>No pending items</span></li><li><strong>Compliance Portal</strong><span>External service</span></li></ul></section></>;
}
