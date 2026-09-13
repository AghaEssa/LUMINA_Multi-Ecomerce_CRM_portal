import { connectToDatabase } from "./mongodb";
import { AuditLog } from "@/models/AuditLog";

export interface AuditEventParams {
  userId?: string | null;
  email?: string;
  action: string;
  status: "SUCCESS" | "FAILURE" | "WARNING";
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

export function extractRequestMeta(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || "unknown";
  return { ipAddress, userAgent };
}

/**
 * Logs critical security events (login attempts, 2FA events, RBAC denials) to MongoDB & stdout.
 */
export async function logAuditEvent(params: AuditEventParams): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    console.log(
      `[SECURITY AUDIT] [${params.status}] ${params.action} - User: ${params.email || params.userId || "anonymous"} (IP: ${
        params.ipAddress || "unknown"
      })`
    );

    await connectToDatabase();
    await AuditLog.create({
      userId: params.userId || null,
      email: params.email || "",
      action: params.action,
      status: params.status,
      ipAddress: params.ipAddress || "127.0.0.1",
      userAgent: params.userAgent || "unknown",
      details: params.details || {},
    });
  } catch (err) {
    console.error("[SECURITY AUDIT LOG ERROR]:", err);
  }
}
