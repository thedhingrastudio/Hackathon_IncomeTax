"use client";

import { Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AssistanceComposer({ caseContext = false, contextual = false }: { caseContext?: boolean; contextual?: boolean }) {
  return <form className="assistance-composer" onSubmit={(event) => event.preventDefault()}>
    <label htmlFor="assistance-question">{caseContext ? "Ask about this case" : "Ask about your taxes"}</label>
    <div className="assistance-composer-row">
      <Input id="assistance-question" name="question" placeholder={caseContext ? "Ask about this case…" : contextual ? "Ask a follow-up…" : "Ask about your taxes…"} type="text" />
      <Button aria-label="Voice input is not available in this demo" disabled size="icon-lg" type="button" variant="ghost"><Mic aria-hidden="true" /></Button>
      <Button aria-label="Send question" size="icon-lg" type="submit"><Send aria-hidden="true" /></Button>
    </div>
    <p>{caseContext ? "Use this input to explore the current case." : contextual ? "Use this input to explore the current demand." : "Questions will shape this workspace in a later design increment."}</p>
  </form>;
}
