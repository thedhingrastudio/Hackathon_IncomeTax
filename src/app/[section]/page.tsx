import Link from "next/link";
import { notFound } from "next/navigation";
const sections: Record<string, { title: string; description: string }> = {
  returns: { title: "Returns", description: "File and view Income Tax returns." }, payments: { title: "Payments", description: "Access tax payment services and payment history." }, "pending-actions": { title: "Pending Actions", description: "Review notices, demands and other items that need your response." }, services: { title: "Services", description: "Browse Income Tax services available to you." }, help: { title: "Help", description: "Find guidance for using Income Tax online services." },
};
export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params; const content = sections[section]; if (!content) notFound();
  return <section className="placeholder-page" aria-labelledby="section-title"><p className="eyebrow">Portal section</p><h1 id="section-title">{content.title}</h1><div className="ux4g-context-alert ux4g-alert-info" role="status"><div><strong>Prototype placeholder</strong><p>{content.description} This section will be developed in a later approved increment.</p></div></div><Link className="ux4g-btn ux4g-btn-primary ux4g-btn-md" href="/">Return to dashboard</Link></section>;
}
