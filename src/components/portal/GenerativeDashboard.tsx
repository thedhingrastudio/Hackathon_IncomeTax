"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, CircleAlert, Clock3, Globe2, Info, Mic, Search, ShieldCheck } from "lucide-react";
import { FormEvent, MouseEvent, useState } from "react";
import { DitherGradient } from "../dither-kit/gradient";

const suggestions = ["Why is this demand showing?", "Check my payment status", "What needs my attention?"] as const;

function requestWorkspace(question: string) {
  window.dispatchEvent(new CustomEvent("civic:open-workspace", { detail: { question } }));
}

export default function GenerativeDashboard({ assessmentYear, demandAmount, taxpayerName }: { assessmentYear: string; demandAmount: string; taxpayerName: string }) {
  const [question, setQuestion] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuestion = question.trim();
    if (nextQuestion) requestWorkspace(nextQuestion);
  }

  function openWorkspace(event: MouseEvent<HTMLAnchorElement>, nextQuestion: string) {
    event.preventDefault();
    setQuestion(nextQuestion);
    requestWorkspace(nextQuestion);
  }

  return <div className="civic-home">
    <section className="civic-composer" aria-labelledby="civic-composer-title">
      <DitherGradient cell={3} className="civic-composer-wash" direction="left" from="purple" opacity={0.14} to="blue" />
      <div className="civic-composer-copy"><p>Generative government services</p><h1 id="civic-composer-title">What do you need to get done?</h1><span>Describe the outcome in your own words. We’ll bring together the right records and next steps.</span></div>
      <p className="civic-composer-aside">Tell us what you need. We’ll assemble the right path.</p>
      <form action="/pending-actions/demand/workspace" method="get" onSubmit={submit}><Search aria-hidden="true" /><label className="visually-hidden" htmlFor="civic-question">Describe what you need help with</label><input id="civic-question" name="q" onChange={(event) => setQuestion(event.target.value)} placeholder="For example, why is this demand showing?" value={question} /><button aria-label="Use voice input" className="civic-composer-tool" disabled title="Voice input is not available in this prototype" type="button"><Mic aria-hidden="true" /></button><span className="civic-language"><Globe2 aria-hidden="true" /> English</span><button aria-label="Generate my workspace" className="civic-composer-submit" type="submit"><ArrowRight aria-hidden="true" /></button></form>
      <div className="civic-suggestions" aria-label="Example questions">{suggestions.map((suggestion) => <Link href={`/pending-actions/demand/workspace?q=${encodeURIComponent(suggestion)}`} key={suggestion} onClick={(event) => openWorkspace(event, suggestion)}><Search aria-hidden="true" />{suggestion}</Link>)}</div>
    </section>

    <section className="civic-tasks" aria-labelledby="civic-tasks-title">
      <header><div><h2 id="civic-tasks-title">Your portal today</h2><p>Based on your records and deadlines, here’s what you can do.</p></div><Link href="/services">View all services <ArrowRight aria-hidden="true" /></Link></header>
      <div className="civic-task-grid">
        <article className="civic-task civic-task--urgent"><p className="civic-department">Income Tax Department</p><span className="civic-status civic-status--urgent"><CircleAlert aria-hidden="true" />Action needed</span><div className="civic-task-art"><Image alt="Tax records and payment receipt" fill priority sizes="(max-width: 760px) 100vw, 25vw" src="/assets/civic/tax-records.webp" unoptimized /></div><h3>Respond to an outstanding demand</h3><p>Your account shows a {demandAmount} demand for AY {assessmentYear}.</p><footer><span><CalendarDays aria-hidden="true" />Due 19 Sep 2026</span><Link href="/pending-actions/demand/workspace?q=Why%20is%20this%20demand%20showing%3F" onClick={(event) => openWorkspace(event, "Why is this demand showing?")}>Open guided workspace <ArrowRight aria-hidden="true" /></Link></footer></article>
        <article className="civic-task civic-task--soon"><p className="civic-department">Road Transport &amp; Highways</p><span className="civic-status civic-status--soon"><Clock3 aria-hidden="true" />Due soon</span><div className="civic-task-art"><Image alt="Driving licence record" fill sizes="(max-width: 760px) 100vw, 25vw" src="/assets/civic/driving-licence.webp" unoptimized /></div><h3>Renew your driving licence</h3><p>Your licence expires on 25 September 2026.</p><footer><span><CalendarDays aria-hidden="true" />Expires 25 Sep 2026</span><Link href="/services">View renewal service <ArrowRight aria-hidden="true" /></Link></footer></article>
        <article className="civic-task civic-task--progress"><p className="civic-department">Housing &amp; Urban Affairs</p><span className="civic-status civic-status--progress"><span aria-hidden="true" />In progress</span><div className="civic-task-art"><Image alt="Housing application illustration" fill sizes="(max-width: 760px) 100vw, 25vw" src="/assets/civic/housing-application.webp" unoptimized /></div><h3>Track your housing application</h3><p>It’s under review. We’ll update you when there’s news.</p><footer><span><CalendarDays aria-hidden="true" />Submitted 28 Aug 2026</span><Link href="/services">Track application <ArrowRight aria-hidden="true" /></Link></footer></article>
        <article className="civic-task civic-task--empty"><p className="civic-department">Explore another service</p><span className="civic-status civic-status--quiet">Available anytime</span><div className="civic-task-art"><Image alt="Compass pointing toward public services" fill sizes="(max-width: 760px) 100vw, 25vw" src="/assets/civic/service-compass.webp" unoptimized /></div><h3>Nothing else needs your attention</h3><p>Browse all services or describe something you need above.</p><footer><Link href="/services">Find a service <ArrowRight aria-hidden="true" /></Link></footer></article>
      </div>
    </section>

    <footer className="civic-provenance"><p><ShieldCheck aria-hidden="true" />Generated from your verified records, applications and deadlines.</p><button onClick={() => requestWorkspace("Where did you get these records?")} type="button"><Info aria-hidden="true" />How this portal was assembled</button><span>Welcome, {taxpayerName.split(" ")[0]}.</span></footer>
  </div>;
}
