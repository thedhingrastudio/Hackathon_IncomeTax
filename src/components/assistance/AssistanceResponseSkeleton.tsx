import { Check, FileSearch, Sparkles } from "lucide-react";

export default function AssistanceResponseSkeleton() {
  return <div aria-label="Updating your generated workspace" aria-live="polite" className="civic-assembly civic-assembly--compact" role="status"><header><p>Adapting to your question</p><h2>Updating this workspace…</h2></header><ol><li className="is-complete"><span><Check aria-hidden="true" /></span><div><strong>Intent understood</strong><small>Your follow-up is clear</small></div></li><li className="is-current"><span><FileSearch aria-hidden="true" /></span><div><strong>Checking context</strong><small>Using only relevant records</small></div></li><li><span><Sparkles aria-hidden="true" /></span><div><strong>Preparing the right view</strong><small>Recomposing the interface</small></div></li></ol></div>;
}
