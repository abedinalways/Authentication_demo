import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_CONFIG } from "@/lib/config";

// Public pages: if you're already logged in you don't need to see them.
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
  "/success",
];

/**
 * Optimistic route gate (Next 16 renamed middleware → proxy).
 * Presence of the accessToken cookie decides, so it runs fast on the edge.
 * The API is the real source of truth — expired tokens get a 401 there and
 * are handled by the auto-refresh baseQuery.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccessToken = request.cookies.has(APP_CONFIG.accessTokenCookie);

  if (pathname.startsWith("/dashboard")) {
    if (!hasAccessToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname) && hasAccessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
    "/success",
  ],
};