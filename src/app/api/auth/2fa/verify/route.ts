import { NextResponse } from "next/server";
import { withAuth, type AuthenticatedRequest } from "@/lib/withAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyTwoFactorToken } from "@/lib/totp";
import { verify2faSchema, validateRequest } from "@/lib/validation";
import { ValidationError, NotFoundError } from "@/lib/errors";
import { logAuditEvent, extractRequestMeta } from "@/lib/audit";

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  const { ipAddress, userAgent } = extractRequestMeta(req);
  const body = await req.json();
  const validated = await validateRequest(verify2faSchema, body);

  await connectToDatabase();

  const user = await User.findById(req.user?.userId);
  if (!user || !user.twoFactorSecret) {
    throw new NotFoundError("2FA secret key not found. Please initiate 2FA setup first.");
  }

  const isValid = verifyTwoFactorToken(validated.token, user.twoFactorSecret);
  if (!isValid) {
    await logAuditEvent({
      userId: user._id.toString(),
      email: user.email,
      action: "2FA_VERIFY_FAILED_SETUP",
      status: "FAILURE",
      ipAddress,
      userAgent,
    });

    throw new ValidationError("Invalid 2FA verification token. Please check your authenticator app.");
  }

  user.isTwoFactorEnabled = true;
  await user.save();

  await logAuditEvent({
    userId: user._id.toString(),
    email: user.email,
    action: "2FA_ENABLE_SUCCESS",
    status: "SUCCESS",
    ipAddress,
    userAgent,
  });

  return NextResponse.json({
    success: true,
    message: "Two-factor authentication (2FA) has been enabled successfully.",
    isTwoFactorEnabled: true,
  });
});
