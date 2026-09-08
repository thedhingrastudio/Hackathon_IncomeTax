import Link from "next/link";
import { ArrowRight, Check, FileSearch, ShieldCheck } from "lucide-react";
import type { AssistanceSurface } from "../assistance/AssistanceWorkspace";

const surfaceDecision: Record<AssistanceSurface, string> = {
  home: "Choose what you want to understand or resolve.", checking: "Wait while connected records are checked.", understanding: "Review why the demand exists.", action: "Choose the corrective path you want to take.", rectification_review: "Confirm the tax-credit correction.", demand_response_review: "Confirm your response to the demand.", demand_response_submitted: "Track the submitted case.", tracking: "Follow the review and any future action.", payment: "Review whether the payment was received.", dates: "Review the dates connected to this case.", form_26as: "Review the tax-credit record used as evidence.", return_status: "Review how the return was processed.", evidence: "Review where every fact came from.", pay_again: "Decide whether another payment is necessary.", unsupported: "Rephrase the request within this demonstration.", no_case: "Return to the overview and start a case.",
};

export default function RequestContextPanel({ question, surface }: { question: string; surface: AssistanceSurface }) {
  return <section className="civic-request-panel" aria-label="How the portal understands your request">
    <header><p>Your request</p><span><Check aria-hidden="true" />Request understood</span></header>
    <h1>{question || "Help me understand what needs my attention"}</h1>
    <div className="civic-request-field"><p>{question || "Help me understand what needs my attention"}</p><span>Original request</span></div>
    <div className="civic-request-tools"><span><FileSearch aria-hidden="true" />Connected records used</span><span><ShieldCheck aria-hidden="true" />Read-only access</span></div>
    <div className="civic-request-understanding"><p>How we understand your request</p><ol>
      <li><span>1</span><div><strong>Goal</strong><p>Understand why an outstanding Income Tax demand is appearing and resolve it without paying twice.</p></div></li>
      <li><span>2</span><div><strong>Information found</strong><p>Your payment, Form 26AS, processed return and outstanding demand are connected to this request.</p></div></li>
      <li><span>3</span><div><strong>Next decision</strong><p>{surfaceDecision[surface]}</p></div></li>
    </ol></div>
    <aside><FileSearch aria-hidden="true" /><div><strong>Prefer the regular service?</strong><Link href="/pending-actions/demand">Open the Income Tax service <ArrowRight aria-hidden="true" /></Link></div></aside>
  </section>;
}
