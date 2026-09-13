export type DomainTag = "db_catalog" | "db_users" | "db_orders" | "db_analytics";

export type TelemetryLog = {
  trace_id: string;
  domain_tag: DomainTag;
  tenant_id?: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
  details?: Record<string, unknown>;
};

export function createTraceId(): string {
  const rand = Math.random().toString(36).substring(2, 9);
  return `trace-${Date.now()}-${rand}`;
}

export function logTelemetry(log: Omit<TelemetryLog, "timestamp">): void {
  const entry: TelemetryLog = {
    ...log,
    tenant_id: log.tenant_id || "lumina-default-tenant",
    timestamp: new Date().toISOString(),
  };

  const output = `[${entry.timestamp}] [${entry.level}] [Domain: ${entry.domain_tag}] [Trace: ${entry.trace_id}] [Tenant: ${entry.tenant_id}] ${entry.message}`;

  if (entry.level === "ERROR") {
    console.error(output, entry.details || "");
  } else if (entry.level === "WARN") {
    console.warn(output, entry.details || "");
  } else {
    console.log(output, entry.details || "");
  }
}
