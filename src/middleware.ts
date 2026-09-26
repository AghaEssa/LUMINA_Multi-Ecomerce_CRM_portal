import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken, verifyRefreshToken, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/tokens";

// Protected routes requiring authentication
const PROTECTED_PREFIXES = ["/dashboard", "/admin", "/profile", "/settings", "/account"];

// Auth routes for unauthenticated users
const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 0. Redirect legacy /dashboard requests to /account
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return NextResponse.redirect(new URL("/account", req.url));
  }

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Extract tokens from cookies
  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  let hasValidAccessToken = false;
  let hasValidRefreshToken = false;

  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload) {
      hasValidAccessToken = true;
    }
  }

  if (refreshToken) {
    const refreshPayload = await verifyRefreshToken(refreshToken);
    if (refreshPayload) {
      hasValidRefreshToken = true;
    }
  }

  const isAuthenticated = hasValidAccessToken || hasValidRefreshToken;

  // 1. Unauthenticated users trying to access protected paths -> Redirect to /login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Only redirect users AWAY from /login or /register if they have a strictly valid ACCESS TOKEN.
  // If only refreshToken is present, allow /login and /register to load so user can re-authenticate or client can refresh.
  if (isAuthRoute && hasValidAccessToken) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "/account";
    return NextResponse.redirect(new URL(callbackUrl, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/profile",
    "/profile/:path*",
    "/settings",
    "/settings/:path*",
    "/account",
    "/account/:path*",
    "/login",
    "/register",
  ],
};
