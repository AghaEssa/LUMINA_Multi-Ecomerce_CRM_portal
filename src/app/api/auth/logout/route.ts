import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyAccessToken, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, getCookieOptions } from "@/lib/tokens";
import { logAuditEvent, extractRequestMeta } from "@/lib/audit";

export async function POST(req: Request) {
  const { ipAddress, userAgent } = extractRequestMeta(req);

  try {
    const cookies = req.headers.get("cookie") || "";
    const match = cookies.match(new RegExp(`${ACCESS_TOKEN_COOKIE}=([^;]+)`));
    const token = match ? match[1] : null;

    if (token) {
      const userPayload = await verifyAccessToken(token);
      if (userPayload) {
        await connectToDatabase();
        await User.findByIdAndUpdate(userPayload.userId, { refreshTokenHash: null });

        await logAuditEvent({
          userId: userPayload.userId,
          email: userPayload.email,
          action: "LOGOUT_SUCCESS",
          status: "SUCCESS",
          ipAddress,
          userAgent,
        });
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    response.cookies.set(ACCESS_TOKEN_COOKIE, "", getCookieOptions(0));
    response.cookies.set(REFRESH_TOKEN_COOKIE, "", getCookieOptions(0));

    return response;
  } catch {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
    response.cookies.set(ACCESS_TOKEN_COOKIE, "", getCookieOptions(0));
    response.cookies.set(REFRESH_TOKEN_COOKIE, "", getCookieOptions(0));
    return response;
  }
}
