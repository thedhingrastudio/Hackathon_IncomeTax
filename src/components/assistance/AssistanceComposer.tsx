"use client";

import { Mic, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AssistanceComposer({ caseContext = false, contextual = false, onAsk }: { caseContext?: boolean; contextual?: boolean; onAsk: (question: string) => void }) {
  const [question, setQuestion] = useState("");
  return <form className="assistance-composer" onSubmit={(event) => { event.preventDefault(); const next = question.trim(); if (!next) return; onAsk(next); setQuestion(""); }}>
    <label htmlFor="assistance-question">{caseContext ? "Ask about this case" : "Ask about your taxes"}</label>
    <div className="assistance-composer-row">
      <Input id="assistance-question" name="question" onChange={(event) => setQuestion(event.target.value)} placeholder={caseContext ? "Ask about this case…" : contextual ? "Ask a follow-up…" : "Ask about your taxes…"} type="text" value={question} />
      <Button aria-label="Voice input is not available in this demo" disabled size="icon-lg" type="button" variant="ghost"><Mic aria-hidden="true" /></Button>
      <Button aria-label="Send question" disabled={!question.trim()} size="icon-lg" type="submit"><Send aria-hidden="true" /></Button>
    </div>
    <p>{caseContext ? "Ask about the current status or what happens next." : contextual ? "Ask about this demand or the records used to explain it." : "Ask about your account, records or actions."}</p>
  </form>;
}
