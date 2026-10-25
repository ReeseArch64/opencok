import { characterPath } from "@opencok/contracts/provisioning";
import { IMAGE_PATH, UPLOAD_PATH } from "@opencok/contracts/files";
import { HttpError } from "@opencok/errors/http";
import { logContext, logEvent, logHttpRequest } from "@opencok/core/logging";
import {
  chatDiscoveryPaths,
  type ChatDiscovery,
  type ChatDiscoveryPath,
} from "@opencok/contracts/chat";
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
  chatDiscovery?: ChatDiscovery,
  files?: (request: Request) => Promise<Response>,
  provisioning?: (request: Request) => Promise<Response>,
) {
  const discovery = new Discovery(accounts, directory);
  async function route(request: Request): Promise<Response> {
    const rawPath = new URL(request.url).pathname;
    if (rawPath === characterPath)
      return provisioning
        ? provisioning(request)
        : Response.json(
            { state: "unavailable" },
            { status: 503, headers: { "Cache-Control": "no-store" } },
          );
    if (
      files &&
      (rawPath === UPLOAD_PATH ||
        IMAGE_PATH.test(rawPath) ||
        /^\/_internal\/avatars\/[0-9]{1,20}\/[1-9][0-9]{0,5}(\/url)?$/.test(rawPath))
    )
      return files(request);
    const path = new URL(request.url).pathname.replace(/\/{2,}/g, "/");
    if (
      chatDiscovery &&
      request.method === "GET" &&
      (chatDiscoveryPaths as readonly string[]).includes(path)
    ) {
      try {
        return Response.json(await chatDiscovery(path as ChatDiscoveryPath), {
          headers: { "Cache-Control": "no-store" },
        });
      } catch {
        return Response.json(
          { code: 0, data: path === "/api/v1global_config" ? {} : [] },
          { status: 503, headers: { "Cache-Control": "no-store" } },
        );
      }
    }
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
        ? (await accounts.getAll("name", phpUrlDecode(params.name!), false))[0]
        : undefined;
      return legacy(
        account ? { found: 1, gameUid: account.gameUid, server: account.server } : { found: 0 },
      );
    }
    return text("Not Found", 404);
  }
  async function fetchRequest(request: Request): Promise<Response> {
    const requestId = logContext().requestId;
    let response: Response, failure: string | undefined;
    try {
      response = await route(request);
    } catch (error) {
      failure = error instanceof DependencyError ? error.dependency : "request_failed";
      response = text(
        "",
        error instanceof HttpError ? error.status : error instanceof DependencyError ? 503 : 500,
      );
    }
    if (requestId) response.headers.set("X-Request-ID", String(requestId));
    if (failure) logEvent("request_failed", { reason: failure, status: response.status }, "error");
    return request.method === "HEAD"
      ? new Response(null, { status: response.status, headers: response.headers })
      : response;
  }
  return { fetch: (request: Request) => logHttpRequest(request, fetchRequest) };
}
