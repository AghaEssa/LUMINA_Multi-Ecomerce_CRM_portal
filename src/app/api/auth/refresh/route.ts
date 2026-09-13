import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyRefreshToken, signAccessToken, signRefreshToken, getCookieOptions, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, ACCESS_TOKEN_EXPIRY_SEC, REFRESH_TOKEN_EXPIRY_SEC } from "@/lib/tokens";
import { UnauthorizedError, formatApiErrorResponse } from "@/lib/errors";
import { logAuditEvent, extractRequestMeta } from "@/lib/audit";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { ipAddress, userAgent } = extractRequestMeta(req);

  try {
    const cookies = req.headers.get("cookie") || "";
    const match = cookies.match(new RegExp(`${REFRESH_TOKEN_COOKIE}=([^;]+)`));
    const refreshToken = match ? match[1] : null;

    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token is missing.");
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedError("Invalid or expired refresh token.");
    }

    await connectToDatabase();

    const user = await User.findById(payload.userId);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedError("User session has been revoked.");
    }

    // Verify stored refresh token hash
    const isTokenMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isTokenMatch) {
      await logAuditEvent({
        userId: user._id.toString(),
        email: user.email,
        action: "TOKEN_REFRESH_REVOKED_REUSE_DETECTED",
        status: "FAILURE",
        ipAddress,
        userAgent,
      });

      // Revoke all tokens for user on reuse attempt
      user.refreshTokenHash = null;
      await user.save();

      throw new UnauthorizedError("Token reuse detected. Session revoked.");
    }

    // Token Rotation: Issue new Access & Refresh Tokens
    const newAccessToken = await signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = await signRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });

    user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    await user.save();

    await logAuditEvent({
      userId: user._id.toString(),
      email: user.email,
      action: "TOKEN_REFRESH_SUCCESS",
      status: "SUCCESS",
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
    });

    response.cookies.set(ACCESS_TOKEN_COOKIE, newAccessToken, getCookieOptions(ACCESS_TOKEN_EXPIRY_SEC));
    response.cookies.set(REFRESH_TOKEN_COOKIE, newRefreshToken, getCookieOptions(REFRESH_TOKEN_EXPIRY_SEC));

    return response;
  } catch (err) {
    const errorPayload = formatApiErrorResponse(err);
    const statusCode = err && typeof err === "object" && "statusCode" in err ? (err.statusCode as number) : 500;
    return NextResponse.json(errorPayload, { status: statusCode });
  }
}
