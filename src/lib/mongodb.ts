import mongoose from "mongoose";
import { type DomainTag, logTelemetry, createTraceId } from "@/lib/telemetry";

type DomainConnectionCache = {
  [domain in DomainTag]?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const globalWithMongoose = global as typeof globalThis & {
  luminaDomainConnections?: DomainConnectionCache;
};

const domainCache: DomainConnectionCache =
  globalWithMongoose.luminaDomainConnections ??
  (globalWithMongoose.luminaDomainConnections = {});

// Mapping domain tags to dedicated DB names for physical/logical isolation
const DOMAIN_DB_MAP: Record<DomainTag, string> = {
  db_catalog: process.env.MONGODB_CATALOG_DB || "lumina_db",
  db_users: process.env.MONGODB_USERS_DB || "lumina_users_db",
  db_orders: process.env.MONGODB_ORDERS_DB || "lumina_orders_db",
  db_analytics: process.env.MONGODB_ANALYTICS_DB || "lumina_analytics_db",
};

export async function connectToDomainDatabase(
  domain: DomainTag = "db_catalog",
  tenantId?: string
): Promise<typeof mongoose> {
  const traceId = createTraceId();
  const mongodbUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongodbUri) {
    logTelemetry({
      trace_id: traceId,
      domain_tag: domain,
      tenant_id: tenantId,
      level: "ERROR",
      message: "Missing database connection URI configuration.",
    });
    throw new Error("Missing MONGODB_URI configuration.");
  }

  const cached = domainCache[domain] || (domainCache[domain] = { conn: null, promise: null });

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const targetDbName = DOMAIN_DB_MAP[domain];

    logTelemetry({
      trace_id: traceId,
      domain_tag: domain,
      tenant_id: tenantId,
      level: "INFO",
      message: `Initiating connection pool for domain database [${targetDbName}]`,
    });

    const opts: mongoose.ConnectOptions = {
      dbName: targetDbName,
      bufferCommands: false,
      maxPoolSize: domain === "db_catalog" ? 20 : 10, // Dedicated connection pool sizing per domain
      minPoolSize: 2,
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500,
      socketTimeoutMS: 3000,
    };

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Database connection timeout (1.5s limit) for domain: ${domain}`)),
        1500
      )
    );

    cached.promise = Promise.race([
      mongoose.connect(mongodbUri, opts).then((mongooseInstance) => {
        logTelemetry({
          trace_id: traceId,
          domain_tag: domain,
          tenant_id: tenantId,
          level: "INFO",
          message: `Connected successfully to domain pool [${domain} -> ${targetDbName}]`,
        });
        return mongooseInstance;
      }),
      timeoutPromise,
    ]);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    logTelemetry({
      trace_id: traceId,
      domain_tag: domain,
      tenant_id: tenantId,
      level: "WARN",
      message: `Domain database connection failed for [${domain}]. Activating fallback strategy.`,
      details: { error: error instanceof Error ? error.message : String(error) },
    });
    throw error;
  }

  return cached.conn;
}

// Backward-compatible default connection helper
export async function connectToDatabase(): Promise<typeof mongoose> {
  return connectToDomainDatabase("db_catalog");
}
