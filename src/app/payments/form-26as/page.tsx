import PageHeading from "../../../components/portal/PageHeading";
import RecordDetails from "../../../components/portal/RecordDetails";
import { getForm26AS } from "../../../data/mock";
import { formatAssessmentYear, formatIndianCurrency, formatIndianDate, formatRecordLabel } from "../../../lib/format-tax";

export default function Form26ASPage() {
  const record = getForm26AS();
  const entry = record.entries[0];
  return <><PageHeading eyebrow="Payments & Tax Records" title="Form 26AS" description="Read-only tax-credit information from your Income Tax account." backHref="/payments" backLabel="Payments & Tax Records" /><section className="record-section" aria-labelledby="form26as-entry-title"><div className="section-heading"><div><p className="eyebrow">Tax credit record</p><h2 id="form26as-entry-title">{formatRecordLabel(entry.paymentType)}</h2></div><span className="portal-status portal-status--success"><span className="portal-status__icon" aria-hidden="true">✓</span><strong>{formatRecordLabel(entry.status)}</strong></span></div><div className="portal-surface"><div className="portal-surface__body"><RecordDetails details={[{ label: "Assessment Year", value: formatAssessmentYear(record.assessmentYear) }, { label: "Payment type", value: formatRecordLabel(entry.paymentType) }, { label: "Amount", value: formatIndianCurrency(entry.amount, entry.currency) }, { label: "Payment date", value: formatIndianDate(entry.paymentDate) }, { label: "Challan reference", value: entry.challanReference }, { label: "Status", value: formatRecordLabel(entry.status) }]} /></div></div></section></>;
}
