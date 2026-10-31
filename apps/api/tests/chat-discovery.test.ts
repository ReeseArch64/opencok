import { expect, test, spyOn } from "bun:test";
import { gatewayYaml } from "./support/gateway";
import type { IncomingMessage, ServerResponse } from "node:http";
import { Effect } from "effect";
import { EnvironmentSource } from "@opencok/env/effect";
import { createHandler } from "@opencok/api/handler";
import { createChatDiscovery } from "@opencok/connection/chat-discovery";
import { createConfigHandler, createServerListHandler } from "@opencok/controllers/chat-config";
import {
    chatDiscoveryPaths,
    type ChatDiscovery,
    type ChatDiscoveryPath,
} from "@opencok/contracts/chat";
import { readConfig } from "../src/config";
import { ApiDependencies, createApp } from "../src/app";

const origin = "http://chat.internal:8083";
const publicUrl = "wss://chat.example.invalid:8443/chat/ws";
const accounts = { getAll: async () => [], health: async () => {} };
const directory = { read: async () => new Map() };
const redis = { health: async () => {} };
const server = { ip: "chat.example.invalid", port: "8443", protocol: "wss" };
const list = { code: 1, data: [server], message: "success" };

function exchange(options: { isReady?: () => boolean; websocketUrl?: string; } = {})
{
    const calls: { url: string; options: RequestInit; }[] = [];
    const config = { websocketUrl: options.websocketUrl ?? publicUrl, isReady: options.isReady };
    const handlers = {
        config: createConfigHandler(config),
        servers: createServerListHandler(config),
    };
    const fetch = async (url: string, options: RequestInit) => {
        calls.push({ url, options });
        let status = 0;
        let body = "";
        const headers = new Headers();
        const response = {
            setHeader(key: string, value: string)
            {
                headers.set(key, value);
            },
            writeHead(value: number)
            {
                status = value;
            },
            end(value: string)
            {
                body = value;
            },
        } as unknown as ServerResponse;
        const request = { method: options.method, url: new URL(url).pathname } as IncomingMessage;
        const handler = request.url === "/api/v1global_config" ? handlers.config : handlers.servers;
        handler(request, response);
        return new Response(body, { status, headers });
    };
    return { fetch, calls };
}

function provider(
    fetch: (url: string, options: RequestInit) => Promise<Response>,
    timeoutMs = 1000,
)
{
    return createChatDiscovery({ origin, timeoutMs, fetch });
}

const appFor = (chat?: ChatDiscovery) => createHandler(accounts, directory, redis, chat);

test("API discovery returns the maintained chat configuration and server lists through an in-memory exchange", async () => {
    const upstream = exchange();
    const app = appFor(provider(upstream.fetch));
    const response = await app.fetch(new Request("http://api.invalid/api/v1global_config"));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("x-request-id")).toBeTruthy();
    const payload = await response.json();
    expect(payload).toEqual({
        code: 1,
        data: {
            websocket: { urlArray: [publicUrl] },
            url: { websocket: [publicUrl] },
            messageShow: {
                allianceSystemMessageCount: 0,
                countrySystemMessageCount: 0,
                countryNormalMessageTypes: [0],
                countrySystemMessageTypes: [],
                allianceNormalMessageTypes: [0],
                allianceSystemMessageTypes: [],
                singleNormalMessageTypes: [],
                groupNormalMessageTypes: [],
                show_translate_button_post_arry: [],
                knightTeamMessageTypes: [],
            },
            normalMessageTypes: { 0: [0], 1: [0], 12: [0], 13: [0] },
        },
    });
    for (const path of chatDiscoveryPaths.slice(1))
    {
        const response = await app.fetch(new Request(`http://api.invalid${path}`));
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual(list);
        expect(response.headers.get("cache-control")).toBe("no-store");
    }
    expect(upstream.calls.map(({ url }) => url)).toEqual(
        chatDiscoveryPaths.map((path) => origin + path),
    );
    for (const call of upstream.calls)
    {
        expect(call.options.method).toBe("GET");
        expect(call.options.redirect).toBe("error");
        expect(call.options.headers).toEqual({ accept: "application/json" });
        expect(call.options.body).toBeUndefined();
    }
});

test("disabled discovery and excluded routes or methods never reach chat", async () => {
    for (const path of chatDiscoveryPaths)
    {
        expect((await appFor().fetch(new Request(`http://api.invalid${path}`))).status).toBe(404);
    }
    const upstream = exchange();
    const app = appFor(provider(upstream.fetch));
    for (
        const path of [
            "/external/session",
            "/_health",
            "/chat/ws",
            "/chat/server/other",
            "/chat/server/links/",
            "/api/v1global_config/extra",
        ]
    )
    {
        expect((await app.fetch(new Request(`http://api.invalid${path}`))).status).toBe(404);
    }
    for (const method of ["POST", "PUT", "DELETE", "HEAD", "OPTIONS"])
    {
        for (const path of chatDiscoveryPaths)
        {
            expect((await app.fetch(new Request(`http://api.invalid${path}`, { method }))).status)
                .toBe(
                    404,
                );
        }
    }
    expect(upstream.calls).toEqual([]);
    const discovery = provider(upstream.fetch);
    for (
        const path of [
            "https://other.invalid",
            "/external/session",
            "/api/v1global_config?secret=x",
            "//other.invalid/chat/server/all",
        ]
    )
    {
        await expect(discovery(path as ChatDiscoveryPath)).rejects.toThrow(
            "Chat discovery unavailable",
        );
    }
    expect(upstream.calls).toEqual([]);
});

test("caller credentials and upstream private headers never cross the public discovery boundary", async () => {
    const calls: unknown[] = [];
    const logs: unknown[] = [];
    const logger = spyOn(console, "info").mockImplementation((value) => {
        logs.push(value);
    });
    try
    {
        const app = appFor(
            provider(async (url, options) => {
                calls.push({ url, headers: options.headers, body: options.body });
                return Response.json(
                    { ...list, extra: "discarded", data: [{ ...server, private: "discarded" }] },
                    {
                        headers: {
                            "set-cookie": "private-upstream-cookie",
                            "x-private": "private-header",
                            location: "http://private.invalid/",
                        },
                    },
                );
            }),
        );
        const response = await app.fetch(
            new Request(
                "http://api.invalid/chat/server/links?token=private-query&url=http://other.invalid",
                {
                    headers: {
                        authorization: "Bearer private-auth",
                        cookie: "private-cookie",
                        "x-request-id": "private-correlation",
                    },
                },
            ),
        );
        expect(calls).toEqual([
            {
                url: `${origin}/chat/server/links`,
                headers: { accept: "application/json" },
                body: undefined,
            },
        ]);
        expect(await response.json()).toEqual(list);
        for (const header of ["set-cookie", "x-private", "location"])
        {
            expect(response.headers.get(header)).toBeNull();
        }
        expect(response.headers.get("x-request-id")).not.toBe("private-correlation");
        expect(JSON.stringify(logs)).not.toContain("private-");
        expect(JSON.stringify(logs)).not.toContain(origin);
        expect(JSON.stringify(logs)).not.toContain("/chat/server/links?");
        expect(JSON.stringify(logs)).not.toContain("other.invalid");
    }
    finally
    {
        logger.mockRestore();
    }
});

test("chat readiness failure is explicit while API and game discovery remain independently usable", async () => {
    let ready = false;
    const upstream = exchange({ isReady: () => ready });
    const app = appFor(provider(upstream.fetch));
    for (const path of chatDiscoveryPaths)
    {
        const response = await app.fetch(new Request(`http://api.invalid${path}`));
        expect(response.status).toBe(503);
        expect(response.headers.get("cache-control")).toBe("no-store");
        expect(await response.json()).toEqual({
            code: 0,
            data: path === "/api/v1global_config" ? {} : [],
        });
    }
    expect((await app.fetch(new Request("http://api.invalid/readyz"))).status).toBe(200);
    const realms = await app.fetch(
        new Request("http://api.invalid/gameservice/getline.php?loginFlag=1"),
    );
    expect(await realms.json()).toEqual({ serverList: [], country: 1 });
    ready = true;
    expect((await app.fetch(new Request("http://api.invalid/api/v1global_config"))).status).toBe(
        200,
    );
    const throwing = exchange({
        isReady: () => {
            throw new Error("private-readiness-detail");
        },
    });
    expect(
        (
            await appFor(provider(throwing.fetch)).fetch(
                new Request("http://api.invalid/chat/server/all"),
            )
        ).status,
    ).toBe(503);
});

test("malformed, unready, redirect and non-JSON upstream replies are unavailable without exposing details", async () => {
    for (
        const response of [
            new Response("private-error", { status: 500 }),
            new Response("redirect", {
                status: 302,
                headers: { location: "http://other.invalid" },
            }),
            new Response("{}", { headers: { "content-type": "text/html" } }),
            new Response("private-not-json", { headers: { "content-type": "application/json" } }),
            new Response(Buffer.from([255]), { headers: { "content-type": "application/json" } }),
            Response.json({ code: 0, data: [] }),
            Response.json({ code: "1", data: [server] }),
            Response.json({ code: 1, data: {} }),
            Response.json({ ...list, data: [] }),
            Response.json({ ...list, data: [{ ...server, port: "65536" }] }),
            Response.json({ ...list, data: [{ ...server, protocol: "file" }] }),
        ]
    )
    {
        const app = appFor(provider(async () => response));
        const result = await app.fetch(new Request("http://api.invalid/chat/server/all"));
        expect(result.status).toBe(503);
        expect(await result.json()).toEqual({ code: 0, data: [] });
    }
    const valid = await provider(exchange().fetch)("/api/v1global_config");
    for (
        const data of [
            null,
            [],
            {},
            { ...(valid.data as object), websocket: { urlArray: ["https://invalid/"] } },
            { ...(valid.data as object), url: { websocket: ["wss://other.invalid/chat/ws"] } },
        ]
    )
    {
        await expect(
            provider(async () => Response.json({ code: 1, data }))("/api/v1global_config"),
        ).rejects.toThrow("Chat discovery unavailable");
    }
    await expect(
        provider(async () => {
            throw new Error("private-network-detail");
        })("/chat/server/all"),
    ).rejects.toThrow("Chat discovery unavailable");
});

test("public metadata is bounded during stream consumption and the full request obeys its deadline", async () => {
    let cancelled = 0;
    const large = new ReadableStream<Uint8Array>({
        start(controller)
        {
            controller.enqueue(Buffer.alloc(9000, 32));
            controller.enqueue(Buffer.alloc(9000, 32));
        },
        cancel()
        {
            cancelled++;
        },
    });
    await expect(
        provider(async () =>
            new Response(large, { headers: { "content-type": "application/json" } })
        )(
            "/chat/server/all",
        ),
    ).rejects.toThrow("Chat discovery unavailable");
    expect(cancelled).toBe(1);
    for (const length of ["16385", "invalid"])
    {
        await expect(
            provider(async () => Response.json(list, { headers: { "content-length": length } }))(
                "/chat/server/all",
            ),
        ).rejects.toThrow();
    }
    let signal: AbortSignal | null | undefined;
    await expect(
        provider(async (_url, options) => {
            signal = options.signal;
            return new Promise(() => {});
        }, 100)("/chat/server/all"),
    ).rejects.toThrow("Chat discovery unavailable");
    expect(signal?.aborted).toBe(true);
    const stalled = new ReadableStream<Uint8Array>({
        cancel()
        {
            cancelled++;
        },
    });
    await expect(
        provider(
            async () => new Response(stalled, { headers: { "content-type": "application/json" } }),
            100,
        )("/api/v1global_config"),
    ).rejects.toThrow();
    expect(cancelled).toBe(2);
});

test("origin and dependency configuration reach the API without starting a server", async () => {
    const values = {
        DATABASE_URL: "postgres://synthetic:synthetic@invalid.example/global",
        CHAT_URL: origin,
    };
    const config = await Effect.runPromise(
        readConfig.pipe(Effect.provideService(EnvironmentSource, values)),
    );
    expect(config.chatUrl).toBe(origin);
    expect(config.timeoutMs).toBe(3000);
    const discovery = provider(exchange().fetch);
    const app = await Effect.runPromise(
        createApp.pipe(
            Effect.provideService(ApiDependencies, {
                accounts,
                directory,
                redis,
                chatDiscovery: discovery,
            }),
        ),
    );
    expect((await app.fetch(new Request("http://api.invalid/chat/server/all"))).status).toBe(200);
    for (
        const value of [
            "invalid",
            "file:///external",
            "http://u:p@host/",
            "http://host/external/session",
            "http://host/?secret=x",
            "http://host/#fragment",
            "https://cok.chat",
            "https://other.cok.chat",
        ]
    )
    {
        expect(() => createChatDiscovery({ origin: value, timeoutMs: 1000 })).toThrow(
            "Invalid chat discovery configuration",
        );
    }
    for (const timeoutMs of [0, 99, 30001, NaN, 100.5])
    {
        expect(() => createChatDiscovery({ origin, timeoutMs })).toThrow();
    }
});

test("gateway allowlisting exposes only the three public GET metadata paths and keeps existing destinations", async () => {
    const gateway = Bun.YAML.parse(
        await gatewayYaml(),
    ) as {
        http: {
            routers: Record<string, { rule: string; service: string; entryPoints: string[]; }>;
        };
    };
    const route = gateway.http.routers["chat-discovery"]!;
    expect(route.service).toBe("api");
    expect(route.entryPoints).toEqual(["web"]);
    expect([...route.rule.matchAll(/Path\(`([^`]+)`\)/g)].map((match) => match[1])).toEqual([
        ...chatDiscoveryPaths,
    ]);
    expect([...route.rule.matchAll(/Method\(`([^`]+)`\)/g)].map((match) => match[1])).toEqual([
        "GET",
    ]);
    expect(route.rule).not.toMatch(/PathPrefix|\/external\/|\/chat\/ws|Authorization/);
    expect(gateway.http.routers.discovery!.service).toBe("api");
    expect(gateway.http.routers["cdn-cok"]!.service).toBe("cdn-storage");
});
