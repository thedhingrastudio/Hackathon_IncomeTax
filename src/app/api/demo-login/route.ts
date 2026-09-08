import { NextResponse } from "next/server";

const sessionCookie = "income-tax-demo-session";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const isForm = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
  const body = isForm
    ? Object.fromEntries(await request.formData())
    : await request.json().catch(() => null) as { userId?: unknown; password?: unknown } | null;
  if (body?.userId !== "rohan.mehta" || body.password !== "Demo@123") {
    return isForm ? new NextResponse('<!doctype html><meta http-equiv="refresh" content="0;url=/login?error=credentials"><a href="/login?error=credentials">Return to sign in</a>', { status: 401, headers: { "content-type": "text/html; charset=utf-8" } }) : NextResponse.json({ success: false }, { status: 401 });
  }
  const response = isForm ? new NextResponse('<!doctype html><meta http-equiv="refresh" content="0;url=/dashboard"><a href="/dashboard">Open dashboard</a>', { headers: { "content-type": "text/html; charset=utf-8" } }) : NextResponse.json({ success: true });
  response.cookies.set({ name: sessionCookie, value: "rohan-mehta-demo", httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
