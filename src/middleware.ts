import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/profile(.*)",
  "/settings(.*)",
  "/account(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/login",
  "/register",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Redirect legacy /dashboard requests to /account
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return NextResponse.redirect(new URL("/account", req.url));
  }

  const session = await auth();

  if (isProtectedRoute(req) && !session.userId) {
    await auth.protect();
  }

  if (isAuthRoute(req) && session.userId) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "/account";
    return NextResponse.redirect(new URL(callbackUrl, req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

