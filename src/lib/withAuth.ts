import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { UnauthorizedError, ForbiddenError, formatApiErrorResponse } from "./errors";

export type UserRole = "admin" | "editor" | "customer";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

export type AuthenticatedRouteHandler = (
  req: AuthenticatedRequest,
  context?: unknown
) => Promise<NextResponse | Response>;

/**
 * Reusable Higher-Order Wrapper for API Endpoints powered by Clerk.
 */
export function withAuth(handler: AuthenticatedRouteHandler, allowedRoles?: UserRole[]) {
  return async (req: Request, context?: unknown): Promise<NextResponse | Response> => {
    try {
      const { userId } = await auth();

      if (!userId) {
        throw new UnauthorizedError("Authentication required. Please log in.");
      }

      const clerkUser = await currentUser();
      const email = clerkUser?.primaryEmailAddress?.emailAddress || "";
      const role = (clerkUser?.publicMetadata?.role as UserRole) || "customer";

      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(role)) {
          throw new ForbiddenError(
            `Access denied. Role '${role}' is not authorized to access this resource.`
          );
        }
      }

      (req as AuthenticatedRequest).user = {
        userId,
        email,
        role,
      };

      return await handler(req as AuthenticatedRequest, context);
    } catch (err) {
      const errorResponse = formatApiErrorResponse(err);
      const statusCode = err && typeof err === "object" && "statusCode" in err ? (err.statusCode as number) : 500;
      return NextResponse.json(errorResponse, { status: statusCode });
    }
  };
}

