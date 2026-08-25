"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
import AssistanceDrawerHandle from "../assistance/AssistanceDrawerHandle";
import AssistanceWorkspace, { type AssistanceSurface } from "../assistance/AssistanceWorkspace";
import { AIAssistanceControl } from "./AIAssistancePreference";
const navigation = [["Dashboard", "/"], ["Returns", "/returns"], ["Payments & Tax Records", "/payments"], ["Pending Actions", "/pending-actions"], ["Services", "/services"], ["Help", "/help"]] as const;
const assistanceId = "assistance-workspace";
export default function PortalShell({ children, taxpayerId, taxpayerName, demand, understanding }: { children: ReactNode; taxpayerId: string; taxpayerName: string; demand: OutstandingDemand; understanding: DemandUnderstanding | null }) {
  const pathname = usePathname(); const router = useRouter(); const [open, setOpen] = useState(false); const [assistanceOpen, setAssistanceOpen] = useState(false); const [assistanceSurface, setAssistanceSurface] = useState<AssistanceSurface>("home");
  const [rectificationDraft, setRectificationDraft] = useState<RectificationDraft | null>(null);
  const [rectificationSubmission, setRectificationSubmission] = useState<RectificationSubmission | null>(null);
  const [responseDraft, setResponseDraft] = useState<AssistedDemandResponseDraft | null>(null);
  const [responseSubmission, setResponseSubmission] = useState<AssistedDemandResponseSubmission | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const assistanceHandleRef = useRef<HTMLButtonElement>(null);
  const assistanceCloseRef = useRef<HTMLButtonElement>(null);
  const checkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const taxpayerInitials = taxpayerName.split(" ").map((part) => part[0]).join("");

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
        window.setTimeout(() => assistanceHandleRef.current?.focus(), 0);
      }
    }
    document.addEventListener("keydown", closeAssistance);
    return () => document.removeEventListener("keydown", closeAssistance);
  }, [assistanceOpen]);
  useEffect(() => () => { if (checkingTimerRef.current) clearTimeout(checkingTimerRef.current); }, []);

  function openAssistance() {
    setAssistanceOpen(true);
    window.setTimeout(() => assistanceCloseRef.current?.focus(), 0);
  }

  function closeAssistance() {
    setAssistanceOpen(false);
    window.setTimeout(() => assistanceHandleRef.current?.focus(), 0);
  }

  function understandDemand() {
    router.push("/pending-actions/demand");
    if (!understanding) { setAssistanceSurface("understanding"); return; }
    setAssistanceSurface("checking");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    checkingTimerRef.current = setTimeout(() => setAssistanceSurface("understanding"), reducedMotion ? 0 : 1050);
  }

  function showCorrectivePlan() {
    if (!understanding || understanding.specification.primaryAction.actionId !== "start_corrective_plan") return;
    setAssistanceSurface("action");
  }

  function reviewRectification() {
    if (!understanding || understanding.specification.primaryAction.actionId !== "start_corrective_plan") return;
    const prepared = prepareRectificationDraft(understanding.workflowContext);
    if (!prepared.success) return;
    let taxCase = getStoredCase() ?? createTaxDemandCase(understanding.evidence, taxpayerId);
    if (taxCase.state === "PLAN_READY") taxCase = transitionCase(taxCase, "RECTIFICATION_REVIEW") ?? taxCase;
    saveCase(taxCase);
    setRectificationDraft(prepared.data);
    setAssistanceSurface("rectification_review");
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
    setAssistanceSurface("demand_response_review");
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
    setAssistanceSurface("demand_response_submitted");
  }

  return <div className={`desktop-workspace ${assistanceOpen ? "is-open" : "is-closed"}`}>
  <div className="portal-workspace">
  <div className="site-shell">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <header><div className="government-masthead"><div className="portal-container government-masthead__inner"><span>भारत सरकार</span><span aria-hidden="true">|</span><span>Government of India</span></div></div>
      <nav className="ux4g-navbar portal-navbar" aria-label="Primary navigation"><div className="ux4g-navbar-wrap portal-container">
        <Link className="service-identity" href="/" aria-label="Income Tax e-Filing home"><span className="service-emblem" aria-hidden="true">IT</span><span><strong>Income Tax</strong><small>e-Filing portal</small></span></Link>
        <button ref={menuButtonRef} className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md menu-button" type="button" aria-expanded={open} aria-controls="mobile-primary-menu" onClick={() => setOpen((current) => !current)}><span aria-hidden="true">☰</span> Menu</button>
        <ul className="ux4g-navbar-links portal-links desktop-portal-links">{navigation.map(([label, href]) => { const isCurrent = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)); return <li key={href}><Link aria-current={isCurrent ? "page" : undefined} href={href}>{label}</Link></li>; })}</ul>
        <div className="ux4g-navbar-right taxpayer-summary"><span aria-hidden="true">{taxpayerInitials}</span><div><strong>{taxpayerName}</strong><small>Individual taxpayer</small></div></div>
        <div className={`mobile-navigation ${open ? "is-open" : ""}`} id="mobile-primary-menu" hidden={!open}><ul className="mobile-navigation__links">{navigation.map(([label, href]) => { const isCurrent = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)); return <li key={href}><Link aria-current={isCurrent ? "page" : undefined} href={href} onClick={() => setOpen(false)}>{label}</Link></li>; })}</ul><AIAssistanceControl idPrefix="mobile-ai-preference" compact /></div>
      </div></nav>
    </header>
    <main className="portal-container main-content" id="main-content" tabIndex={-1}>{children}</main>
    <footer className="ux4g-footer-wrapper portal-footer"><div className="ux4g-footer-row portal-container"><p>Income Tax e-Filing</p><p>Synthetic demo data</p></div></footer>
  </div>
  </div>
  <div className="assistance-handle-anchor"><AssistanceDrawerHandle controls={assistanceId} expanded={assistanceOpen} handleRef={assistanceHandleRef} onOpen={openAssistance} /></div>
  {assistanceOpen ? <AssistanceWorkspace closeButtonRef={assistanceCloseRef} demand={demand} id={assistanceId} onBackToAction={() => setAssistanceSurface("action")} onClose={closeAssistance} onConfirmDemandResponse={confirmDemandResponse} onConfirmRectification={confirmRectification} onFix={assistanceSurface === "action" ? reviewRectification : showCorrectivePlan} onReviewResponse={reviewDemandResponse} onUnderstand={understandDemand} onViewCase={() => setAssistanceSurface("tracking")} rectificationDraft={rectificationDraft} rectificationSubmission={rectificationSubmission} responseDraft={responseDraft} responseSubmission={responseSubmission} surface={assistanceSurface} taxpayerName={taxpayerName} understanding={understanding} /> : null}
  </div>;
}
