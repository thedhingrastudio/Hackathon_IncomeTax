"use client";

import { Check, FileSearch, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { DitherGradient } from "../dither-kit/gradient";

export default function AssistanceHomeSkeleton({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(onComplete, reducedMotion ? 40 : 1200);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return <div aria-label="Generating your service workspace" aria-live="polite" className="civic-assembly" data-testid="assistance-home-assembly" role="status">
    <DitherGradient cell={3} className="civic-assembly-wash" direction="left" from="purple" opacity={0.12} to="blue" />
    <header><p>Generating for your request</p><h2>Assembling the clearest path…</h2><span>We only use records relevant to what you asked.</span></header>
    <ol><li className="is-complete"><span><Check aria-hidden="true" /></span><div><strong>Understanding your request</strong><small>The outcome and context are clear</small></div></li><li className="is-current"><span><FileSearch aria-hidden="true" /></span><div><strong>Checking connected records</strong><small>Finding verified information across services</small></div></li><li><span><Sparkles aria-hidden="true" /></span><div><strong>Composing your workspace</strong><small>Choosing the right explanations and actions</small></div></li></ol>
  </div>;
}
