"use client";

import Link from "next/link";
import { useAIAssistancePreference } from "../../lib/storage/ai-assistance-preference";

export default function DemandAssistanceEntry() {
  const enabled = useAIAssistancePreference();

  if (!enabled) return null;

  return <aside className="ux4g-context-alert ux4g-alert-info demand-assistance-entry" aria-labelledby="demand-assistance-title">
    <div>
      <h2 id="demand-assistance-title">Not sure why this is showing?</h2>
      <p>Assistance can compare the Income Tax records linked to this demand.</p>
      <Link className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md" href="/pending-actions/demand/assist">Help me understand this</Link>
    </div>
  </aside>;
}
