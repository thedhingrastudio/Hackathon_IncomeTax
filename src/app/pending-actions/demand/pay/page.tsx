import Link from "next/link";
import PageHeading from "../../../../components/portal/PageHeading";
import RecordDetails from "../../../../components/portal/RecordDetails";
import { getOutstandingDemand } from "../../../../data/mock";
import { formatAssessmentYear, formatIndianCurrency } from "../../../../lib/format-tax";

export default function DemandPaymentPage() {
  const demand = getOutstandingDemand();
  return <><PageHeading eyebrow="Outstanding Demand" title="Payment service unavailable" description="Payment service is unavailable in this demo environment." backHref="/pending-actions/demand" backLabel="Outstanding Demand" /><div className="portal-alert portal-alert--info"><strong>No payment has been made.</strong></div><section className="portal-surface payment-unavailable-card" aria-label="Demand payment details"><div className="portal-surface__body"><RecordDetails details={[{ label: "Outstanding amount", value: formatIndianCurrency(demand.amount, demand.currency) }, { label: "Assessment Year", value: formatAssessmentYear(demand.assessmentYear) }, { label: "Demand reference", value: demand.demandId }]} /></div></section><Link className="app-action app-action-primary" href="/pending-actions/demand">Back to demand</Link></>;
}
