import { HttpError } from "@opencok/errors/http";
import { DependencyError } from "@opencok/errors/dependency";
import { logContext, logEvent, logHttpRequest } from "@opencok/core/logging";
import { ApiRouter } from "./api-router.ts";

export class ApiRequestHandler {
  public constructor(private readonly router: ApiRouter) {}

  public readonly fetch = (request: Request): Promise<Response> => {
    return logHttpRequest(request, this.fetchRequest);
  };

  private readonly fetchRequest = async (request: Request): Promise<Response> => {
    const requestId = logContext().requestId;
    let response: Response, failure: string | undefined;
    try {
      response = await this.router.route(request);
    } catch (error) {
      failure = error instanceof DependencyError ? error.dependency : "request_failed";
      response = new Response("", {
        status:
          error instanceof HttpError ? error.status : error instanceof DependencyError ? 503 : 500,
        headers: { "Content-Type": "text/plain; charset=UTF-8" },
      });
    }
    if (requestId) response.headers.set("X-Request-ID", String(requestId));
    if (failure) logEvent("request_failed", { reason: failure, status: response.status }, "error");
    return request.method === "HEAD"
      ? new Response(null, { status: response.status, headers: response.headers })
      : response;
  };
}
