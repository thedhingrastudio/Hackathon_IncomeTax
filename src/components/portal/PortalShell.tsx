"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { OutstandingDemand } from "../../types/tax";
import AssistanceDrawerHandle from "../assistance/AssistanceDrawerHandle";
import AssistanceWorkspace from "../assistance/AssistanceWorkspace";
import { AIAssistanceControl } from "./AIAssistancePreference";
const navigation = [["Dashboard", "/"], ["Returns", "/returns"], ["Payments & Tax Records", "/payments"], ["Pending Actions", "/pending-actions"], ["Services", "/services"], ["Help", "/help"]] as const;
const assistanceId = "assistance-workspace";
export default function PortalShell({ children, taxpayerName, demand }: { children: ReactNode; taxpayerName: string; demand: OutstandingDemand }) {
  const pathname = usePathname(); const [open, setOpen] = useState(false); const [assistanceOpen, setAssistanceOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const assistanceHandleRef = useRef<HTMLButtonElement>(null);
  const assistanceCloseRef = useRef<HTMLButtonElement>(null);
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

  function openAssistance() {
    setAssistanceOpen(true);
    window.setTimeout(() => assistanceCloseRef.current?.focus(), 0);
  }

  function closeAssistance() {
    setAssistanceOpen(false);
    window.setTimeout(() => assistanceHandleRef.current?.focus(), 0);
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
    <footer className="ux4g-footer-wrapper ux4g-footer-primary portal-footer"><div className="ux4g-footer-row portal-container"><p>Income Tax e-Filing</p><p>Synthetic demo data</p></div></footer>
  </div>
  </div>
  <div className="assistance-handle-anchor"><AssistanceDrawerHandle controls={assistanceId} expanded={assistanceOpen} handleRef={assistanceHandleRef} onOpen={openAssistance} /></div>
  {assistanceOpen ? <AssistanceWorkspace closeButtonRef={assistanceCloseRef} demand={demand} id={assistanceId} onClose={closeAssistance} taxpayerName={taxpayerName} /> : null}
  </div>;
}
