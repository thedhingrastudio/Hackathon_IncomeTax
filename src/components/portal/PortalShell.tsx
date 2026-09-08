"use client";
import Link from "next/link";
import { Bell, CircleHelp, FileText, Globe2, Grid3X3, Home, Menu, ReceiptText, Search, TriangleAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { OutstandingDemand } from "../../types/tax";
import type { DemandUnderstanding } from "../../lib/ai";
import {
  createTaxDemandCase,
  prepareAssistedDemandResponse,
  prepareRectificationDraft,
  recordDemandResponse,
  recordRectification,
  submitAssistedDemandResponse,
  submitRectification,
  transitionCase,
  type AssistedDemandResponseDraft,
  type AssistedDemandResponseSubmission,
  type RectificationDraft,
  type RectificationSubmission,
} from "../../lib/workflows";
import { getStoredCase, saveCase } from "../../lib/storage/case-storage";
import { routeAssistanceQuestion, type AssistanceQuestionIntent } from "../../lib/assistance/question-router";
import AssistanceWorkspace, { type AssistanceSurface } from "../assistance/AssistanceWorkspace";
import DemoLogout from "../auth/DemoLogout";
import { DitherAvatar } from "../dither-kit/avatar";
const navigation = [["Dashboard", "/dashboard", Home], ["Returns", "/returns", FileText], ["Payments", "/payments", ReceiptText], ["Pending Actions", "/pending-actions", TriangleAlert], ["Services", "/services", Grid3X3], ["Help", "/help", CircleHelp]] as const;
const assistanceId = "assistance-workspace";
export default function PortalShell({ children, taxpayerId, taxpayerName, demand, understanding }: { children: ReactNode; taxpayerId: string; taxpayerName: string; demand: OutstandingDemand; understanding: DemandUnderstanding | null }) {
  const pathname = usePathname(); const router = useRouter(); const opensGuidedWorkspace = pathname.endsWith("/workspace"); const [open, setOpen] = useState(false); const [assistanceOpen, setAssistanceOpen] = useState(opensGuidedWorkspace); const [assistanceSurface, setAssistanceSurface] = useState<AssistanceSurface>(opensGuidedWorkspace ? "understanding" : "home");
  const [homeAssembled, setHomeAssembled] = useState(false);
  const [questionMode, setQuestionMode] = useState(false);
  const [reconfiguring, setReconfiguring] = useState(false);
  const [rectificationDraft, setRectificationDraft] = useState<RectificationDraft | null>(null);
  const [rectificationSubmission, setRectificationSubmission] = useState<RectificationSubmission | null>(null);
  const [responseDraft, setResponseDraft] = useState<AssistedDemandResponseDraft | null>(null);
  const [responseSubmission, setResponseSubmission] = useState<AssistedDemandResponseSubmission | null>(null);
  const [assistanceHistory, setAssistanceHistory] = useState<AssistanceSurface[]>([]);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const assistanceCloseRef = useRef<HTMLButtonElement>(null);
  const checkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const questionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markHomeAssembled = useCallback(() => setHomeAssembled(true), []);

  useEffect(() => {
    function closeMenu(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", closeMenu);
    return () => document.removeEventListener("keydown", closeMenu);
  }, [open]);
  useEffect(() => {
    function closeAssistance(event: KeyboardEvent) {
      if (event.key === "Escape" && assistanceOpen) {
        setAssistanceOpen(false);
        window.setTimeout(() => document.getElementById("main-content")?.focus(), 0);
      }
    }
    document.addEventListener("keydown", closeAssistance);
    return () => document.removeEventListener("keydown", closeAssistance);
  }, [assistanceOpen]);
  useEffect(() => () => { if (checkingTimerRef.current) clearTimeout(checkingTimerRef.current); if (questionTimerRef.current) clearTimeout(questionTimerRef.current); }, []);

  function closeAssistance() {
    setAssistanceOpen(false);
    window.setTimeout(() => document.getElementById("main-content")?.focus(), 0);
  }

  function showAssistanceSurface(next: AssistanceSurface, mode: "push" | "replace" | "reset" = "push") {
    if (mode === "reset") setAssistanceHistory([]);
    else if (mode === "push" && next !== assistanceSurface) setAssistanceHistory((history) => [...history, assistanceSurface]);
    setAssistanceSurface(next);
  }

  function goBackInAssistance() {
    if (checkingTimerRef.current) clearTimeout(checkingTimerRef.current);
    if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    setReconfiguring(false);
    setAssistanceHistory((history) => {
      const previous = history.at(-1);
      if (!previous) return history;
      setAssistanceSurface(previous);
      if (previous === "home") setQuestionMode(false);
      return history.slice(0, -1);
    });
  }

  function understandDemand() {
    setQuestionMode(false);
    router.push("/pending-actions/demand");
    if (!understanding) { showAssistanceSurface("understanding"); return; }
    showAssistanceSurface("checking");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    checkingTimerRef.current = setTimeout(() => showAssistanceSurface("understanding", "replace"), reducedMotion ? 0 : 1050);
  }

  function showQuestionIntent(intent: AssistanceQuestionIntent) {
    const taxCase = getStoredCase();
    if (intent === "attention") { setQuestionMode(false); showAssistanceSurface("home", "reset"); return; }
    if (intent === "explain_demand") { router.push("/pending-actions/demand"); showAssistanceSurface("understanding"); return; }
    if (intent === "payment_status") { showAssistanceSurface("payment"); return; }
    if (intent === "dates") { showAssistanceSurface("dates"); return; }
    if (intent === "form_26as") { showAssistanceSurface("form_26as"); return; }
    if (intent === "return_status") { showAssistanceSurface("return_status"); return; }
    if (intent === "source_trace") { showAssistanceSurface("evidence"); return; }
    if (intent === "pay_again") { showAssistanceSurface("pay_again"); return; }
    if (intent === "case_status") {
      showAssistanceSurface(taxCase?.state === "WAITING_FOR_REVIEW" ? "tracking" : taxCase ? "action" : "no_case");
      return;
    }
    if (intent === "next_action") {
      showAssistanceSurface(taxCase?.state === "WAITING_FOR_REVIEW" ? "tracking" : "action");
      return;
    }
    showAssistanceSurface("unsupported");
  }

  function askAssistance(question: string) {
    setQuestionMode(true);
    setReconfiguring(true);
    if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    questionTimerRef.current = setTimeout(() => { showQuestionIntent(routeAssistanceQuestion(question)); setReconfiguring(false); }, reducedMotion ? 0 : 340);
  }

  function returnToOverview() {
    if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    setReconfiguring(false);
    setQuestionMode(false);
    showAssistanceSurface("home", "reset");
  }

  function showCorrectivePlan() {
    if (!understanding || understanding.specification.primaryAction.actionId !== "start_corrective_plan") return;
    showAssistanceSurface("action");
  }

  function reviewRectification() {
    if (!understanding || understanding.specification.primaryAction.actionId !== "start_corrective_plan") return;
    const prepared = prepareRectificationDraft(understanding.workflowContext);
    if (!prepared.success) return;
    let taxCase = getStoredCase() ?? createTaxDemandCase(understanding.evidence, taxpayerId);
    if (taxCase.state === "PLAN_READY") taxCase = transitionCase(taxCase, "RECTIFICATION_REVIEW") ?? taxCase;
    saveCase(taxCase);
    setRectificationDraft(prepared.data);
    showAssistanceSurface("rectification_review");
  }

  function confirmRectification() {
    if (!understanding || !rectificationDraft) return;
    const submitted = submitRectification(rectificationDraft, understanding.evidence, rectificationSubmission);
    if (!submitted.success) return;
    const taxCase = getStoredCase();
    if (!taxCase) return;
    const recorded = recordRectification(taxCase, submitted.data);
    if (!recorded) return;
    saveCase(recorded);
    setRectificationSubmission(submitted.data);
    setAssistanceHistory((history) => history.filter((surface, index) => surface !== "rectification_review" && !(surface === "action" && index === history.length - 1)));
    setAssistanceSurface("action");
  }

  function reviewDemandResponse() {
    if (!understanding) return;
    const saved = getStoredCase();
    const submittedCorrection = rectificationSubmission ?? (saved?.rectificationReference ? {
      reference: saved.rectificationReference,
      status: "submitted" as const,
      assessmentYear: saved.assessmentYear,
      amount: saved.demandAmount,
      correction: "tax_credit_mismatch" as const,
    } : null);
    const prepared = prepareAssistedDemandResponse(understanding.workflowContext, submittedCorrection);
    if (!prepared.success || !saved || !submittedCorrection) return;
    const reviewing = saved.state === "DEMAND_RESPONSE_REVIEW" ? saved : transitionCase(saved, "DEMAND_RESPONSE_REVIEW");
    if (!reviewing) return;
    saveCase(reviewing);
    setRectificationSubmission(submittedCorrection);
    setResponseDraft(prepared.data);
    showAssistanceSurface("demand_response_review");
  }

  function confirmDemandResponse() {
    if (!responseDraft || !rectificationSubmission) return;
    const submitted = submitAssistedDemandResponse(responseDraft, rectificationSubmission);
    if (!submitted.success) return;
    const taxCase = getStoredCase();
    if (!taxCase) return;
    const recorded = recordDemandResponse(taxCase, submitted.data);
    if (!recorded) return;
    saveCase(recorded);
    setResponseSubmission(submitted.data);
    setAssistanceHistory([]);
    setAssistanceSurface("demand_response_submitted");
  }

  useEffect(() => {
    function handleWorkspaceRequest(event: Event) {
      const question = (event as CustomEvent<{ question?: string }>).detail?.question?.trim();
      setAssistanceOpen(true);
      setOpen(false);
      window.setTimeout(() => assistanceCloseRef.current?.focus(), 0);
      if (question) askAssistance(question);
      else showAssistanceSurface("home", "reset");
    }
    window.addEventListener("civic:open-workspace", handleWorkspaceRequest);
    return () => window.removeEventListener("civic:open-workspace", handleWorkspaceRequest);
  });

  if (pathname === "/" || pathname === "/login") return <>{children}</>;

  return <div className={`desktop-workspace revised-workspace ${assistanceOpen ? "is-open" : "is-closed"}`}>
  <div className="portal-workspace revised-portal-workspace">
  <div className="site-shell revised-app-shell">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <header className="civic-app-header">
      <Link className="revised-app-brand" href="/dashboard" aria-label="Civic Portal dashboard"><span aria-hidden="true"><Grid3X3 /></span><strong>Civic Portal</strong></Link>
      <nav aria-label="Primary navigation"><Link aria-current={pathname === "/dashboard" ? "page" : undefined} href="/dashboard">Home</Link><Link aria-current={pathname.startsWith("/services") ? "page" : undefined} href="/services">All services</Link><Link aria-current={pathname.startsWith("/returns") || pathname.startsWith("/payments") ? "page" : undefined} href="/returns">Your records</Link><Link aria-current={pathname.startsWith("/help") ? "page" : undefined} href="/help">Help</Link></nav>
      <div className="civic-header-tools"><button aria-label="Search services" type="button"><Search aria-hidden="true" /></button><span><Globe2 aria-hidden="true" />English</span><button aria-label="Notifications" type="button"><Bell aria-hidden="true" /></button><div><DitherAvatar animate={false} name={taxpayerName} size={36} /><span><small>Hello,</small><strong>{taxpayerName.split(" ")[0]}</strong></span></div><DemoLogout /></div>
      <button ref={menuButtonRef} className="portal-menu-button civic-menu-button" type="button" aria-expanded={open} aria-controls="mobile-primary-menu" onClick={() => setOpen((current) => !current)}><Menu aria-hidden="true" /> Menu</button>
    </header>
    <div className={`mobile-navigation revised-mobile-navigation ${open ? "is-open" : ""}`} id="mobile-primary-menu" hidden={!open}><ul>{navigation.map(([label, href, Icon]) => { const isCurrent = pathname === href || pathname.startsWith(`${href}/`); return <li key={href}><Link aria-current={isCurrent ? "page" : undefined} href={href} onClick={() => setOpen(false)}><Icon aria-hidden="true" />{label}</Link></li>; })}</ul></div>
    <main className="main-content revised-main-content" id="main-content" tabIndex={-1}>{children}</main>
    <footer className="portal-footer revised-app-footer"><p>Generative public services · Synthetic demonstration</p></footer>
  </div>
  </div>
  {assistanceOpen ? <AssistanceWorkspace assembleHome={!homeAssembled} canGoBack={assistanceSurface !== "home" && assistanceHistory.length > 0} closeButtonRef={assistanceCloseRef} demand={demand} id={assistanceId} onAsk={askAssistance} onBack={goBackInAssistance} onBackToAction={goBackInAssistance} onClose={closeAssistance} onConfirmDemandResponse={confirmDemandResponse} onConfirmRectification={confirmRectification} onFix={assistanceSurface === "action" ? reviewRectification : showCorrectivePlan} onHomeAssembled={markHomeAssembled} onOverview={returnToOverview} onQuestionNextAction={() => showQuestionIntent("next_action")} onReviewResponse={reviewDemandResponse} onUnderstand={understandDemand} onViewCase={() => showAssistanceSurface("tracking")} questionMode={questionMode} reconfiguring={reconfiguring} rectificationDraft={rectificationDraft} rectificationSubmission={rectificationSubmission} responseDraft={responseDraft} responseSubmission={responseSubmission} surface={assistanceSurface} taxpayerName={taxpayerName} understanding={understanding} /> : null}
  </div>;
}
