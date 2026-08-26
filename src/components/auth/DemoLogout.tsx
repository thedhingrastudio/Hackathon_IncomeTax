"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DemoLogout() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/demo-logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return <button aria-label="Log out of demo" className="demo-logout" onClick={logout} title="Log out" type="button"><LogOut aria-hidden="true" /></button>;
}
