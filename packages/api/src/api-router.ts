import { characterPath } from "@opencok/contracts/provisioning";
import { IMAGE_PATH, UPLOAD_PATH } from "@opencok/contracts/files";
import { chatDiscoveryPaths, type ChatDiscoveryPath } from "@opencok/contracts/chat";
import { phpEmpty, phpJson, phpUrlDecode, requestParameters } from "./compat.ts";
import { Discovery } from "./discovery.ts";

import type { ApiHandlerOptions } from "./api-handler-options.ts";

export class ApiRouter {
  private readonly discovery: Discovery;
  private readonly discoveryPaths = new Set([
    "/gameservice/getserverlist.php",
    "/gameservice/getline.php",
    "/gameservice/getserverlist_memoryold.php",
  ]);
  private readonly methods = new Set(["GET", "HEAD", "POST"]);

  public constructor(private readonly options: ApiHandlerOptions) {
    this.discovery = new Discovery(options.accounts, options.directory);
  }

  public async route(request: Request): Promise<Response> {
    const { accounts, redis, files, provisioning, chatDiscovery } = this.options;
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
      return this.text("ok\n");

    if (path === "/readyz" && ["GET", "HEAD"].includes(request.method)) {
      await accounts.health();
      await redis.health();

      return Response.json({ status: "ready" });
    }

    if (this.discoveryPaths.has(path) && this.methods.has(request.method))
      return this.legacy(await this.discovery.run(await requestParameters(request)));

    if (
      path === "/gameservice/api/query_userinfo_by_name.php" &&
      this.methods.has(request.method)
    ) {
      const params = await requestParameters(request);
      const account = !phpEmpty(params.name)
        ? (await accounts.getAll("name", phpUrlDecode(params.name!), false))[0]
        : undefined;

      return this.legacy(
        account ? { found: 1, gameUid: account.gameUid, server: account.server } : { found: 0 },
      );
    }

    return this.text("Not Found", 404);
  }

  private text(body: string, status = 200): Response {
    return new Response(body, { status, headers: { "Content-Type": "text/plain; charset=UTF-8" } });
  }

  private legacy(value: unknown): Response {
    return new Response(phpJson(value), {
      headers: { "Content-Type": "text/html; charset=UTF-8" },
    });
  }
}
