import { randomUUID } from "node:crypto";
import type { HttpHandler } from "@opencok/contracts/chat";
import type { ChatHttpOptions } from "@opencok/contracts/chat-http-options";
import { httpOperation, logEvent, withLogContext } from "@opencok/core/logging";
import { ChatHttpRouter } from "./chat-http-router.ts";

export class ChatHttpHandler {
  private readonly router: ChatHttpRouter;

  public constructor(options: ChatHttpOptions = {}) {
    this.router = new ChatHttpRouter(options);
  }

  public readonly handle: HttpHandler = (request, response) => {
    const requestId = randomUUID();
    const started = performance.now();
    withLogContext({ requestId, component: "chat.http" }, () => {
      response.setHeader("X-Request-ID", requestId);
      response.once("finish", () =>
        logEvent(
          "http",
          {
            requestId,
            component: "chat.http",
            operation: httpOperation(request.url?.split("?", 1)[0] ?? ""),
            status: response.statusCode,
            durationMs: Math.round(performance.now() - started),
            outcome: response.statusCode >= 400 ? "failure" : "success",
          },
          response.statusCode >= 500 ? "error" : response.statusCode >= 400 ? "warn" : "info",
        ),
      );
      this.router.route(request, response);
    });
  };
}
