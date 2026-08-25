import Link from "next/link";
import CaseAwareDemandProgress from "../components/portal/CaseAwareDemandProgress";
import { getOutstandingDemand, getProcessingResult, getTaxPayment, getTaxReturn } from "../data/mock";
import { formatAssessmentYear, formatIndianCurrency, formatIndianDate, formatRecordLabel } from "../lib/format-tax";

const shortcuts = [["File or view return", "/returns"], ["Payments & Tax Records", "/payments"], ["Pending Actions", "/pending-actions"], ["Services", "/services"]] as const;

export default function Home() {
  const demand = getOutstandingDemand();
  const payment = getTaxPayment();
  const taxReturn = getTaxReturn();
  const processing = getProcessingResult();
  const assessmentYear = formatAssessmentYear(demand.assessmentYear);
  const [startYear] = demand.assessmentYear.split("-").map(Number);
  const financialYear = `${startYear - 1}–${String(startYear).slice(-2)}`;
  return <div className="professional-dashboard">
    <header className="portal-page-intro"><p className="eyebrow">Account overview</p><h1>Dashboard</h1><p>FY {financialYear} <span aria-hidden="true">·</span> AY {assessmentYear}</p></header>
    <div className="dashboard-workspace">
      <section className="professional-section pending-action-panel" aria-labelledby="attention-title"><div className="professional-section__heading"><div><p className="eyebrow">Pending actions</p><h2 id="attention-title">Outstanding Demand</h2></div><span className="portal-status portal-status--warning"><span className="portal-status__icon" aria-hidden="true">!</span><strong>{formatRecordLabel(demand.status)}</strong></span></div><div className="pending-action-summary"><div><strong>{formatIndianCurrency(demand.amount, demand.currency)}</strong><span>AY {assessmentYear}</span></div><dl><div><dt>Status</dt><dd>Response pending</dd></div><div><dt>Demand reference</dt><dd>{demand.demandId}</dd></div></dl><CaseAwareDemandProgress fallbackHref="/pending-actions/demand" fallbackLabel="View demand" /></div></section>
      <section className="professional-section" aria-labelledby="account-status-title"><div className="professional-section__heading"><div><p className="eyebrow">Tax year</p><h2 id="account-status-title">Account status</h2></div></div><dl className="status-overview"><div><dt>Return</dt><dd>{formatRecordLabel(taxReturn.filingStatus)}</dd></div><div><dt>Self-Assessment Tax</dt><dd>{formatIndianCurrency(payment.amount, payment.currency)} paid</dd></div><div><dt>Outstanding Demand</dt><dd>{formatIndianCurrency(demand.amount, demand.currency)}</dd></div></dl></section>
      <section className="professional-section dashboard-activity" aria-labelledby="activity-title"><div className="professional-section__heading"><div><p className="eyebrow">Records</p><h2 id="activity-title">Recent activity</h2></div></div><ul className="activity-list"><li><time dateTime={processing.processedOn}>{formatIndianDate(processing.processedOn)}</time><span><strong>Return processed</strong><small>{processing.processingId}</small></span><span>{formatRecordLabel(processing.status)}</span></li><li><time dateTime={taxReturn.filedOn}>{formatIndianDate(taxReturn.filedOn)}</time><span><strong>Income Tax Return filed</strong><small>AY {assessmentYear}</small></span><span>{formatRecordLabel(taxReturn.filingStatus)}</span></li><li><time dateTime={payment.paymentDate}>{formatIndianDate(payment.paymentDate)}</time><span><strong>Self-Assessment Tax payment</strong><small>{payment.challanReference}</small></span><span>{formatIndianCurrency(payment.amount, payment.currency)}</span></li></ul></section>
      <section className="professional-section dashboard-quick-access" aria-labelledby="quick-access-title"><div className="professional-section__heading"><div><p className="eyebrow">Services</p><h2 id="quick-access-title">Quick access</h2></div></div><nav aria-label="Quick access"><ul>{shortcuts.map(([label, href]) => <li key={href}><Link href={href}>{label}<span aria-hidden="true">→</span></Link></li>)}</ul></nav></section>
    </div>
  </div>;
}
