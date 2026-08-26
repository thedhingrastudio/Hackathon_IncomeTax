"use client";

import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function DemoLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateUserId(value: string) {
    setUserId(value);
    if (error) setError("");
  }

  function updatePassword(value: string) {
    setPassword(value);
    if (error) setError("");
  }

  function useTestAccount() {
    setUserId("rohan.mehta");
    setPassword("Demo@123");
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const response = await fetch("/api/demo-login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ userId, password }) });
    setSubmitting(false);
    if (!response.ok) { setError("User ID or password is incorrect."); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return <form className="demo-login-form" onSubmit={submit}>
    <div className="login-field"><label htmlFor="userId">User ID</label><input autoComplete="username" id="userId" name="userId" onChange={(event) => updateUserId(event.target.value)} required value={userId} /></div>
    <div className="login-field"><label htmlFor="password">Password</label><div className="password-control"><input autoComplete="current-password" id="password" name="password" onChange={(event) => updatePassword(event.target.value)} required type={showPassword ? "text" : "password"} value={password} /><button aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)} type="button">{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></div></div>
    {error ? <p className="login-error" role="alert">{error}</p> : null}
    <button className="public-button public-button-primary login-submit" disabled={submitting} type="submit"><LogIn aria-hidden="true" />{submitting ? "Signing in…" : "Sign in"}</button>
    <div className="demo-credentials" role="note"><strong>Test account</strong><p>Rohan Mehta</p><dl><div><dt>User ID</dt><dd>rohan.mehta</dd></div><div><dt>Password</dt><dd>Demo@123</dd></div></dl><button onClick={useTestAccount} type="button">Use test account</button></div>
  </form>;
}
