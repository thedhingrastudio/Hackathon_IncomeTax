import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, CarFront, GraduationCap, HeartHandshake, Home, Landmark, Search, ShieldCheck, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ServiceCategory = { title: string; description: string; icon: LucideIcon; services: readonly string[]; href?: string };

const categories = [
  { title: "Identity & documents", description: "Passports, identity records and certificates.", icon: UserRound, services: ["Renew a passport", "Update identity details", "Request a birth certificate"] },
  { title: "Travel & transport", description: "Licences, vehicles and public transport.", icon: CarFront, services: ["Renew a driving licence", "Check vehicle registration", "Apply for a transport permit"] },
  { title: "Money & tax", description: "Tax, payments, benefits and pensions.", icon: Landmark, services: ["Respond to a tax demand", "View tax records", "Check pension contributions"], href: "/pending-actions/demand/workspace" },
  { title: "Housing & local services", description: "Housing applications and municipal services.", icon: Home, services: ["Track a housing application", "Pay property tax", "Request a civic service"] },
  { title: "Work & business", description: "Employment, company and professional services.", icon: BriefcaseBusiness, services: ["Register a business", "Check employment benefits", "Manage professional licences"] },
  { title: "Education", description: "Student records, scholarships and qualifications.", icon: GraduationCap, services: ["Apply for a scholarship", "Verify a qualification", "Access student records"] },
  { title: "Family & wellbeing", description: "Family support, health and social services.", icon: HeartHandshake, services: ["Apply for family support", "Access health records", "Check benefit eligibility"] },
  { title: "Grievances & requests", description: "Raise an issue and reuse the records that support it.", icon: Building2, services: ["Submit a grievance", "Track a public-service request", "Request a record correction"] },
] as const satisfies readonly ServiceCategory[];

export default function ServicesPage() {
  return <div className="civic-directory">
    <header className="civic-page-heading"><p>All government services</p><h1>What would you like to do?</h1><span>Browse by outcome, or describe what you need and let the portal assemble the right path.</span></header>
    <form className="civic-directory-search"><Search aria-hidden="true" /><label className="visually-hidden" htmlFor="service-search">Search government services</label><input id="service-search" name="service" placeholder="Search services, departments or outcomes" /><button type="submit">Search</button></form>
    <div className="civic-directory-meta"><p><ShieldCheck aria-hidden="true" />Services from participating government departments</p><span>{categories.length} categories</span></div>
    <div className="civic-directory-grid">{(categories as readonly ServiceCategory[]).map(({ title, description, icon: Icon, services, href }) => <article className="civic-directory-card" key={title}><div className="civic-directory-icon"><Icon aria-hidden="true" /></div><div><h2>{title}</h2><p>{description}</p></div><ul>{services.map((service, index) => <li key={service}>{href && index === 0 ? <Link href={href}>{service}<ArrowRight aria-hidden="true" /></Link> : <span>{service}</span>}</li>)}</ul><button type="button">View category <ArrowRight aria-hidden="true" /></button></article>)}</div>
  </div>;
}
