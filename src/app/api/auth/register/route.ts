import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword, sanitizeEmail } from "@/lib/security";
import { registerSchema, validateRequest } from "@/lib/validation";
import { signAccessToken, signRefreshToken, getCookieOptions, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, ACCESS_TOKEN_EXPIRY_SEC, REFRESH_TOKEN_EXPIRY_SEC } from "@/lib/tokens";
import { ValidationError, formatApiErrorResponse } from "@/lib/errors";
import { logAuditEvent, extractRequestMeta } from "@/lib/audit";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { ipAddress, userAgent } = extractRequestMeta(req);

  try {
    const body = await req.json();
    const validated = await validateRequest(registerSchema, body);
    const cleanEmail = sanitizeEmail(validated.email);

    await connectToDatabase();

    // Check duplicate user
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      await logAuditEvent({
        email: cleanEmail,
        action: "REGISTER_FAILED_DUPLICATE",
        status: "FAILURE",
        ipAddress,
        userAgent,
      });

      throw new ValidationError("An account with this email address already exists.");
    }

    // Hash password
    const hashedPassword = await hashPassword(validated.password);

    // Create user record
    const newUser = await User.create({
      name: validated.name || "",
      email: cleanEmail,
      password: hashedPassword,
      role: validated.role || "customer",
    });

    // Generate tokens
    const accessToken = await signAccessToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    const refreshToken = await signRefreshToken({
      userId: newUser._id.toString(),
      email: newUser.email,
    });

    // Save refresh token hash
    newUser.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await newUser.save();

    // Log audit event
    await logAuditEvent({
      userId: newUser._id.toString(),
      email: newUser.email,
      action: "REGISTER_SUCCESS",
      status: "SUCCESS",
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isTwoFactorEnabled: newUser.isTwoFactorEnabled,
        },
      },
      { status: 201 }
    );

    // Set secure HTTP-only cookies
    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, getCookieOptions(ACCESS_TOKEN_EXPIRY_SEC));
    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, getCookieOptions(REFRESH_TOKEN_EXPIRY_SEC));

    return response;
  } catch (err) {
    const errorPayload = formatApiErrorResponse(err);
    const statusCode = err && typeof err === "object" && "statusCode" in err ? (err.statusCode as number) : 500;
    return NextResponse.json(errorPayload, { status: statusCode });
  }
}
