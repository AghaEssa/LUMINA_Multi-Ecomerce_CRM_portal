import speakeasy from "speakeasy";
import QRCode from "qrcode";

const TOTP_ISSUER = process.env.TOTP_ISSUER || "Agha CRM";

export interface GeneratedSecret {
  ascii: string;
  hex: string;
  base32: string;
  otpauth_url?: string;
}

/**
 * Generates a unique 32-character Base32 secret key for TOTP setup.
 */
export function generateTwoFactorSecret(userEmail: string): GeneratedSecret {
  const secret = speakeasy.generateSecret({
    length: 20,
    name: `${TOTP_ISSUER} (${userEmail})`,
    issuer: TOTP_ISSUER,
  });

  return {
    ascii: secret.ascii,
    hex: secret.hex,
    base32: secret.base32,
    otpauth_url: secret.otpauth_url,
  };
}

/**
 * Converts an otpauth:// URI into a Base64 QR code image Data URL.
 */
export async function generateQrCodeDataUrl(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl);
}

/**
 * Verifies a 6-digit TOTP token against a user's Base32 secret strictly for the current 30-second window (window: 0).
 */
export function verifyTwoFactorToken(token: string, secretBase32: string): boolean {
  if (!token || !secretBase32) return false;

  return speakeasy.totp.verify({
    secret: secretBase32,
    encoding: "base32",
    token: token.trim(),
    window: 0, // Strict current 30-second window (rejects expired past codes)
  });
}
