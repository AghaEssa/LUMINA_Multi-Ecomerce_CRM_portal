import { NextResponse } from "next/server";
import { validateSafeRedirect } from "@/lib/urlSecurity";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const requestId = `req-${Math.random().toString(36).substring(2, 8)}`;
  const url = new URL(request.url);
  const rawTarget = url.searchParams.get("redirectTo");

  const safeTarget = validateSafeRedirect(rawTarget, "/");

  if (rawTarget && safeTarget !== rawTarget) {
    logger.warn("Open Redirect attempt blocked by URL security validation", {
      requestId,
      attemptedTarget: rawTarget,
      sanitizedTarget: safeTarget,
    });
  } else {
    logger.info("Safe redirect target processed", {
      requestId,
      target: safeTarget,
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      original: rawTarget,
      safeRedirectUrl: safeTarget,
    },
    requestId,
  });
}
