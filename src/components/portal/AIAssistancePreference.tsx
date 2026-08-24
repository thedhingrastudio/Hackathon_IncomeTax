"use client";
import { setAIAssistanceEnabled, useAIAssistancePreference } from "../../lib/storage/ai-assistance-preference";

export default function AIAssistancePreference() {
  return <AIAssistanceControl idPrefix="dashboard-ai-preference" />;
}

export function AIAssistanceControl({ idPrefix, compact = false }: { idPrefix: string; compact?: boolean }) {
  const enabled = useAIAssistancePreference();
  const titleId = `${idPrefix}-title`;
  const descriptionId = `${idPrefix}-description`;
  return <aside className={`ai-preference ${compact ? "ai-preference--compact" : ""}`} aria-labelledby={titleId}>
    <div className="ai-preference__heading"><div><h2 id={titleId}>AI Assistance</h2><p>{enabled ? "On" : "Off"}</p></div>
      <label className="ux4g-switch ux4g-switch-md"><input aria-checked={enabled} aria-describedby={descriptionId} autoComplete="off" checked={enabled} className="ux4g-switch-input" onChange={(event) => setAIAssistanceEnabled(event.currentTarget.checked)} role="switch" type="checkbox" /><span className="ux4g-switch-control" aria-hidden="true"><span className="ux4g-switch-track"><span className="ux4g-switch-thumb" /></span></span><span className="visually-hidden">Turn AI Assistance on or off</span></label>
    </div>
    <p id={descriptionId}>{compact ? "Get clearer explanations while using Income Tax services." : enabled ? "Assistance can help explain complex Income Tax information in simpler terms." : "Turn on assistance to get clearer explanations while using Income Tax services."}</p>
  </aside>;
}
