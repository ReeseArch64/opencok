import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { createLogger, initLogger } from "evlog";
import { observeServerOperation, incomingTrace } from "./operation.ts";
import { configureTelemetry, telemetry, traceContext, type TelemetryOptions } from "./telemetry.ts";

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

export function initializeTelemetry(service: string, options: TelemetryOptions) {
  return configureTelemetry(service, options, (event) => {
    const logger = createLogger({
      event,
      service,
      outcome: "failure",
      reason: "telemetry_delivery",
    });
    logger.setLevel("error");
    logger.emit();
  });
}

export function logContext() {
  return context.getStore() ?? {};
}

export function updateLogContext(fields: Fields) {
  const active = context.getStore();
  if (active) {Object.assign(active, fields);}
}

export function withLogContext<A>(fields: Fields, run: () => A): A {
  return context.run({ ...logContext(), ...fields }, run);
}

export function logEvent(event: string, fields: Fields = {}, level: Level = "info"): void {
  if (level === "error" && telemetry && !traceContext().traceId) {
    telemetry.tracer.startActiveSpan(`event.${event}`, (span) => {
      try {
        logEvent(event, fields, level);
      } finally {
        span.end();
      }
    });
    return;
  }
  const logger = createLogger({ ...logContext(), ...traceContext(), ...fields, event });
  logger.setLevel(level);
  const record = logger.emit({
    _durationMs: typeof fields.durationMs === "number" ? fields.durationMs : undefined,
  });
  if (record) {telemetry?.emit(record);}
}

export async function logHttpRequest(
  request: Request,
  fetch: (request: Request) => Promise<Response> | Response,
) {
  if (logContext().requestId) {return fetch(request);}

  const requestId = `req_${randomUUID().replaceAll("-", "")}`;
  const started = performance.now();

  return incomingTrace(request.headers, () =>
    withLogContext({ requestId, component: "http" }, () =>
      observeServerOperation(`http.${httpOperation(new URL(request.url).pathname)}`, async () => {
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
      }),
    ),
  );
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
    "/gameservice/www/gateway/gateway.php",
    "/_internal/characters",
  ]);

  if (known.has(path)) {return path;}

  if (/^\/_internal\/avatars\/[0-9]{1,20}\/[1-9][0-9]{0,5}$/.test(path))
    {return "avatar.confirmation";}

  if (/^\/cok\/img\/[0-9]{1,6}\/[a-f0-9]{32}\.jpg$/.test(path)) {return "avatar.download";}

  return "unknown";
}

function classifiedErrorReason(error: unknown): string {
  if (!(error instanceof Error)) {return "unexpected_failure";}

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
    "57014": "database_query_cancelled",
    "55P03": "database_lock_unavailable",
    "25P02": "database_transaction_aborted",
    "08006": "database_connection_failure",
    "57P01": "database_shutdown",
  };

  if (typeof code === "string" && Object.hasOwn(reasons, code)) {return reasons[code]!;}
  if (typeof code === "string" && /^(?:E[0-9]{6}|[0-9]{6})$/.test(code)) {return code;}

  if (error.name === "TimeoutError" || error.name === "AbortError") {return "dependency_timeout";}

  return "unexpected_failure";
}

export function errorReason(error: unknown): string {
  const seen = new Set<unknown>();

  for (let depth = 0; depth < 8 && error instanceof Error && !seen.has(error); depth++) {
    seen.add(error);
    const reason = classifiedErrorReason(error);

    if (reason !== "unexpected_failure") {return reason;}

    error = error.cause;
  }

  return "unexpected_failure";
}
