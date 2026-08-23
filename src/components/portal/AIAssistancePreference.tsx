"use client";
import { useSyncExternalStore } from "react";
const storageKey = "income-tax-prototype-ai-assistance";
const preferenceEvent = "income-tax-ai-preference-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(preferenceEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(preferenceEvent, onStoreChange);
  };
}

export default function AIAssistancePreference() {
  const enabled = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(storageKey) === "true",
    () => false,
  );
  function updatePreference(value: boolean) {
    window.localStorage.setItem(storageKey, String(value));
    window.dispatchEvent(new Event(preferenceEvent));
  }
  return <aside className="ai-preference" aria-labelledby="ai-preference-title">
    <div className="ai-preference__heading"><div><h2 id="ai-preference-title">AI Assistance</h2><p>{enabled ? "On" : "Off"}</p></div>
      <label className="ux4g-switch ux4g-switch-md"><input aria-checked={enabled} aria-describedby="ai-preference-description" checked={enabled} className="ux4g-switch-input" onChange={(event) => updatePreference(event.currentTarget.checked)} role="switch" type="checkbox" /><span className="ux4g-switch-control" aria-hidden="true"><span className="ux4g-switch-track"><span className="ux4g-switch-thumb" /></span></span><span className="visually-hidden">Turn AI Assistance on or off</span></label>
    </div>
    <p id="ai-preference-description">{enabled ? "Assistance can help explain complex Income Tax information in simpler terms." : "Turn on assistance to get clearer explanations while using Income Tax services."}</p>
  </aside>;
}
