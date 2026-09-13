import { NextResponse } from "next/server";
import { formatApiErrorResponse, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import {
  verifyFileMagicBytes,
  generateSecureFilename,
  type AllowedMimeType,
} from "@/lib/security";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_MIME_TYPES: AllowedMimeType[] = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export async function POST(request: Request) {
  const requestId = `req-${Math.random().toString(36).substring(2, 8)}`;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      throw new ValidationError("No file provided in request.", { field: "file" });
    }

    // 1. File Size Validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new ValidationError("File size exceeds maximum allowed limit of 5MB.", {
        size: file.size,
        maxSize: MAX_FILE_SIZE_BYTES,
      });
    }

    // 2. MIME Type Whitelist Check
    const mimeType = file.type as AllowedMimeType;
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new ValidationError("Unsupported file format.", { mimeType });
    }

    // 3. Magic Byte Buffer Signature Inspection (Prevents MIME spoofing)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const isMagicValid = verifyFileMagicBytes(buffer, mimeType);
    if (!isMagicValid) {
      logger.warn("File upload failed magic byte verification (MIME spoofing attempt)", {
        requestId,
        claimedMime: mimeType,
        originalName: file.name,
      });
      throw new ValidationError("File content signature does not match claimed file type.");
    }

    // 4. Secure UUID Filename Generation (Prevents Directory Traversal)
    const secureFilename = generateSecureFilename(file.name);

    logger.info("File upload successfully validated and processed", {
      requestId,
      secureFilename,
      size: file.size,
      mimeType,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          filename: secureFilename,
          size: file.size,
          mimeType,
        },
        requestId,
      },
      {
        headers: {
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (error) {
    const errorPayload = formatApiErrorResponse(error, requestId);
    const statusCode = error instanceof ValidationError ? error.statusCode : 500;

    logger.error("File upload failed", error, { requestId });

    return NextResponse.json(errorPayload, { status: statusCode });
  }
}
