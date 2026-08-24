import PageHeading from "../../components/portal/PageHeading";
import RecordDetails from "../../components/portal/RecordDetails";
import { getProcessingResult, getTaxReturn } from "../../data/mock";
import { formatAssessmentYear, formatIndianCurrency, formatIndianDate, formatRecordLabel } from "../../lib/format-tax";

export default function ReturnsPage() {
  const taxReturn = getTaxReturn(); const processing = getProcessingResult();
  return <>
    <PageHeading eyebrow="Returns" title={`Income Tax Return · AY ${formatAssessmentYear(taxReturn.assessmentYear)}`} description="Read-only information from your filed and processed return." />
    <section className="record-section" aria-labelledby="return-record-title"><div className="section-heading"><div><p className="eyebrow">Filed return</p><h2 id="return-record-title">Return record</h2></div><span className="record-status success-status"><span className="ux4g-badge-icon-success ux4g-badge-m" aria-hidden="true">✓</span><strong>{formatRecordLabel(taxReturn.filingStatus)}</strong></span></div>
      <div className="ux4g-card ux4g-card-outline ux4g-card-vertical"><div className="ux4g-card-body"><RecordDetails details={[{ label: "Assessment Year", value: formatAssessmentYear(taxReturn.assessmentYear) }, { label: "Filed date", value: formatIndianDate(taxReturn.filedOn) }, { label: "Tax liability", value: formatIndianCurrency(taxReturn.taxLiability, taxReturn.currency) }, { label: "Self-Assessment Tax claimed", value: formatIndianCurrency(taxReturn.selfAssessmentTaxClaimed, taxReturn.currency) }, { label: "Return reference", value: taxReturn.returnId }]} /></div></div>
    </section>
    <section className="ux4g-card ux4g-card-outline ux4g-card-vertical" aria-labelledby="processing-title"><div className="ux4g-card-header"><h2 id="processing-title">Processed return</h2></div><div className="ux4g-card-body"><RecordDetails details={[{ label: "Status", value: formatRecordLabel(processing.status) }, { label: "Processed date", value: formatIndianDate(processing.processedOn) }, { label: "Self-Assessment Tax recognised", value: formatIndianCurrency(processing.selfAssessmentTaxRecognised, processing.currency) }, { label: "Processing reference", value: processing.processingId }]} /></div></section>
  </>;
}
