import { randomUUID } from "node:crypto";
import { phpEmpty, phpJson, phpUrlDecode, requestParameters } from "./compat.ts";
import { Discovery } from "./discovery.ts";
import type { AccountReader } from "@opencok/contracts/account";
import type { ServerDirectory } from "@opencok/storage/server-directory";
import { DependencyError } from "@opencok/errors/dependency";

const discoveryPaths = new Set([
  "/gameservice/getserverlist.php",
  "/gameservice/getline.php",
  "/gameservice/getserverlist_memoryold.php",
]);
const methods = new Set(["GET", "HEAD", "POST"]);
const text = (body: string, status = 200) =>
  new Response(body, { status, headers: { "Content-Type": "text/plain; charset=UTF-8" } });
const legacy = (value: unknown) =>
  new Response(phpJson(value), { headers: { "Content-Type": "text/html; charset=UTF-8" } });

export function createHandler(
  accounts: AccountReader & { health(): Promise<unknown> },
  directory: Pick<ServerDirectory, "read">,
  redis: { health(): Promise<unknown> },
) {
  const discovery = new Discovery(accounts, directory);
  async function route(request: Request): Promise<Response> {
    const path = new URL(request.url).pathname.replace(/\/{2,}/g, "/");
    if (["/healthz", "/_health.php"].includes(path) && ["GET", "HEAD"].includes(request.method))
      return text("ok\n");
    if (path === "/readyz" && ["GET", "HEAD"].includes(request.method)) {
      await accounts.health();
      await redis.health();
      return Response.json({ status: "ready" });
    }
    if (discoveryPaths.has(path) && methods.has(request.method))
      return legacy(await discovery.run(await requestParameters(request)));
    if (path === "/gameservice/api/query_userinfo_by_name.php" && methods.has(request.method)) {
      const params = await requestParameters(request);
      const account = !phpEmpty(params.name)
        ? (await accounts.valid("name", phpUrlDecode(params.name!), false))[0]
        : undefined;
      return legacy(
        account ? { found: 1, gameUid: account.gameUid, server: account.server } : { found: 0 },
      );
    }
    return text("Not Found", 404);
  }
  return {
    async fetch(request: Request): Promise<Response> {
      const started = performance.now(),
        requestId = randomUUID();
      let response: Response, failure: string | undefined;
      try {
        response = await route(request);
      } catch (error) {
        failure = error instanceof DependencyError ? error.dependency : "request_failed";
        response = text("", error instanceof DependencyError ? 503 : 500);
      }
      response.headers.set("X-Request-ID", requestId);
      console.info(
        JSON.stringify({
          event: "http",
          requestId,
          method: request.method,
          status: response.status,
          durationMs: Math.round(performance.now() - started),
          failure,
        }),
      );
      return request.method === "HEAD"
        ? new Response(null, { status: response.status, headers: response.headers })
        : response;
    },
  };
}
