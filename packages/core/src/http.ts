import { BunHttpServer } from "@effect/platform-bun";
import { Effect } from "effect";
import { logHttpRequest } from "./logging.ts";
import { HttpServerRequest, HttpServerResponse } from "effect/http";

export function serveHttp(
  config: { host: string; port: number; maxRequestBodySize?: number; idleTimeout?: number },
  fetch: (request: Request) => Promise<Response> | Response,
) {
  return Effect.gen(function* () {
    const server = yield* BunHttpServer.make({
      hostname: config.host,
      port: config.port,
      maxRequestBodySize: config.maxRequestBodySize ?? 65536,
      idleTimeout: config.idleTimeout ?? 20,
    });
    yield* server.serve(
      Effect.gen(function* () {
        const incoming = yield* HttpServerRequest.HttpServerRequest;
        const request = yield* HttpServerRequest.toWeb(incoming);
        const response = yield* Effect.tryPromise(() => logHttpRequest(request, fetch)).pipe(
          Effect.uninterruptible,
        );

        return HttpServerResponse.fromWeb(response);
      }).pipe(Effect.catchCause(() => Effect.succeed(HttpServerResponse.empty({ status: 500 })))),
    );

    return { port: "port" in server.address ? server.address.port : config.port };
  });
}
