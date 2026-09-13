import crypto from "crypto";

const DEFAULT_SECRET = process.env.URL_SIGNING_SECRET || "lumina-url-security-secret-key-2026";

/**
 * Validates redirect targets to prevent Open Redirect vulnerability attacks.
 * Rejects absolute URLs, protocol-relative links (//attacker.com), and pseudo-protocols (javascript:).
 */
export function validateSafeRedirect(
  targetUrl: string | null | undefined,
  defaultFallback = "/"
): string {
  if (!targetUrl || typeof targetUrl !== "string") {
    return defaultFallback;
  }

  const trimmed = targetUrl.trim();

  // Block protocol-relative URLs (e.g. "//attacker.com") and absolute URLs (http:// or https://)
  if (trimmed.startsWith("//") || trimmed.includes("://") || trimmed.startsWith("javascript:")) {
    return defaultFallback;
  }

  // Must begin with a single "/"
  if (!trimmed.startsWith("/")) {
    return defaultFallback;
  }

  return trimmed;
}

/**
 * Generates an HMAC-SHA256 cryptographically signed expiring action URL.
 */
export function generateSignedUrl(
  basePath: string,
  queryParams: Record<string, string>,
  secretKey = DEFAULT_SECRET,
  expiresInSeconds = 3600
): string {
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const searchParams = new URLSearchParams(queryParams);
  searchParams.set("expires", expires.toString());

  const dataToSign = `${basePath}?${searchParams.toString()}`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(dataToSign)
    .digest("hex");

  searchParams.set("sig", signature);
  return `${basePath}?${searchParams.toString()}`;
}

/**
 * Verifies an HMAC-SHA256 signed URL's signature and expiration timestamp.
 */
export function verifySignedUrl(
  fullUrl: string,
  secretKey = DEFAULT_SECRET
): { isValid: boolean; reason?: string } {
  try {
    const urlObj = new URL(fullUrl, "http://localhost");
    const basePath = urlObj.pathname;
    const searchParams = new URLSearchParams(urlObj.search);
    const providedSig = searchParams.get("sig");
    const expiresStr = searchParams.get("expires");

    if (!providedSig || !expiresStr) {
      return { isValid: false, reason: "Missing signature or expiration parameter." };
    }

    // Expiration check
    const expires = parseInt(expiresStr, 10);
    const now = Math.floor(Date.now() / 1000);
    if (isNaN(expires) || now > expires) {
      return { isValid: false, reason: "Signed URL has expired." };
    }

    // Reconstruct data signature
    searchParams.delete("sig");
    const dataToSign = `${basePath}?${searchParams.toString()}`;
    const expectedSig = crypto
      .createHmac("sha256", secretKey)
      .update(dataToSign)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(providedSig, "hex"),
      Buffer.from(expectedSig, "hex")
    );

    return isValid
      ? { isValid: true }
      : { isValid: false, reason: "Invalid signature digest." };
  } catch (error) {
    return { isValid: false, reason: "Malformed URL format." };
  }
}

/**
 * Obfuscates internal sequential database IDs using HMAC tokenization to prevent IDOR enumeration.
 */
export function obfuscateId(id: string | number, secretKey = DEFAULT_SECRET): string {
  const strId = String(id);
  const hash = crypto.createHmac("sha256", secretKey).update(strId).digest("hex").substring(0, 16);
  return `ref-${hash}`;
}
