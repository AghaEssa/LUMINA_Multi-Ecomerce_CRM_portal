export type ApiErrorPayload = {
  success: false;
  error: {
    code: string;
    message: string;
    timestamp: string;
    requestId: string;
    details?: unknown;
  };
};

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    isOperational = true,
    details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found.", details?: unknown) {
    super(message, 404, "NOT_FOUND", true, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid input data provided.", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", true, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication is required to access this resource.", details?: unknown) {
    super(message, 401, "UNAUTHORIZED", true, details);
  }
}

export class AuthError extends AppError {
  constructor(message = "Authentication error occurred.", details?: unknown) {
    super(message, 401, "AUTH_ERROR", true, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to access this resource.", details?: unknown) {
    super(message, 403, "FORBIDDEN", true, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "An unexpected internal server error occurred.", details?: unknown) {
    super(message, 500, "INTERNAL_SERVER_ERROR", false, details);
  }
}

export function formatApiErrorResponse(
  error: unknown,
  requestId: string = `req-${Math.random().toString(36).substring(2, 8)}`
): ApiErrorPayload {
  const timestamp = new Date().toISOString();

  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        timestamp,
        requestId,
        ...(error.details ? { details: error.details } : {}),
      },
    };
  }

  // Fallback for unhandled native JS errors
  const fallbackMessage =
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred. Please try again later."
      : error instanceof Error
      ? error.message
      : "Unknown error occurred.";

  return {
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: fallbackMessage,
      timestamp,
      requestId,
    },
  };
}
