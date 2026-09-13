import { z, type ZodSchema } from "zod";
import { ValidationError } from "./errors";

/**
 * Validates arbitrary payload data against a Zod schema.
 * Throws a ValidationError with field-level details if validation fails.
 */
export async function validateRequest<T>(schema: ZodSchema<T>, data: unknown): Promise<T> {
  const result = await schema.safeParseAsync(data);
  if (!result.success) {
    const formattedErrors = result.error.flatten().fieldErrors;
    throw new ValidationError("Invalid request payload provided.", formattedErrors);
  }
  return result.data;
}

// User Registration Schema
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long").optional(),
  email: z.string().trim().email("Invalid email address format").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["admin", "editor", "customer"]).optional(),
});

// User Login Schema
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address format").toLowerCase(),
  password: z.string().min(1, "Password is required"),
  totpCode: z.string().optional(),
});

// 2FA Verification Schema
export const verify2faSchema = z.object({
  token: z
    .string()
    .trim()
    .length(6, "2FA token must be exactly 6 digits")
    .regex(/^\d+$/, "2FA token must contain digits only"),
});

// 2FA Disable Schema
export const disable2faSchema = z.object({
  password: z.string().min(1, "Current password is required to disable 2FA"),
  token: z
    .string()
    .trim()
    .length(6, "2FA token must be exactly 6 digits")
    .regex(/^\d+$/, "2FA token must contain digits only"),
});
