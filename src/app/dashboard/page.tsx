import GenerativeDashboard from "../../components/portal/GenerativeDashboard";
import { getOutstandingDemand, getTaxpayer } from "../../data/mock";
import { formatAssessmentYear, formatIndianCurrency } from "../../lib/format-tax";

export default function DashboardPage() {
  const taxpayer = getTaxpayer();
  const demand = getOutstandingDemand();

  return (
    <GenerativeDashboard
      assessmentYear={formatAssessmentYear(demand.assessmentYear)}
      demandAmount={formatIndianCurrency(demand.amount, demand.currency)}
      taxpayerName={taxpayer.name}
    />
  );
}
