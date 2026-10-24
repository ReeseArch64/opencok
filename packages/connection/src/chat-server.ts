import { chatMailboxPath } from "@opencok/contracts/chat-mailbox";
import { chatAvatarProfilePath } from "@opencok/contracts/chat-avatar-profile";
import { chatNicknamePath } from "@opencok/contracts/chat-nickname";
import type { AsyncHttpHandler, HttpHandler, WebSocketGateway } from "@opencok/contracts/chat";
import { createServer, type RequestListener } from "node:http";
import { randomUUID } from "node:crypto";
import { httpOperation, logEvent, withLogContext } from "@opencok/core/logging";

export function createChatHttpHandler({
  isReady = () => true,
  sessionHandler,
  profileHandler,
  nicknameHandler,
  mailboxHandler,
  configHandler,
  serverListHandler,
}: {
  isReady?: () => boolean;
  sessionHandler?: AsyncHttpHandler;
  profileHandler?: AsyncHttpHandler;
  nicknameHandler?: AsyncHttpHandler;
  mailboxHandler?: AsyncHttpHandler;
  configHandler?: HttpHandler;
  serverListHandler?: HttpHandler;
  websocketGateway?: WebSocketGateway;
} = {}): HttpHandler {
  const route: RequestListener = (request, response) => {
    if (request.method === "GET" && request.url?.split("?", 1)[0] === "/api/v1global_config") {
      if (configHandler) {
        configHandler(request, response);
      } else {
        response.writeHead(503, { "content-type": "application/json; charset=utf-8" });
        response.end('{"code":0,"data":{}}');
      }
      return;
    }

    if (
      request.method === "GET" &&
      ["/chat/server/links", "/chat/server/all"].includes(request.url?.split("?", 1)[0] ?? "")
    ) {
      if (serverListHandler) serverListHandler(request, response);
      else {
        response.writeHead(503, { "content-type": "application/json; charset=utf-8" });
        response.end('{"code":0,"data":[]}');
      }
      return;
    }

    if (request.method === "POST" && request.url === "/external/session") {
      if (sessionHandler) {
        void sessionHandler(request, response);
      } else {
        response.writeHead(503, { "content-type": "application/json; charset=utf-8" });
        response.end('{"code":0,"data":{}}');
      }
      return;
    }

    if (request.method === "POST" && request.url === chatAvatarProfilePath) {
      if (profileHandler) void profileHandler(request, response);
      else {
        response.writeHead(503, { "content-type": "application/json; charset=utf-8" });
        response.end('{"code":0,"data":{}}');
      }
      return;
    }

    if (request.method === "POST" && request.url === chatNicknamePath) {
      if (nicknameHandler) void nicknameHandler(request, response);
      else {
        response.writeHead(503, { "content-type": "application/json; charset=utf-8" });
        response.end('{"code":0,"data":{}}');
      }
      return;
    }

    if (request.method === "POST" && request.url === chatMailboxPath) {
      if (mailboxHandler) void mailboxHandler(request, response);
      else {
        response.writeHead(503, { "content-type": "application/json; charset=utf-8" });
        response.end('{"code":0,"data":{}}');
      }
      return;
    }
    response.setHeader("Content-Type", "text/plain; charset=utf-8");

    if (request.method === "GET" && request.url === "/_health") {
      let ready = false;
      try {
        ready = isReady() === true;
      } catch {
        ready = false;
      }
      response.writeHead(ready ? 200 : 503);
      response.end(ready ? "ok\n" : "unavailable\n");
      return;
    }

    response.writeHead(404);
    response.end("not found\n");
  };
  return (request, response) => {
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
      route(request, response);
    });
  };
}

export function createChatServer(options: Parameters<typeof createChatHttpHandler>[0] = {}) {
  const server = createServer(createChatHttpHandler(options));
  server.requestTimeout = 4_000;
  server.headersTimeout = 5_000;
  options.websocketGateway?.attach(server);
  return server;
}
