import Link from "next/link";
import AIAssistancePreference from "../components/portal/AIAssistancePreference";
import CaseAwareDemandProgress from "../components/portal/CaseAwareDemandProgress";
import { getOutstandingDemand, getTaxpayer } from "../data/mock";
import { formatAssessmentYear, formatIndianCurrency, formatRecordLabel } from "../lib/format-tax";

const shortcuts = [
  { title: "File or view return", text: "Access your Income Tax returns.", href: "/returns" },
  { title: "Payments & Tax Records", text: "View payments and tax-information records.", href: "/payments" },
  { title: "Pending actions", text: "Review items that need your response.", href: "/pending-actions" },
  { title: "Services", text: "Browse available Income Tax services.", href: "/services" },
];

export default function Home() {
  const taxpayer = getTaxpayer();
  const demand = getOutstandingDemand();
  const firstName = taxpayer.name.split(" ")[0];
  const pendingDemandCount = demand.status === "action_required" ? 1 : 0;
  return <>
    <section className="account-heading" aria-labelledby="dashboard-title">
      <div><p className="eyebrow">Account overview</p><h1 id="dashboard-title">Welcome, {firstName}</h1><p>Assessment Year {formatAssessmentYear(demand.assessmentYear)}</p></div>
      <AIAssistancePreference />
    </section>
    <section className="attention-section" aria-labelledby="attention-title">
      <div className="section-heading"><div><p className="eyebrow">Pending actions</p><h2 id="attention-title">{pendingDemandCount} item needs your attention</h2></div><Link className="ux4g-text-link-md" href="/pending-actions">View all pending actions</Link></div>
      <article className="ux4g-card ux4g-card-outline ux4g-card-vertical demand-card">
        <div className="ux4g-card-header demand-card__header"><div><p className="eyebrow">Outstanding Demand</p><h3>{formatIndianCurrency(demand.amount, demand.currency)}</h3></div><span className="demand-status" role="status"><span className="ux4g-badge-icon-warning ux4g-badge-m" aria-hidden="true">!</span><strong>{formatRecordLabel(demand.status)}</strong></span></div>
        <div className="ux4g-card-body demand-card__body"><dl><div><dt>Assessment Year</dt><dd>{formatAssessmentYear(demand.assessmentYear)}</dd></div><div><dt>Demand status</dt><dd>Response pending</dd></div></dl><p>Review this demand and choose how you want to respond.</p></div>
        <div className="ux4g-card-footer demand-card__footer"><CaseAwareDemandProgress fallbackHref="/pending-actions/demand" fallbackLabel="View demand" /></div>
      </article>
    </section>
    <section aria-labelledby="shortcuts-title">
      <div className="section-heading"><div><p className="eyebrow">Online services</p><h2 id="shortcuts-title">Useful shortcuts</h2></div></div>
      <div className="shortcut-grid">{shortcuts.map((shortcut) => <article className="ux4g-card ux4g-card-outline ux4g-card-vertical shortcut-card" key={shortcut.href}><div className="ux4g-card-body"><h3>{shortcut.title}</h3><p>{shortcut.text}</p><Link className="ux4g-text-link-md" href={shortcut.href}>Open {shortcut.title.toLowerCase()}</Link></div></article>)}</div>
    </section>
  </>;
}
