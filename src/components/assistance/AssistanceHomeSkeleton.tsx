"use client";

import { useEffect } from "react";

export default function AssistanceHomeSkeleton({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(onComplete, reducedMotion ? 40 : 680);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return <div aria-label="Assembling Assistance Home" aria-live="polite" className="assistance-home-assembly" data-testid="assistance-home-assembly" role="status">
    <span className="visually-hidden">Preparing Assistance for this account.</span>
    <div aria-hidden="true" className="assembly-heading"><i /><i /></div>
    <div aria-hidden="true" className="assembly-attention"><i /><i /><i /></div>
    <div aria-hidden="true" className="assembly-reminders"><i /><i /></div>
    <div aria-hidden="true" className="assembly-composer"><i /></div>
  </div>;
}
