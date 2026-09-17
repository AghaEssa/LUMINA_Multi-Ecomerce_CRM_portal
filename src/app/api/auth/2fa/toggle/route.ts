import { NextResponse } from "next/server";
import { withAuth, type AuthenticatedRequest } from "@/lib/withAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NotFoundError } from "@/lib/errors";

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  await connectToDatabase();

  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }

  const body = await req.json();
  const enable = Boolean(body.enable);

  if (!enable) {
    // Disable 2FA
    user.isTwoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Two-Factor Authentication (2FA) has been turned OFF.",
      isTwoFactorEnabled: false,
    });
  }

  // If enable flag is true, return status to trigger QR setup
  return NextResponse.json({
    success: true,
    message: "2FA setup required.",
    isTwoFactorEnabled: user.isTwoFactorEnabled,
  });
});
