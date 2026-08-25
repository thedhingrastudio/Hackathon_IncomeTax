"use client";
import { useAIAssistancePreference, setAIAssistanceEnabled } from "../../lib/storage/ai-assistance-preference";

export function AIAssistanceControl({ idPrefix, compact = false }: { idPrefix: string; compact?: boolean }) {
  const enabled = useAIAssistancePreference();
  const descriptionId = `${idPrefix}-description`;
  return <div className={`ai-preference ${compact ? "ai-preference--compact" : ""}`}>
    <div className="ai-preference__heading"><div><h2>AI Assistance</h2><p>{enabled ? "On" : "Off"}</p></div><label className="preference-switch"><input aria-checked={enabled} aria-describedby={descriptionId} autoComplete="off" checked={enabled} onChange={(event) => setAIAssistanceEnabled(event.currentTarget.checked)} role="switch" type="checkbox" /><span className="preference-switch__track" aria-hidden="true"><span className="preference-switch__thumb" /></span><span className="visually-hidden">Turn AI Assistance on or off</span></label></div>
    <p id={descriptionId}>{enabled ? "Assistance can help explain complex Income Tax information in simpler terms." : "Turn on assistance to get clearer explanations while using Income Tax services."}</p>
  </div>;
}

export default function AIAssistancePreference() { return <AIAssistanceControl idPrefix="dashboard-ai-preference" />; }
