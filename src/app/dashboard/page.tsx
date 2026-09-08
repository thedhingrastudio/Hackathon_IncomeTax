import Link from "next/link";
import { ArrowRight, Check, ChevronRight, CircleAlert, FileText, ReceiptText } from "lucide-react";
import { DitherAvatar } from "../../components/dither-kit/avatar";
import { DitherGradient } from "../../components/dither-kit/gradient";
import CaseStateLabel from "../../components/portal/CaseStateLabel";
import { getOutstandingDemand, getProcessingResult, getTaxPayment, getTaxpayer, getTaxReturn } from "../../data/mock";
import { formatAssessmentYear, formatIndianCurrency, formatIndianDate, formatIndianShortDate, formatRecordLabel } from "../../lib/format-tax";

const services = [
  ["File or view return", "/returns", FileText],
  ["Payments and tax records", "/payments", ReceiptText],
  ["Pending actions", "/pending-actions", CircleAlert],
] as const;

export default function DashboardPage() {
  const taxpayer = getTaxpayer();
  const demand = getOutstandingDemand();
  const payment = getTaxPayment();
  const taxReturn = getTaxReturn();
  const processing = getProcessingResult();
  const assessmentYear = formatAssessmentYear(demand.assessmentYear);

  return (
    <div className="revised-dashboard">
      <header className="revised-dashboard-heading">
        <div><p className="revised-kicker"><span>Overview</span> Assessment year {assessmentYear}</p><h1>Good morning, {taxpayer.name.split(" ")[0]}.</h1><p>Here is the one item that needs your attention today.</p></div>
        <div className="revised-account-chip"><DitherAvatar animate name={taxpayer.name} size={38} /><span><strong>{taxpayer.name}</strong><small>{taxpayer.panMasked}</small></span></div>
      </header>

      <div className="revised-dashboard-layout">
        <section className="revised-focus-panel" aria-labelledby="focus-title">
          <DitherGradient cell={3} className="revised-focus-wash" direction="left" from="purple" opacity={0.2} to="blue" />
          <div className="revised-focus-meta"><span><CircleAlert aria-hidden="true" /> Needs attention</span><span>AY {assessmentYear}</span></div>
          <div className="revised-focus-copy">
            <p>Outstanding demand</p>
            <h2 id="focus-title">The portal says you owe {formatIndianCurrency(demand.amount, demand.currency)}.</h2>
            <p>Your payment is present in Form 26AS, but it was not included when your return was processed. We can help you understand and resolve the mismatch.</p>
          </div>
          <div className="revised-focus-footer">
            <div><span>Current status</span><CaseStateLabel compact /></div>
            <Link href="/pending-actions/demand">Understand this issue <ArrowRight aria-hidden="true" /></Link>
          </div>
        </section>

        <aside className="revised-account-panel" aria-label="Tax account summary">
          <header><p>Tax account</p><span>Updated today</span></header>
          <dl>
            <div><dt>Return</dt><dd><span className="revised-dot is-success" />Processed</dd></div>
            <div><dt>Taxes paid</dt><dd>{formatIndianCurrency(payment.amount, payment.currency)}</dd></div>
            <div><dt>Profile</dt><dd><Check aria-hidden="true" />Complete</dd></div>
          </dl>
          <Link href="/returns">View account details <ChevronRight aria-hidden="true" /></Link>
        </aside>
      </div>

      <section className="revised-dashboard-section" aria-labelledby="services-title">
        <header><div><p className="revised-kicker"><span>Services</span> Direct access</p><h2 id="services-title">Your tax workspace</h2></div><Link href="/services">View all services <ArrowRight aria-hidden="true" /></Link></header>
        <div className="revised-service-row">
          {services.map(([label, href, Icon], index) => <Link href={href} key={href}><span>0{index + 1}</span><Icon aria-hidden="true" /><strong>{label}</strong><ArrowRight aria-hidden="true" /></Link>)}
        </div>
      </section>

      <section className="revised-dashboard-section revised-activity-section" aria-labelledby="activity-title">
        <header><div><p className="revised-kicker"><span>Records</span> Recent updates</p><h2 id="activity-title">Recent activity</h2></div></header>
        <ol>
          <li><time dateTime={processing.processedOn}>{formatIndianShortDate(processing.processedOn)}</time><span><strong>Return processed</strong><small>{processing.processingId}</small></span><span>{formatRecordLabel(processing.status)}</span></li>
          <li><time dateTime={taxReturn.filedOn}>{formatIndianShortDate(taxReturn.filedOn)}</time><span><strong>Income Tax Return filed</strong><small>AY {assessmentYear}</small></span><span>{formatRecordLabel(taxReturn.filingStatus)}</span></li>
          <li><time dateTime={payment.paymentDate}>{formatIndianShortDate(payment.paymentDate)}</time><span><strong>Self-Assessment Tax payment</strong><small>{payment.challanReference}</small></span><span>{formatIndianCurrency(payment.amount, payment.currency)}</span></li>
        </ol>
        <p className="revised-activity-note">Last sign in {formatIndianDate(taxpayer.lastSignIn)}</p>
      </section>
    </div>
  );
}
