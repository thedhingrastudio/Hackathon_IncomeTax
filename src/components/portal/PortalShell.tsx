"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
const navigation = [["Dashboard", "/"], ["Returns", "/returns"], ["Payments", "/payments"], ["Pending Actions", "/pending-actions"], ["Services", "/services"], ["Help", "/help"]] as const;
export default function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname(); const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
  return <div className="site-shell">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className="prototype-strip">Prototype · Synthetic data only · Not connected to live Income Tax systems</div>
    <header><div className="government-masthead"><div className="portal-container government-masthead__inner"><span>भारत सरकार</span><span aria-hidden="true">|</span><span>Government of India</span></div></div>
      <nav className="ux4g-navbar portal-navbar" aria-label="Primary navigation"><div className="ux4g-navbar-wrap portal-container">
        <Link className="service-identity" href="/" aria-label="Income Tax e-Filing home"><span className="service-emblem" aria-hidden="true">IT</span><span><strong>Income Tax</strong><small>e-Filing portal</small></span></Link>
        <button ref={menuButtonRef} className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md menu-button" type="button" aria-expanded={open} aria-controls="primary-menu" onClick={() => setOpen(!open)}><span aria-hidden="true">☰</span> Menu</button>
        <ul className={`ux4g-navbar-links portal-links ${open ? "is-open" : ""}`} id="primary-menu">{navigation.map(([label, href]) => <li key={href}><Link aria-current={pathname === href ? "page" : undefined} href={href} onClick={() => setOpen(false)}>{label}</Link></li>)}</ul>
        <div className="ux4g-navbar-right taxpayer-summary"><span aria-hidden="true">RM</span><div><strong>Rohan Mehta</strong><small>Individual taxpayer</small></div></div>
      </div></nav>
    </header>
    <main className="portal-container main-content" id="main-content" tabIndex={-1}>{children}</main>
    <footer className="ux4g-footer-wrapper ux4g-footer-primary portal-footer"><div className="ux4g-footer-row portal-container"><p>Income Tax Assistance Prototype</p><p>Synthetic data only · Hackathon demonstration</p></div></footer>
  </div>;
}
