import { ArrowRight } from "lucide-react";

const sets = {
  home: ["Why do I owe ₹18,420?", "Did my payment go through?", "What should I do next?", "What dates should I remember?"],
  understanding: ["Do I need to pay again?", "What records did you check?", "What should I do next?"],
  action: ["Why are there two steps?", "What happens after I submit?", "What records did you use?"],
  tracking: ["What happens next?", "Do I need to do anything?", "Show my submitted requests", "What dates should I remember?"],
} as const;

export type QuestionSet = keyof typeof sets;

export default function ContextualQuestions({ onAsk, set }: { onAsk: (question: string) => void; set: QuestionSet }) {
  return <section className="contextual-questions" aria-labelledby="contextual-questions-title"><h3 id="contextual-questions-title">You can ask</h3><div>{sets[set].map((question) => <button key={question} onClick={() => onAsk(question)} type="button"><span>{question}</span><ArrowRight aria-hidden="true" /></button>)}</div></section>;
}
