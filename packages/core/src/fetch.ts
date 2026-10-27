import { SpanKind } from "@opentelemetry/api";
import { logEvent } from "./logging.ts";
import { observeOperation, outgoingTrace } from "./operation.ts";

export function observedFetch<Input extends string | URL>(
  operation: string,
  url: Input,
  options: RequestInit = {},
  send: (url: Input, options: RequestInit) => Promise<Response> = fetch,
): Promise<Response> {
  return observeOperation(
    operation,
    async () => {
      const response = await send(url, {
        ...options,
        headers: {
          ...(options.headers instanceof Headers || Array.isArray(options.headers)
            ? Object.fromEntries(new Headers(options.headers))
            : options.headers),
          ...Object.fromEntries(outgoingTrace(new Headers())),
        },
      });
      logEvent(
        "dependency_http_response",
        { operation, status: response.status, outcome: response.ok ? "success" : "failure" },
        response.status >= 500 ? "error" : response.ok ? "info" : "warn",
      );
      return response;
    },
    { component: "http.client" },
    SpanKind.CLIENT,
  );
}
