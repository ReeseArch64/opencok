import type { AsyncHttpHandler, HttpHandler, WebSocketGateway } from "@opencok/contracts/chat";
import { createServer } from "node:http";

export function createChatServer({
  isReady = () => true,
  sessionHandler,
  configHandler,
  serverListHandler,
  websocketGateway,
}: {
  isReady?: () => boolean;
  sessionHandler?: AsyncHttpHandler;
  configHandler?: HttpHandler;
  serverListHandler?: HttpHandler;
  websocketGateway?: WebSocketGateway;
} = {}) {
  const server = createServer((request, response) => {
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
  });

  server.requestTimeout = 4_000;
  server.headersTimeout = 5_000;
  websocketGateway?.attach(server);
  return server;
}
