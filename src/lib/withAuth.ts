import { NextResponse } from "next/server";
import { type UserRole } from "@/models/User";
import { verifyAccessToken, ACCESS_TOKEN_COOKIE, type AccessTokenPayload } from "./tokens";
import { UnauthorizedError, ForbiddenError, formatApiErrorResponse } from "./errors";
import { logAuditEvent, extractRequestMeta } from "./audit";

export interface AuthenticatedRequest extends Request {
  user?: AccessTokenPayload;
}

export type AuthenticatedRouteHandler = (
  req: AuthenticatedRequest,
  context?: unknown
) => Promise<NextResponse | Response>;

/**
 * Reusable Higher-Order Wrapper for API Endpoints.
 * Standardizes Token Authentication, Role-Based Access Control (RBAC), and Error Handling.
 */
export function withAuth(handler: AuthenticatedRouteHandler, allowedRoles?: UserRole[]) {
  return async (req: Request, context?: unknown): Promise<NextResponse | Response> => {
    const { ipAddress, userAgent } = extractRequestMeta(req);

    try {
      // 1. Extract Access Token from cookies or Authorization header
      const cookies = req.headers.get("cookie") || "";
      const match = cookies.match(new RegExp(`${ACCESS_TOKEN_COOKIE}=([^;]+)`));
      let token = match ? match[1] : null;

      if (!token) {
        const authHeader = req.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.substring(7);
        }
      }

      if (!token) {
        throw new UnauthorizedError("Authentication token is missing. Please log in.");
      }

      // 2. Verify Access Token
      const user = await verifyAccessToken(token);
      if (!user) {
        throw new UnauthorizedError("Invalid or expired authentication token.");
      }

      // 3. Role-Based Access Control (RBAC) Verification
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          await logAuditEvent({
            userId: user.userId,
            email: user.email,
            action: "RBAC_ACCESS_DENIED",
            status: "FAILURE",
            ipAddress,
            userAgent,
            details: { requiredRoles: allowedRoles, userRole: user.role },
          });

          throw new ForbiddenError(
            `Access denied. Role '${user.role}' is not authorized to access this resource.`
          );
        }
      }

      // 4. Attach user payload to request
      (req as AuthenticatedRequest).user = user;

      // 5. Execute route handler
      return await handler(req as AuthenticatedRequest, context);
    } catch (err) {
      const errorResponse = formatApiErrorResponse(err);
      const statusCode = err && typeof err === "object" && "statusCode" in err ? (err.statusCode as number) : 500;
      return NextResponse.json(errorResponse, { status: statusCode });
    }
  };
}
