import crypto from "crypto";
import bcrypt from "bcryptjs";

export type AllowedMimeType = "image/png" | "image/jpeg" | "image/webp" | "image/gif" | "application/pdf";

const MAGIC_BYTES: Record<AllowedMimeType, number[][]> = {
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  "image/jpeg": [
    [0xff, 0xd8, 0xff, 0xe0],
    [0xff, 0xd8, 0xff, 0xe1],
    [0xff, 0xd8, 0xff, 0xee],
  ],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF
  "image/gif": [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  ],
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]], // %PDF
};

/**
 * Hashes a plaintext password using bcrypt with 12 salt rounds.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compares plaintext password against hashed password using constant-time check.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sanitizes arbitrary string input to prevent XSS and script injection.
 */
export function sanitizeString(input: string): string {
  if (!input) return "";

  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/on\w+="[^"]*"/gi, "") // Remove inline JS handlers (onload, onclick)
    .replace(/javascript:/gi, "") // Remove javascript: pseudo-protocols
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Sanitizes and validates email input formats.
 */
export function sanitizeEmail(email: string): string {
  if (!email) return "";
  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleaned)) {
    throw new Error("Invalid email format.");
  }
  return cleaned;
}

/**
 * Inspects raw buffer magic bytes to verify true file type and prevent MIME spoofing.
 */
export function verifyFileMagicBytes(buffer: Buffer, expectedType: AllowedMimeType): boolean {
  const signatures = MAGIC_BYTES[expectedType];
  if (!signatures) return false;

  return signatures.some((sig) => {
    return sig.every((byte, index) => buffer[index] === byte);
  });
}

/**
 * Generates a cryptographically secure random UUID filename to prevent Directory Traversal.
 */
export function generateSecureFilename(originalFilename: string): string {
  const safeExt = originalFilename.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const randomUuid = crypto.randomUUID();
  return `${randomUuid}.${safeExt}`;
}
