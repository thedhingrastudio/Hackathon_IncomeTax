"use client";

import Link from "next/link";
import { useAIAssistancePreference } from "../../lib/storage/ai-assistance-preference";

export default function DemandAssistanceEntry() {
  const enabled = useAIAssistancePreference();

  if (!enabled) return null;

  return <aside className="portal-alert portal-alert--info demand-assistance-entry" aria-labelledby="demand-assistance-title">
    <div>
      <h2 id="demand-assistance-title">Not sure why this is showing?</h2>
      <p>Assistance can compare the Income Tax records linked to this demand.</p>
      <Link className="app-action app-action-secondary" href="/pending-actions/demand/assist">Help me understand this</Link>
    </div>
  </aside>;
}
