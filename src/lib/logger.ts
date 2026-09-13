export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

export type LogContext = {
  requestId?: string;
  traceId?: string;
  userId?: string;
  path?: string;
  [key: string]: unknown;
};

const SENSITIVE_KEYS = new Set([
  "password",
  "pass",
  "secret",
  "token",
  "authorization",
  "auth",
  "jwt",
  "bearer",
  "creditcard",
  "credit_card",
  "cardnumber",
  "card_number",
  "cvv",
  "ssn",
  "email",
  "phone",
  "phonenumber",
]);

export function maskSensitiveData(data: unknown): unknown {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    // Mask potential JWT tokens
    if (data.startsWith("Bearer ") || data.split(".").length === 3) {
      return "[REDACTED_JWT_TOKEN]";
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => maskSensitiveData(item));
  }

  if (typeof data === "object") {
    const maskedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.has(lowerKey)) {
        maskedObj[key] = "[REDACTED_SENSITIVE_DATA]";
      } else if (typeof value === "object" && value !== null) {
        maskedObj[key] = maskSensitiveData(value);
      } else {
        maskedObj[key] = value;
      }
    }
    return maskedObj;
  }

  return data;
}

export class StructuredLogger {
  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: unknown) {
    const timestamp = new Date().toISOString();
    const sanitizedContext = context ? (maskSensitiveData(context) as LogContext) : {};

    const payload = {
      timestamp,
      level,
      message,
      requestId: sanitizedContext.requestId || `req-${Math.random().toString(36).substring(2, 8)}`,
      traceId: sanitizedContext.traceId,
      path: sanitizedContext.path,
      context: sanitizedContext,
      ...(error instanceof Error
        ? {
            error: {
              name: error.name,
              message: error.message,
              ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
            },
          }
        : error
        ? { error: maskSensitiveData(error) }
        : {}),
    };

    const jsonString = JSON.stringify(payload);

    switch (level) {
      case "FATAL":
      case "ERROR":
        console.error(jsonString);
        break;
      case "WARN":
        console.warn(jsonString);
        break;
      case "DEBUG":
        if (process.env.NODE_ENV !== "production") {
          console.debug(jsonString);
        }
        break;
      default:
        console.log(jsonString);
        break;
    }
  }

  public debug(message: string, context?: LogContext): void {
    this.formatLog("DEBUG", message, context);
  }

  public info(message: string, context?: LogContext): void {
    this.formatLog("INFO", message, context);
  }

  public warn(message: string, context?: LogContext): void {
    this.formatLog("WARN", message, context);
  }

  public error(message: string, error?: unknown, context?: LogContext): void {
    this.formatLog("ERROR", message, context, error);
  }

  public fatal(message: string, error?: unknown, context?: LogContext): void {
    this.formatLog("FATAL", message, context, error);
  }
}

export const logger = new StructuredLogger();
