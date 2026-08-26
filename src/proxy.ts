import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const authenticated = request.cookies.get("income-tax-demo-session")?.value === "rohan-mehta-demo";
  if (!authenticated) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/returns/:path*", "/payments/:path*", "/pending-actions/:path*", "/services/:path*", "/help/:path*", "/case/:path*"],
};
