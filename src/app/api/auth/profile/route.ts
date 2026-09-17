import { NextResponse } from "next/server";
import { withAuth, type AuthenticatedRequest } from "@/lib/withAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NotFoundError, ValidationError } from "@/lib/errors";

export const PUT = withAuth(async (req: AuthenticatedRequest) => {
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    throw new ValidationError("Name cannot be empty.");
  }

  await connectToDatabase();

  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }

  user.name = name;
  await user.save();

  return NextResponse.json({
    success: true,
    message: "Profile updated successfully.",
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    },
  });
});
