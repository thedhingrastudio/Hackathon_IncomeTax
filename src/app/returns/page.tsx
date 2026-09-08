import Link from "next/link";
import { ArrowRight, Building2, CarFront, Check, FileCheck2, FileText, Fingerprint, Home, Landmark, Search, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CitizenRecord = { title: string; department: string; reference: string; updated: string; status: string; icon: LucideIcon; href?: string };

const records = [
  { title: "Identity profile", department: "UIDAI", reference: "Aadhaar · XXXX XXXX 4821", updated: "Verified 18 Aug 2026", status: "Verified", icon: Fingerprint },
  { title: "Income Tax Return", department: "Income Tax Department", reference: "AY 2026–27 · ITR-2", updated: "Processed 02 Aug 2026", status: "Attention", icon: FileText, href: "/pending-actions/demand/workspace" },
  { title: "Self-Assessment Tax", department: "Income Tax Department", reference: "₹18,420 · CIN 0018420", updated: "Paid 15 Jul 2026", status: "Confirmed", icon: Landmark, href: "/payments" },
  { title: "Driving licence", department: "Road Transport & Highways", reference: "DL-04 ·•••• 2718", updated: "Expires 25 Sep 2026", status: "Due soon", icon: CarFront },
  { title: "Housing application", department: "Housing & Urban Affairs", reference: "PMAY-U · HSG-20841", updated: "Submitted 28 Aug 2026", status: "In review", icon: Home },
  { title: "Employment record", department: "Employees’ Provident Fund", reference: "UAN ·•••• 9340", updated: "Updated 31 Aug 2026", status: "Current", icon: Building2 },
] as const satisfies readonly CitizenRecord[];

export default function RecordsPage() {
  return <div className="civic-records">
    <header className="civic-page-heading"><p>Your government records</p><h1>Everything connected to you.</h1><span>Review verified records from participating departments and reuse them when a service or grievance needs evidence.</span></header>
    <div className="civic-records-toolbar"><label><Search aria-hidden="true" /><span className="visually-hidden">Search your records</span><input placeholder="Search your records" /></label><button type="button">All departments</button><button type="button">All statuses</button></div>
    <section className="civic-record-summary" aria-label="Record summary"><div><FileCheck2 aria-hidden="true" /><span><strong>{records.length} connected records</strong><small>Across 5 departments</small></span></div><p><ShieldCheck aria-hidden="true" />You decide when a record is used in a request.</p></section>
    <div className="civic-record-grid">{(records as readonly CitizenRecord[]).map(({ title, department, reference, updated, status, icon: Icon, href }) => <article className="civic-record-card" key={title}><header><span><Icon aria-hidden="true" /></span><div><p>{department}</p><h2>{title}</h2></div><strong className={`civic-record-status civic-record-status--${status.toLowerCase().replace(" ", "-")}`}>{status === "Verified" || status === "Confirmed" || status === "Current" ? <Check aria-hidden="true" /> : null}{status}</strong></header><dl><div><dt>Record</dt><dd>{reference}</dd></div><div><dt>Last update</dt><dd>{updated}</dd></div></dl><footer>{href ? <Link href={href}>Open record <ArrowRight aria-hidden="true" /></Link> : <button type="button">Review record <ArrowRight aria-hidden="true" /></button>}<button type="button">Use as evidence</button></footer></article>)}</div>
    <aside className="civic-record-note"><ShieldCheck aria-hidden="true" /><div><strong>Records stay under your control</strong><p>The portal can locate relevant records, but it will show you exactly what will be shared before anything is attached to a request.</p></div></aside>
  </div>;
}
