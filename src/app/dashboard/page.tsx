import Link from "next/link";
import { ArrowRight, Check, CircleAlert, FileCheck2, ReceiptText, UserRound } from "lucide-react";
import CaseAwareDemandProgress from "../../components/portal/CaseAwareDemandProgress";
import { getOutstandingDemand, getProcessingResult, getTaxPayment, getTaxpayer, getTaxReturn } from "../../data/mock";
import { formatAssessmentYear, formatIndianCurrency, formatIndianDate, formatIndianShortDate, formatRecordLabel } from "../../lib/format-tax";

const serviceGroups = [
  { label: "Your tax", links: [["File or view return", "/returns"], ["Payments & Tax Records", "/payments"], ["Form 26AS", "/payments/form-26as"], ["Services", "/services"]] },
  { label: "Account & support", links: [["Pending Actions", "/pending-actions"], ["Help", "/help"]] },
] as const;

export default function DashboardPage() {
  const taxpayer = getTaxpayer();
  const demand = getOutstandingDemand();
  const payment = getTaxPayment();
  const taxReturn = getTaxReturn();
  const processing = getProcessingResult();
  const assessmentYear = formatAssessmentYear(demand.assessmentYear);

  return <div className="tax-account-home dashboard-recomposed">
    <header className="tax-account-heading"><div><h1>Your tax account</h1><p>Income Tax records and actions for this assessment year.</p></div><p>AY <strong>{assessmentYear}</strong></p></header>

    <div className="dashboard-priority-grid">
      <section className="tax-account-attention" aria-labelledby="attention-title">
        <div className="tax-account-demand-card">
          <p className="dashboard-section-label" id="attention-title">Needs your attention</p>
          <div className="tax-account-demand-main"><p>Outstanding demand</p><strong>{formatIndianCurrency(demand.amount, demand.currency)}</strong><span>Response pending <span aria-hidden="true">·</span> AY {assessmentYear}</span></div>
          <div className="tax-account-demand-action"><span className="attention-state"><CircleAlert aria-hidden="true" />{formatRecordLabel(demand.status)}</span><CaseAwareDemandProgress fallbackHref="/pending-actions/demand" fallbackLabel="Review outstanding demand" /></div>
          <p className="tax-account-demand-reference"><span>Demand reference</span><strong>{demand.demandId}</strong></p>
        </div>
      </section>

      <aside className="taxpayer-account-card" aria-labelledby="taxpayer-account-title">
        <header><span className="taxpayer-account-icon" aria-hidden="true"><UserRound /></span><div><p>Taxpayer account</p><h2 id="taxpayer-account-title">Your account</h2></div></header>
        <div className="taxpayer-account-identity"><strong>{taxpayer.name}</strong><span>{formatRecordLabel(taxpayer.accountType)} taxpayer</span></div>
        <dl><div><dt>PAN</dt><dd>{taxpayer.panMasked}</dd></div><div><dt>Last sign in</dt><dd>{formatIndianDate(taxpayer.lastSignIn)}</dd></div></dl>
        <p className="taxpayer-profile-status"><Check aria-hidden="true" />Profile {formatRecordLabel(taxpayer.profileStatus).toLowerCase()}</p>
      </aside>
    </div>

    <section className="dashboard-glance" aria-labelledby="account-summary-title">
      <h2 id="account-summary-title">Account at a glance</h2>
      <div className="account-summary-surface"><dl>
        <div><span className="summary-icon summary-icon--sage"><FileCheck2 aria-hidden="true" /></span><dt>Return</dt><dd><strong>Processed</strong><span>{formatIndianDate(processing.processedOn)}</span></dd></div>
        <div><span className="summary-icon summary-icon--sage"><ReceiptText aria-hidden="true" /></span><dt>Taxes paid</dt><dd><strong>{formatIndianCurrency(payment.amount, payment.currency)}</strong><span>{formatRecordLabel(payment.status)}</span></dd></div>
        <div><span className="summary-icon summary-icon--amber"><CircleAlert aria-hidden="true" /></span><dt>Pending actions</dt><dd><strong>1</strong><span>Needs attention</span></dd></div>
      </dl></div>
    </section>

    <div className="tax-account-lower-grid">
      <section className="account-standard-surface dashboard-activity" aria-labelledby="activity-title"><h2 id="activity-title">Recent tax activity</h2><ul className="activity-list"><li><time dateTime={processing.processedOn}>{formatIndianShortDate(processing.processedOn)}</time><span><strong>Return processed</strong><small>{processing.processingId}</small></span><span>{formatRecordLabel(processing.status)}</span></li><li><time dateTime={taxReturn.filedOn}>{formatIndianShortDate(taxReturn.filedOn)}</time><span><strong>Income Tax Return filed</strong><small>AY {assessmentYear}</small></span><span>{formatRecordLabel(taxReturn.filingStatus)}</span></li><li><time dateTime={payment.paymentDate}>{formatIndianShortDate(payment.paymentDate)}</time><span><strong>Self-Assessment Tax payment</strong><small>{payment.challanReference}</small></span><span>{formatIndianCurrency(payment.amount, payment.currency)}</span></li></ul><p className="activity-footer-label">View full activity <ArrowRight aria-hidden="true" /></p></section>
      <section className="account-standard-surface dashboard-tax-services" aria-labelledby="tax-services-title"><h2 id="tax-services-title">Tax services</h2>{serviceGroups.map((group) => <nav aria-label={group.label} key={group.label}><h3>{group.label}</h3><ul>{group.links.map(([label, href]) => <li key={href}><Link href={href}>{label}<ArrowRight aria-hidden="true" /></Link></li>)}</ul></nav>)}</section>
    </div>
  </div>;
}
