import { NextResponse } from "next/server";
import { withAuth, type AuthenticatedRequest } from "@/lib/withAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { generateTwoFactorSecret, generateQrCodeDataUrl } from "@/lib/totp";
import { NotFoundError, ValidationError } from "@/lib/errors";

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  await connectToDatabase();

  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }

  if (user.isTwoFactorEnabled) {
    throw new ValidationError("2FA is already enabled for this account.");
  }

  const { base32, otpauth_url } = generateTwoFactorSecret(user.email);
  const qrCodeUrl = otpauth_url ? await generateQrCodeDataUrl(otpauth_url) : "";

  // Save secret temporarily until confirmed with verify code
  user.twoFactorSecret = base32;
  await user.save();

  return NextResponse.json({
    success: true,
    message: "2FA setup initiated. Scan the QR code with your authenticator app.",
    secret: base32,
    qrCodeUrl,
  });
});
