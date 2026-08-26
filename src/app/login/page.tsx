import Link from "next/link";
import { ArrowLeft, FileCheck2, ShieldCheck } from "lucide-react";
import DemoLoginForm from "../../components/auth/DemoLoginForm";

export default function LoginPage() {
  return <main className="login-page"><div className="login-shell"><section className="login-context"><Link className="public-brand login-brand" href="/"><span aria-hidden="true">IT</span><div><strong>Income Tax</strong><small>Citizen assistance prototype</small></div></Link><div className="login-marketing"><p className="public-kicker">Synthetic citizen account</p><h1>Review your account with clarity.</h1><p>Review a professional Income Tax account, understand an outstanding demand and follow the assisted resolution journey.</p><ul><li><ShieldCheck aria-hidden="true" />No real taxpayer information</li><li><FileCheck2 aria-hidden="true" />Every submission remains citizen-controlled</li></ul></div><Link className="public-text-link login-back" href="/"><ArrowLeft aria-hidden="true" />Back to overview</Link></section><section className="login-panel" aria-labelledby="login-title"><header><p className="public-kicker">Account access</p><h2 id="login-title">Sign in to your tax account</h2></header><DemoLoginForm /></section></div></main>;
}
