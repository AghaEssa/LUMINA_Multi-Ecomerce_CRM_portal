import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { comparePassword, sanitizeEmail } from "@/lib/security";
import { verifyTwoFactorToken } from "@/lib/totp";
import { loginSchema, validateRequest } from "@/lib/validation";
import { signAccessToken, signRefreshToken, getCookieOptions, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, ACCESS_TOKEN_EXPIRY_SEC, REFRESH_TOKEN_EXPIRY_SEC } from "@/lib/tokens";
import { UnauthorizedError, formatApiErrorResponse } from "@/lib/errors";
import { logAuditEvent, extractRequestMeta } from "@/lib/audit";
import { checkRateLimit, createRateLimitResponse, applyRateLimitHeaders, RateLimitPresets } from "@/lib/rateLimit";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const rateLimitResult = checkRateLimit(req, RateLimitPresets.AUTH);
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  const { ipAddress, userAgent } = extractRequestMeta(req);

  try {
    const body = await req.json();
    const validated = await validateRequest(loginSchema, body);
    const cleanEmail = sanitizeEmail(validated.email);

    await connectToDatabase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      await logAuditEvent({
        email: cleanEmail,
        action: "LOGIN_FAILED_USER_NOT_FOUND",
        status: "FAILURE",
        ipAddress,
        userAgent,
      });

      throw new UnauthorizedError("Invalid email or password.");
    }

    // Compare password using constant-time check
    const isPasswordValid = await comparePassword(validated.password, user.password);
    if (!isPasswordValid) {
      await logAuditEvent({
        userId: user._id.toString(),
        email: user.email,
        action: "LOGIN_FAILED_BAD_PASSWORD",
        status: "FAILURE",
        ipAddress,
        userAgent,
      });

      throw new UnauthorizedError("Invalid email or password.");
    }

    // 2FA Verification check if enabled
    if (user.isTwoFactorEnabled) {
      if (!validated.totpCode) {
        return NextResponse.json({
          success: true,
          requireTwoFactor: true,
          message: "2FA code is required to complete authentication.",
        });
      }

      const isTotpValid = verifyTwoFactorToken(validated.totpCode, user.twoFactorSecret);
      if (!isTotpValid) {
        await logAuditEvent({
          userId: user._id.toString(),
          email: user.email,
          action: "2FA_VERIFY_FAILED_LOGIN",
          status: "FAILURE",
          ipAddress,
          userAgent,
        });

        throw new UnauthorizedError("Invalid 2FA verification code.");
      }
    }

    // Update last login timestamp
    user.lastLoginAt = new Date();

    // Generate Access and Refresh Tokens
    const accessToken = await signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = await signRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Store hashed Refresh Token
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();

    // Audit log
    await logAuditEvent({
      userId: user._id.toString(),
      email: user.email,
      action: "LOGIN_SUCCESS",
      status: "SUCCESS",
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      },
    });

    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, getCookieOptions(ACCESS_TOKEN_EXPIRY_SEC));
    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, getCookieOptions(REFRESH_TOKEN_EXPIRY_SEC));

    return applyRateLimitHeaders(response, rateLimitResult);
  } catch (err) {
    const errorPayload = formatApiErrorResponse(err);
    const statusCode = err && typeof err === "object" && "statusCode" in err ? (err.statusCode as number) : 500;
    return NextResponse.json(errorPayload, { status: statusCode });
  }
}
