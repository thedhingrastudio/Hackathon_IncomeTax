import { NextResponse } from "next/server";

const sessionCookie = "income-tax-demo-session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { userId?: unknown; password?: unknown } | null;
  if (body?.userId !== "rohan.mehta" || body.password !== "Demo@123") return NextResponse.json({ success: false }, { status: 401 });
  const response = NextResponse.json({ success: true });
  response.cookies.set({ name: sessionCookie, value: "rohan-mehta-demo", httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
