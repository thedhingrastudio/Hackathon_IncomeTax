import Link from "next/link";
import PageHeading from "../../components/portal/PageHeading";
import RecordDetails from "../../components/portal/RecordDetails";
import { getTaxPayment } from "../../data/mock";
import { formatAssessmentYear, formatIndianCurrency, formatIndianDate, formatRecordLabel } from "../../lib/format-tax";
export default function PaymentsPage() {
  const payment = getTaxPayment();
  return <><PageHeading eyebrow="Tax information" title="Payments & Tax Records" description="View tax payments and related tax-information records in your account." />
    <section className="record-section" aria-labelledby="payment-title"><div className="section-heading"><div><p className="eyebrow">Tax payment</p><h2 id="payment-title">{formatRecordLabel(payment.paymentType)}</h2></div><span className="record-status success-status"><span className="ux4g-badge-icon-success ux4g-badge-m" aria-hidden="true">✓</span><strong>{formatRecordLabel(payment.status)}</strong></span></div><div className="ux4g-card ux4g-card-outline ux4g-card-vertical"><div className="ux4g-card-body"><RecordDetails details={[{ label: "Amount", value: formatIndianCurrency(payment.amount, payment.currency) }, { label: "Assessment Year", value: formatAssessmentYear(payment.assessmentYear) }, { label: "Payment date", value: formatIndianDate(payment.paymentDate) }, { label: "Status", value: formatRecordLabel(payment.status) }, { label: "Challan reference", value: payment.challanReference }]} /></div></div></section>
    <section aria-labelledby="tax-records-title"><div className="section-heading"><div><p className="eyebrow">Related records</p><h2 id="tax-records-title">Tax information</h2></div></div><div className="tax-record-grid">
      <article className="ux4g-card ux4g-card-outline ux4g-card-vertical"><div className="ux4g-card-body"><h3>Form 26AS</h3><p>View tax credits reflected in your Form 26AS record.</p><Link className="ux4g-text-link-md" href="/payments/form-26as">View Form 26AS</Link></div></article>
      <article className="ux4g-card ux4g-card-outline ux4g-card-vertical"><div className="ux4g-card-body"><h3>Annual Information Statement (AIS)</h3><p>AIS provides tax-related information available to the taxpayer.</p></div></article>
    </div></section>
  </>;
}
