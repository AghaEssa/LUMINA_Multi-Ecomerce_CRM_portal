import { NextResponse } from "next/server";
import { withAuth, type AuthenticatedRequest } from "@/lib/withAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NotFoundError } from "@/lib/errors";

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  await connectToDatabase();

  const user = await User.findById(req.user?.userId).select("-password -twoFactorSecret -refreshTokenHash");
  if (!user) {
    throw new NotFoundError("User profile not found.");
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    },
  });
});
