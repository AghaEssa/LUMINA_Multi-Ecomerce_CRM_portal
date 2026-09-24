import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/tokens";

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

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Extract tokens from cookies
  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  let isAuthenticated = false;

  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload) {
      isAuthenticated = true;
    }
  }

  // If access token expired but refresh token exists, treat as candidate for session renewal
  if (!isAuthenticated && refreshToken) {
    isAuthenticated = true; // Refresh token route will handle renewal
  }

  // 1. Unauthenticated users trying to access protected paths -> Redirect to /login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated users visiting /login or /register -> Redirect to callbackUrl or /account
  if (isAuthRoute && isAuthenticated) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "/account";
    return NextResponse.redirect(new URL(callbackUrl, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/account/:path*",
    "/login",
    "/register",
  ],
};
