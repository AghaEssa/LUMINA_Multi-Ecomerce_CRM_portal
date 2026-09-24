import { getCategories, DEFAULT_CATEGORIES, type CategoryItem } from "@/lib/categories";
import { getProductsByCategory, getProductBySlug, DEFAULT_PRODUCTS, type ProductItem } from "@/lib/products";
import { type DomainTag, logTelemetry, createTraceId } from "@/lib/telemetry";

// Circuit Breaker State per Domain
type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

type DomainCircuitBreaker = {
  state: CircuitState;
  failureCount: number;
  lastFailureTime: number;
};

const CIRCUIT_THRESHOLD = 3; // Trip after 3 consecutive failures
const RESET_TIMEOUT_MS = 10000; // Retry after 10 seconds

const circuitBreakers: Record<DomainTag, DomainCircuitBreaker> = {
  db_catalog: { state: "CLOSED", failureCount: 0, lastFailureTime: 0 },
  db_users: { state: "CLOSED", failureCount: 0, lastFailureTime: 0 },
  db_orders: { state: "CLOSED", failureCount: 0, lastFailureTime: 0 },
  db_analytics: { state: "CLOSED", failureCount: 0, lastFailureTime: 0 },
};

async function executeWithCircuitBreaker<T>(
  domain: DomainTag,
  operation: () => Promise<T>,
  fallbackValue: T,
  operationName: string
): Promise<T> {
  const traceId = createTraceId();
  const cb = circuitBreakers[domain];
  const now = Date.now();

  // Check if Circuit Breaker is OPEN
  if (cb.state === "OPEN") {
    if (now - cb.lastFailureTime > RESET_TIMEOUT_MS) {
      cb.state = "HALF_OPEN";
      logTelemetry({
        trace_id: traceId,
        domain_tag: domain,
        level: "WARN",
        message: `Circuit Breaker entering HALF_OPEN probe state for operation [${operationName}]`,
      });
    } else {
      logTelemetry({
        trace_id: traceId,
        domain_tag: domain,
        level: "WARN",
        message: `Circuit Breaker is OPEN for domain [${domain}]. Degrading gracefully to cached fallback for [${operationName}]`,
      });
      return fallbackValue;
    }
  }

  try {
    const result = await operation();
    // On success reset failures
    if (cb.state === "HALF_OPEN" || cb.failureCount > 0) {
      cb.state = "CLOSED";
      cb.failureCount = 0;
      logTelemetry({
        trace_id: traceId,
        domain_tag: domain,
        level: "INFO",
        message: `Circuit Breaker CLOSED. Domain database [${domain}] recovered successfully for [${operationName}]`,
      });
    }
    return result;
  } catch (error) {
    cb.failureCount += 1;
    cb.lastFailureTime = now;

    if (cb.failureCount >= CIRCUIT_THRESHOLD) {
      cb.state = "OPEN";
      logTelemetry({
        trace_id: traceId,
        domain_tag: domain,
        level: "ERROR",
        message: `Circuit Breaker TRIPPED OPEN for domain [${domain}] after ${cb.failureCount} consecutive failures. Serving fallback for [${operationName}]`,
        details: { error: error instanceof Error ? error.message : String(error) },
      });
    } else {
      logTelemetry({
        trace_id: traceId,
        domain_tag: domain,
        level: "WARN",
        message: `Database query failed for [${operationName}]. Failure count: ${cb.failureCount}/${CIRCUIT_THRESHOLD}. Serving graceful fallback.`,
        details: { error: error instanceof Error ? error.message : String(error) },
      });
    }

    return fallbackValue;
  }
}

export async function fetchAllCategories(): Promise<CategoryItem[]> {
  return await executeWithCircuitBreaker(
    "db_catalog",
    async () => await getCategories(),
    DEFAULT_CATEGORIES,
    "fetchAllCategories"
  );
}

export async function fetchCategoryBySlug(slug: string): Promise<CategoryItem | undefined> {
  const categories = await fetchAllCategories();
  const normalizedSlug = slug.toLowerCase().trim();
  return categories.find((cat) => cat.slug.toLowerCase() === normalizedSlug);
}

export async function fetchProductsByCategory(categorySlug: string): Promise<ProductItem[]> {
  const normalizedSlug = categorySlug.toLowerCase().trim();
  const fallback = DEFAULT_PRODUCTS.filter(
    (p) => p.categorySlug.toLowerCase() === normalizedSlug
  );

  return await executeWithCircuitBreaker(
    "db_catalog",
    async () => await getProductsByCategory(normalizedSlug),
    fallback,
    `fetchProductsByCategory(${normalizedSlug})`
  );
}

export async function fetchProductBySlug(slug: string): Promise<ProductItem | undefined> {
  const normalizedSlug = slug.toLowerCase().trim();
  const fallback = DEFAULT_PRODUCTS.find((p) => p.slug.toLowerCase() === normalizedSlug);

  return await executeWithCircuitBreaker(
    "db_catalog",
    async () => await getProductBySlug(normalizedSlug),
    fallback,
    `fetchProductBySlug(${normalizedSlug})`
  );
}

export async function fetchSimilarProducts(
  categorySlug: string,
  currentProductSlug: string,
  limit = 12
): Promise<ProductItem[]> {
  return DEFAULT_PRODUCTS.filter(
    (p) => p.categorySlug === categorySlug && p.slug !== currentProductSlug
  ).slice(0, limit);
}
