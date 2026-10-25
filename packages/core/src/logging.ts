import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { createLogger, initLogger } from "evlog";

type Level = "info" | "warn" | "error";
type Fields = Record<string, string | number | boolean | undefined>;
const context = new AsyncLocalStorage<Fields>();

export function initializeLogging(service: string) {
  initLogger({
    env: { service },
    pretty: false,
    redact: true,
    sampling: { rates: { info: 100, warn: 100, error: 100 } },
  });
}

export function logContext() {
  return context.getStore() ?? {};
}

export function withLogContext<A>(fields: Fields, run: () => A): A {
  return context.run({ ...logContext(), ...fields }, run);
}

export function logEvent(event: string, fields: Fields = {}, level: Level = "info") {
  const logger = createLogger({ ...logContext(), ...fields, event });
  logger.setLevel(level);
  logger.emit();
}

export async function logHttpRequest(
  request: Request,
  fetch: (request: Request) => Promise<Response> | Response,
) {
  if (logContext().requestId) return fetch(request);
  const requestId = `req_${randomUUID().replaceAll("-", "")}`;
  const started = performance.now();
  return withLogContext({ requestId, component: "http" }, async () => {
    let status = 500;
    try {
      const response = await fetch(request);
      status = response.status;
      response.headers.set("X-Request-ID", requestId);
      return response;
    } finally {
      logEvent(
        "http",
        {
          operation: httpOperation(new URL(request.url).pathname),
          method: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"].includes(
            request.method,
          )
            ? request.method
            : "other",
          status,
          durationMs: Math.round(performance.now() - started),
          outcome: status >= 400 ? "failure" : "success",
        },
        status >= 500 ? "error" : status >= 400 ? "warn" : "info",
      );
    }
  });
}

export function httpOperation(path: string) {
  const known = new Set([
    "/healthz",
    "/readyz",
    "/_health",
    "/_health.php",
    "/gameservice/getserverlist.php",
    "/gameservice/getline.php",
    "/gameservice/getserverlist_memoryold.php",
    "/gameservice/api/query_userinfo_by_name.php",
    "/api/v1global_config",
    "/chat/server/links",
    "/chat/server/all",
    "/external/session",
    "/gameservice/www/gateway/json.php",
  ]);
  if (known.has(path)) return path;
  if (/^\/_internal\/avatars\/[0-9]{1,20}\/[1-9][0-9]{0,5}$/.test(path))
    return "avatar.confirmation";
  if (/^\/cok\/img\/[0-9]{1,6}\/[a-f0-9]{32}\.jpg$/.test(path)) return "avatar.download";
  return "unknown";
}

export function errorReason(error: unknown): string {
  if (!(error instanceof Error)) return "unexpected_failure";
  const code = "code" in error ? error.code : undefined;
  const reasons: Record<string, string> = {
    ECONNREFUSED: "connection_refused",
    ECONNRESET: "connection_reset",
    ETIMEDOUT: "dependency_timeout",
    ENOTFOUND: "dns_failure",
    EADDRINUSE: "address_in_use",
    EACCES: "permission_denied",
    ENOENT: "file_not_found",
    "28P01": "database_authentication",
    "3D000": "database_missing",
    "42P01": "database_table_missing",
    "42703": "database_column_missing",
    "23505": "database_unique_conflict",
    "53300": "database_connection_limit",
    "40001": "database_serialization",
    "40P01": "database_deadlock",
  };
  if (typeof code === "string" && Object.hasOwn(reasons, code)) return reasons[code]!;
  if (error.name === "TimeoutError" || error.name === "AbortError") return "dependency_timeout";
  return "unexpected_failure";
}
