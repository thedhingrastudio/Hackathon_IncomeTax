"use client";

import { ArrowLeft, X } from "lucide-react";
import { useEffect, useRef, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { Separator } from "@/components/ui/separator";
import type { OutstandingDemand } from "@/types/tax";
import type { DemandUnderstanding } from "@/lib/ai";
import type { AssistedDemandResponseDraft, AssistedDemandResponseSubmission, RectificationDraft, RectificationSubmission } from "@/lib/workflows";
import { useTaxDemandCase } from "@/lib/storage/case-storage";
import AssistanceComposer from "./AssistanceComposer";
import AssistanceHome from "./AssistanceHome";
import AssistanceHomeSkeleton from "./AssistanceHomeSkeleton";
import AssistanceResponseSkeleton from "./AssistanceResponseSkeleton";
import CheckingRecords from "./CheckingRecords";
import UnderstandingSurface from "./UnderstandingSurface";
import ActionWorkspace from "./ActionWorkspace";
import ContextualQuestions, { type QuestionSet } from "./ContextualQuestions";
import { DemandResponseReview, DemandResponseSubmitted, RectificationReview } from "./ConsequenceReview";
import TrackingSurface from "./TrackingSurface";
import { DatesQuestionSurface, EvidenceQuestionSurface, Form26ASQuestionSurface, NoCaseSurface, PayAgainQuestionSurface, PaymentQuestionSurface, ReturnQuestionSurface, ScopeBoundarySurface } from "./QuestionSurfaces";

export type AssistanceSurface = "home" | "checking" | "understanding" | "action" | "rectification_review" | "demand_response_review" | "demand_response_submitted" | "tracking" | "payment" | "dates" | "form_26as" | "return_status" | "evidence" | "pay_again" | "unsupported" | "no_case";

export default function AssistanceWorkspace({ closeButtonRef, demand, id, onAsk, onBackToAction, onClose, onConfirmDemandResponse, onConfirmRectification, onFix, onHomeAssembled, onOverview, onQuestionNextAction, onReviewResponse, onUnderstand, onViewCase, surface, taxpayerName, understanding, rectificationDraft, rectificationSubmission, responseDraft, responseSubmission, assembleHome, reconfiguring, questionMode }: {
  closeButtonRef: RefObject<HTMLButtonElement | null>; demand: OutstandingDemand; id: string; onAsk: (question: string) => void; onClose: () => void; onFix: () => void; onBackToAction: () => void; onConfirmDemandResponse: () => void; onConfirmRectification: () => void; onReviewResponse: () => void; onUnderstand: () => void; onViewCase: () => void; onOverview: () => void; onQuestionNextAction: () => void; surface: AssistanceSurface; taxpayerName: string; understanding: DemandUnderstanding | null; rectificationDraft: RectificationDraft | null; rectificationSubmission: RectificationSubmission | null; responseDraft: AssistedDemandResponseDraft | null; responseSubmission: AssistedDemandResponseSubmission | null; assembleHome: boolean; onHomeAssembled: () => void; reconfiguring: boolean; questionMode: boolean;
}) {
  const surfaceHeadingRef = useRef<HTMLHeadingElement>(null);
  const taxCase = useTaxDemandCase();
  const consequenceMode = surface === "rectification_review" || surface === "demand_response_review" || surface === "demand_response_submitted";
  const assemblingHome = surface === "home" && assembleHome;
  const waiting = taxCase?.state === "WAITING_FOR_REVIEW";
  useEffect(() => { if (surface !== "home" && !reconfiguring) surfaceHeadingRef.current?.focus(); }, [surface, reconfiguring]);

  let content;
  if (reconfiguring) content = <AssistanceResponseSkeleton />;
  else if (assemblingHome) content = <AssistanceHomeSkeleton onComplete={onHomeAssembled} />;
  else if (surface === "rectification_review" && rectificationDraft) content = <RectificationReview draft={rectificationDraft} headingRef={surfaceHeadingRef} onBack={onBackToAction} onConfirm={onConfirmRectification} />;
  else if (surface === "demand_response_review" && responseDraft) content = <DemandResponseReview draft={responseDraft} headingRef={surfaceHeadingRef} onBack={onBackToAction} onConfirm={onConfirmDemandResponse} />;
  else if (surface === "demand_response_submitted" && rectificationSubmission && responseSubmission) content = <DemandResponseSubmitted headingRef={surfaceHeadingRef} onViewCase={onViewCase} rectification={rectificationSubmission} response={responseSubmission} />;
  else if (surface === "tracking") content = <TrackingSurface headingRef={surfaceHeadingRef} />;
  else if (surface === "home") content = <AssistanceHome demand={demand} onUnderstand={onUnderstand} onViewCase={onViewCase} taxpayerName={taxpayerName} />;
  else if (surface === "checking" && understanding) content = <CheckingRecords evidence={understanding.evidence} headingRef={surfaceHeadingRef} />;
  else if (!understanding) content = <section className="assistance-unavailable"><h2 ref={surfaceHeadingRef} tabIndex={-1}>We couldn&apos;t safely explain this demand</h2><p>You can continue using the Outstanding Demand service on the left.</p></section>;
  else if (surface === "action") content = <ActionWorkspace headingRef={surfaceHeadingRef} onReview={onFix} onReviewResponse={onReviewResponse} understanding={understanding} />;
  else if (surface === "payment") content = <PaymentQuestionSurface understanding={understanding} />;
  else if (surface === "dates") content = <DatesQuestionSurface waitingForReview={waiting} />;
  else if (surface === "form_26as") content = <Form26ASQuestionSurface understanding={understanding} />;
  else if (surface === "return_status") content = <ReturnQuestionSurface onUnderstand={onUnderstand} understanding={understanding} />;
  else if (surface === "evidence") content = <EvidenceQuestionSurface understanding={understanding} />;
  else if (surface === "pay_again") content = <PayAgainQuestionSurface onNext={onQuestionNextAction} understanding={understanding} />;
  else if (surface === "unsupported") content = <ScopeBoundarySurface onAsk={onAsk} />;
  else if (surface === "no_case") content = <NoCaseSurface onOverview={onOverview} />;
  else content = <UnderstandingSurface headingRef={surfaceHeadingRef} onFix={onFix} understanding={understanding} />;

  let questionSet: QuestionSet | null = null;
  if (!reconfiguring && !consequenceMode && !assemblingHome) {
    if (surface === "home" && waiting) questionSet = "tracking";
    else if (surface === "understanding") questionSet = "understanding";
    else if (surface === "action") questionSet = "action";
    else if (surface === "tracking") questionSet = "tracking";
  }

  return <aside aria-label="Assistance Workspace" className="assistance-workspace" id={id}>
    <div className="assistance-workspace-bar"><div><span aria-hidden="true" className="assistance-mark">A</span><strong>Assistance</strong></div><Button aria-label="Close assistance" onClick={onClose} ref={closeButtonRef} size="icon-lg" type="button" variant="ghost"><X aria-hidden="true" /></Button></div>
    <Separator />
    <div className="assistance-workspace-scroll">
      {questionMode && !reconfiguring && surface !== "no_case" ? <Button className="assistance-back-overview" onClick={onOverview} type="button" variant="link"><ArrowLeft aria-hidden="true" />Back to overview</Button> : null}
      {surface === "rectification_review" || surface === "demand_response_review" ? content : <BlurFade key={reconfiguring ? "reconfiguring" : surface} duration={0.28}>{content}</BlurFade>}
      {questionSet ? <ContextualQuestions onAsk={onAsk} set={questionSet} /> : null}
    </div>
    {consequenceMode || assemblingHome ? null : <AssistanceComposer caseContext={surface === "tracking" || waiting} contextual={surface !== "home"} onAsk={onAsk} />}
  </aside>;
}
