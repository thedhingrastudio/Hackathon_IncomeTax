import Link from "next/link";
import PageHeading from "../../components/portal/PageHeading";

interface ServiceItem { name: string; href?: string; external?: boolean; }
interface ServiceGroup { title: string; description: string; items: ServiceItem[]; }

const groups: ServiceGroup[] = [
  { title: "File and manage taxes", description: "File, verify and manage returns, forms and tax payments.", items: [
    { name: "File Income Tax Return" }, { name: "View Filed Returns", href: "/returns" }, { name: "e-Verify Return" }, { name: "File Income Tax Forms" }, { name: "View Filed Forms" }, { name: "Download Pre-filled JSON" }, { name: "e-Pay Tax" },
  ] },
  { title: "View tax information", description: "Access statements and tax-credit information held by Income Tax.", items: [
    { name: "Annual Information Statement (AIS)" }, { name: "Form 26AS", href: "/payments/form-26as" }, { name: "Tax Credit Mismatch" },
  ] },
  { title: "Correct something", description: "Find services for correcting records or requesting reconsideration.", items: [
    { name: "Rectification" }, { name: "Challan Correction" }, { name: "Refund Reissue" }, { name: "Condonation Request" },
  ] },
  { title: "Respond to Income Tax", description: "Review and respond to items raised by Income Tax.", items: [
    { name: "Response to Outstanding Demand", href: "/pending-actions/demand" }, { name: "Worklist" }, { name: "e-Proceedings" }, { name: "Compliance Portal", external: true }, { name: "Reporting Portal", external: true },
  ] },
  { title: "People and permissions", description: "Manage tax professionals, representatives and permissions.", items: [
    { name: "My Chartered Accountant" }, { name: "My e-Return Intermediary" }, { name: "Register as Representative Assessee" }, { name: "Act on behalf of another person" }, { name: "Authorise another person" },
  ] },
  { title: "Account and verification", description: "Access verification and identity-related services.", items: [
    { name: "Generate EVC" }, { name: "View / Download e-PAN" }, { name: "Aadhaar-related exemptions" }, { name: "Manage ITDREIN" },
  ] },
  { title: "Support and grievances", description: "Get help and manage service grievances.", items: [
    { name: "Submit Grievance" }, { name: "Grievance Status" }, { name: "Help", href: "/help" }, { name: "FAQs" }, { name: "User manuals" },
  ] },
];

export default function ServicesPage() {
  return <><PageHeading eyebrow="Online services" title="Services" description="Find Income Tax services grouped around the task you need to complete." />
    <div className="service-catalogue">{groups.map((group) => <section className="portal-surface service-group" key={group.title} aria-labelledby={`service-${group.title.replaceAll(" ", "-").toLowerCase()}`}>
      <div className="portal-surface__header"><div><h2 id={`service-${group.title.replaceAll(" ", "-").toLowerCase()}`}>{group.title}</h2><p>{group.description}</p></div></div>
      <div className="portal-surface__body"><ul className="service-list">{group.items.map((item) => <li key={item.name}><div>{item.href ? <Link className="portal-tertiary-link" href={item.href}>{item.name}</Link> : <span className="service-name">{item.name}</span>}{item.external ? <span className="external-service">External service</span> : null}</div></li>)}</ul></div>
    </section>)}</div>
  </>;
}
