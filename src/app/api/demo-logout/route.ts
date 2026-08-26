import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({ name: "income-tax-demo-session", value: "", httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
