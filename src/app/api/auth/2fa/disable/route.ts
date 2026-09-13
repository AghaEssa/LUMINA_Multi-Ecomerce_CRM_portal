import { NextResponse } from "next/server";
import { withAuth, type AuthenticatedRequest } from "@/lib/withAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { comparePassword } from "@/lib/security";
import { verifyTwoFactorToken } from "@/lib/totp";
import { disable2faSchema, validateRequest } from "@/lib/validation";
import { ValidationError, UnauthorizedError, NotFoundError } from "@/lib/errors";
import { logAuditEvent, extractRequestMeta } from "@/lib/audit";

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  const { ipAddress, userAgent } = extractRequestMeta(req);
  const body = await req.json();
  const validated = await validateRequest(disable2faSchema, body);

  await connectToDatabase();

  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }

  // 1. Confirm password
  const isPasswordValid = await comparePassword(validated.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid password provided.");
  }

  // 2. Confirm 2FA code
  if (user.twoFactorSecret) {
    const isTotpValid = verifyTwoFactorToken(validated.token, user.twoFactorSecret);
    if (!isTotpValid) {
      throw new ValidationError("Invalid 2FA verification token.");
    }
  }

  user.isTwoFactorEnabled = false;
  user.twoFactorSecret = null;
  await user.save();

  await logAuditEvent({
    userId: user._id.toString(),
    email: user.email,
    action: "2FA_DISABLE_SUCCESS",
    status: "SUCCESS",
    ipAddress,
    userAgent,
  });

  return NextResponse.json({
    success: true,
    message: "Two-factor authentication (2FA) has been disabled successfully.",
    isTwoFactorEnabled: false,
  });
});
