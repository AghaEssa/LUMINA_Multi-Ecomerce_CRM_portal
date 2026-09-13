import { NextResponse } from "next/server";
import { formatApiErrorResponse, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const requestId = `req-${Math.random().toString(36).substring(2, 8)}`;
  const url = new URL(request.url);

  logger.info("Health API check request received", {
    requestId,
    path: url.pathname,
  });

  return NextResponse.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    requestId,
  });
}

export async function POST(request: Request) {
  const requestId = `req-${Math.random().toString(36).substring(2, 8)}`;

  try {
    const body = await request.json().catch(() => ({}));

    // Log incoming payload with AUTOMATIC PII REDACTION (e.g. passwords/tokens will be masked)
    logger.info("Health check POST payload received", {
      requestId,
      payload: body,
    });

    if (!body.email || typeof body.email !== "string" || !body.email.includes("@")) {
      throw new ValidationError("The email provided is not formatted correctly.", {
        field: "email",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Health validation passed.",
      requestId,
    });
  } catch (error) {
    const errorPayload = formatApiErrorResponse(error, requestId);
    const statusCode = error instanceof ValidationError ? error.statusCode : 500;

    logger.error("API error caught in route handler", error, { requestId });

    return NextResponse.json(errorPayload, { status: statusCode });
  }
}
