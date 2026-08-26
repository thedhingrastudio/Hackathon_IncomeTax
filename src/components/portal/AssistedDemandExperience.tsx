"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GenerativeUIRenderer } from "../generative-ui";
import { createDemandAssistance } from "../../lib/ai";
import { createEvidencePacket, reconcileTaxCase } from "../../lib/reconciliation";
import { createTaxDemandCase } from "../../lib/workflows";
import { getStoredCase, saveCase } from "../../lib/storage/case-storage";
import { useAIAssistancePreference } from "../../lib/storage/ai-assistance-preference";
import type { ReconciliationInput } from "../../lib/reconciliation";
import type { SourceCheckBlock } from "../../types/generative-ui";

const checkingBlock: SourceCheckBlock = {
  id: "checking-records",
  type: "source_check",
  title: "Checking this demand",
  summary: "We're comparing the Income Tax records already linked to this demand.",
  sources: [
    { source: "outstanding_demand", label: "Outstanding Demand", status: "checking" },
    { source: "tax_payment", label: "Tax payment", status: "pending" },
    { source: "filed_return", label: "Filed return", status: "pending" },
    { source: "form_26as", label: "Form 26AS", status: "pending" },
    { source: "processed_return", label: "Processed return", status: "pending" },
  ],
};

export default function AssistedDemandExperience({ records, provider }: { records: ReconciliationInput; provider: string }) {
  const enabled = useAIAssistancePreference();

  if (!enabled) return <Fallback title="AI Assistance is turned off" body="Turn on AI Assistance from the Dashboard before requesting an assisted explanation." />;
  return <EnabledAssistedDemandExperience records={records} provider={provider} />;
}

function EnabledAssistedDemandExperience({ records, provider }: { records: ReconciliationInput; provider: string }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const result = useMemo(
    () => createDemandAssistance(reconcileTaxCase(records), provider),
    [provider, records],
  );
  useEffect(() => {
    const reconciliation = reconcileTaxCase(records);
    if (result?.status === "ready" && reconciliation.status === "matched" && !getStoredCase()) saveCase(createTaxDemandCase(createEvidencePacket(reconciliation), records.payment!.taxpayerId));
  }, [records, result]);

  useEffect(() => {
    const timer = window.setTimeout(() => setChecking(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  if (checking) return <section className="assisted-status" aria-live="polite"><GenerativeUIRenderer blocks={[checkingBlock]} /></section>;
  if (!result || result.status !== "ready") return <Fallback title="We couldn't safely determine why this demand exists" body="The available records did not support a safe explanation. You can inspect the records or use the conventional response service." showResponse />;

  return <section className="assisted-results" aria-label="Assisted demand explanation">
    <GenerativeUIRenderer blocks={result.response.blocks} onWorkflowAction={(action) => {
      if (action === "tax_credit_rectification") router.push("/pending-actions/demand/assist/rectification");
    }} />
    <div className="workflow-actions"><Link className="app-action app-action-secondary" href="/pending-actions/demand">Back to demand</Link></div>
  </section>;
}

function Fallback({ title, body, showResponse = false }: { title: string; body: string; showResponse?: boolean }) {
  return <section className="portal-alert portal-alert--info assisted-fallback" aria-labelledby="assisted-fallback-title"><div><h2 id="assisted-fallback-title">{title}</h2><p>{body}</p><div className="workflow-actions"><Link className="app-action app-action-secondary" href="/pending-actions/demand">Back to demand</Link>{showResponse ? <Link className="app-action app-action-primary" href="/pending-actions/demand/respond">Submit response</Link> : null}</div></div></section>;
}
