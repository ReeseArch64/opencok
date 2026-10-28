import { expect, test } from "bun:test";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createHash } from "node:crypto";
import { Effect } from "effect";
import { EnvironmentSource } from "@opencok/env/effect";
import { GameService as Game } from "@opencok/services/game";
import { createSessionHandler, verifyForm } from "@opencok/controllers/chat-session";
import { createTokenVerifier } from "@opencok/identity/chat-token";
import {
    createRealmChatSessionIssuer,
    type ChatSessionFetch,
} from "@opencok/connection/realm-chat-session";
import type { ChatSessionIssuer, SessionStore, Session } from "@opencok/contracts/chat";
import type { GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { Rules } from "@opencok/rules/game";
import { sfs, decode, encode } from "@opencok/messages/sfs";
import { config } from "../src/config";

const now = 1792756800123;
const secret = "synthetic-chat-secret";
const endpoint = "http://chat.internal/external/session";
const token = Buffer.alloc(32, 7).toString("base64url");
const ticket = { session: token, expire: Math.floor(now / 1000) + 86400 };
const request = { uid: "self", userinfo: { userName: "Synthetic" } };
const unused = async (): Promise<never> => {
    throw new Error("Unexpected dependency call");
};
function fixture(issuer?: ChatSessionIssuer, clock = () => now)
{
    let profile: Row | undefined = {
        uid: "self",
        serverId: 1,
        banFlag: 0,
        banTime: 0n,
        level: 12,
        name: "玩家 + & = Ç",
        deviceId: "synthetic-device",
        country: "BR",
        pf: "synthetic-platform",
        appVersion: "12.06.0",
        lang: "pt",
        allianceId: "alliance",
        phoneDevice: null,
    };
    const calls: string[] = [];
    const db: GameStore = {
        getProfileById: async (uid) => {
            calls.push(uid);
            return profile;
        },
        getAccountsByPlayerId: unused,
        getCityByPlayerId: unused,
        getWorldByPointIds: unused,
        getPowerByPlayerId: unused,

        getPlayerSummariesByIds: unused,
        mailGroups: unused,
        mailBatch: unused,
        mailCategory: unused,
        mailContents: unused,
        mailConversationSave: unused,
        mailDelete: unused,
        mailRead: unused,
        mailSave: unused,
        mailStatus: unused,
        allianceRanking: unused,
        playerRanking: unused,
    };
    return {
        game: new Game(db, new Rules(new Map(), new Map(), new Map()), { kingdomId: 1 }, clock, {
            chatSession: issuer,
        }),
        calls,
        profile: () => profile!,
        setProfile: (value: Row | undefined) => {
            profile = value;
        },
    };
}
function issuer(
    fetch: ChatSessionFetch,
    options: { timeoutMs?: number; now?: () => number; signingSecret?: string; } = {},
)
{
    return createRealmChatSessionIssuer({
        url: endpoint,
        signingSecret: secret,
        timeoutMs: 1000,
        now: () => now,
        ...options,
        fetch,
    });
}
function memoryExchange(
    store: SessionStore,
    clock = () => now,
    signingSecret = secret,
): ChatSessionFetch
{
    const handler = createSessionHandler({ sessionStore: store, signingSecret, now: clock });
    return async (_url, options) => {
        let status = 0;
        let body = "";
        const request = {
            headers: options.headers,
            async *[Symbol.asyncIterator]()
            {
                yield Buffer.from(String(options.body));
            },
        } as unknown as IncomingMessage;
        const response = {
            writeHead(code: number)
            {
                status = code;
            },
            end(value: string)
            {
                body = value;
            },
        } as unknown as ServerResponse;
        await handler(request, response);
        return new Response(body, {
            status,
            headers: { "content-type": "application/json; charset=utf-8" },
        });
    };
}

test("authenticated realm command issues a usable chat token through the maintained handler without sockets", async () => {
    let clock = now;
    const sessions = new Map<string, Session>();
    const store: SessionStore = {
        create: async (session) => {
            sessions.set(session.tokenHash.toString("hex"), session);
        },
        getById: async (hash) => {
            const session = sessions.get(hash.toString("hex"));
            return session && session.expiresAt.getTime() > clock ? { uid: session.uid } : null;
        },
    };
    const exchange = memoryExchange(store, () => clock);
    const forms: URLSearchParams[] = [];
    const create = issuer(
        async (url, options) => {
            expect(url).toBe(endpoint);
            expect(options.method).toBe("POST");
            expect(options.redirect).toBe("error");
            expect(options.signal).toBeInstanceOf(AbortSignal);
            const form = new URLSearchParams(String(options.body));
            forms.push(form);
            expect(verifyForm(form, secret)).toBeNull();
            expect(form.get("appid")).toBe("100001");
            expect(form.get("ttl")).toBe("86400");
            expect(form.get("uid")).toBe("self");
            expect(String(options.body)).not.toContain(secret);
            return exchange(url, options);
        },
        { now: () => clock },
    );
    const f = fixture(create, () => clock);
    const result = await f.game.execute("self", "chat.session.create", {
        uid: sfs.string("forged"),
        userinfo: sfs.string("forged"),
        serverId: sfs.int(2),
        ttl: sfs.int(0),
        sign: sfs.string("forged"),
        url: sfs.string("http://invalid.example/"),
        _cok_: sfs.string("correlation"),
        cmdBaseTime: sfs.long(9007199254740999n),
    });
    const wire = decode(encode(result.body));
    expect(wire.expire).toEqual(sfs.int(ticket.expire));
    expect(wire._cok_).toEqual(sfs.string("correlation"));
    expect(wire.cmdBaseTime).toEqual(sfs.long(9007199254740999n));
    expect(Object.keys(wire).sort()).toEqual(["_cok_", "cmdBaseTime", "expire", "session"]);
    expect(result.pushes).toEqual([]);
    expect(f.calls).toEqual(["self"]);
    expect(JSON.parse(forms[0]!.get("userinfo")!)).toEqual({
        userName: "玩家 + & = Ç",
        lvl: "12",
        deviceid: "synthetic-device",
        country: "BR",
        pf: "synthetic-platform",
        version: "12.06.0",
        lang: "pt",
        allianceId: "alliance",
        phoneDevice: "",
        serverId: "1",
        serverType: "0",
    });
    const sessionToken = wire.session!.value as string;
    const hash = createHash("sha256").update(sessionToken).digest("hex");
    expect(sessions.size).toBe(1);
    expect(sessions.get(hash)).toEqual({
        uid: "self",
        tokenHash: Buffer.from(hash, "hex"),
        createdAt: new Date(now),
        expiresAt: new Date(ticket.expire * 1000),
    });
    expect(JSON.stringify([...sessions.values()])).not.toContain(sessionToken);
    const verify = createTokenVerifier(store);
    expect(await verify(sessionToken, "self")).toEqual({ uid: "self" });
    expect(await verify(sessionToken, "forged")).toBeNull();
    clock = ticket.expire * 1000;
    expect(await verify(sessionToken, "self")).toBeNull();
    const next = await f.game.execute("self", "chat.session.create", {});
    expect(next.body.session!.value).not.toBe(sessionToken);
    expect(sessions.size).toBe(2);
});

test("one Chat origin configures private routes and remains optional", async () => {
    const base = {
        GAME_SECRET: "synthetic-login",
        GAME_RESOURCES: "synthetic-resources",
        DATABASE_URL: "postgres://synthetic:synthetic@invalid.example/global",
    };
    const disabled = await Effect.runPromise(
        config.pipe(Effect.provideService(EnvironmentSource, base)),
    );
    expect(disabled.chatSession).toBeUndefined();
    expect(disabled.nicknameChat).toBeUndefined();
    expect(disabled.mailChat).toBeUndefined();
    for (
        const [CHAT_URL, origin] of [
            ["http://chat.internal", "http://chat.internal"],
            ["http://chat.internal/", "http://chat.internal"],
            ["https://chat.internal:8083/", "https://chat.internal:8083"],
        ] as const
    )
    {
        const enabled = await Effect.runPromise(
            config.pipe(
                Effect.provideService(EnvironmentSource, {
                    ...base,
                    CHAT_URL,
                    CHAT_SECRET: secret,
                }),
            ),
        );
        expect(enabled.chatSession).toEqual({
            url: `${origin}/external/session`,
            signingSecret: secret,
        });
        expect(enabled.nicknameChat).toEqual({
            url: `${origin}/_internal/nickname`,
            signingSecret: secret,
        });
        expect(enabled.mailChat).toEqual({
            url: `${origin}/_internal/mailbox`,
            signingSecret: secret,
        });
        expect(enabled.timeoutMs).toBe(5000);
    }
});

test("unconfigured, foreign, banned or malformed profile requests cannot reach session issuance", async () => {
    const absent = fixture();
    await expect(absent.game.execute("self", "chat.session.create", {})).rejects.toMatchObject({
        code: "102192",
    });
    expect(absent.calls).toEqual([]);
    let issued = 0;
    for (
        const patch of [
            { uid: "other" },
            { serverId: 2 },
            { banFlag: 1 },
            { banTime: BigInt(now + 1) },
            { name: null },
            { deviceId: null },
            { country: null },
            { pf: null },
            { appVersion: null },
            { lang: null },
            { allianceId: null },
            { level: 1.5 },
            { level: 2147483648 },
            { name: "\ud800" },
        ]
    )
    {
        const f = fixture(async () => {
            issued++;
            return ticket;
        });
        Object.assign(f.profile(), patch);
        await expect(f.game.execute("self", "chat.session.create", {})).rejects.toMatchObject({
            code: "E000000",
        });
    }
    const missing = fixture(async () => {
        issued++;
        return ticket;
    });
    missing.setProfile(undefined);
    await expect(missing.game.execute("self", "chat.session.create", {})).rejects.toMatchObject({
        code: "E100169",
    });
    expect(issued).toBe(0);
    const boundary = fixture(async () => ticket);
    Object.assign(boundary.profile(), { banTime: BigInt(now), phoneDevice: "" });
    expect((await boundary.game.execute("self", "chat.session.create", {})).body.expire).toEqual(
        sfs.int(ticket.expire),
    );
});

test("session payload validation preserves Java integer widths and rejects expired or malformed tokens", async () => {
    const future = 2147483648000;
    const f = fixture(
        async () => ({ session: token, expire: 2147570048 }),
        () => future,
    );
    expect(
        decode(encode((await f.game.execute("self", "chat.session.create", {})).body)).expire,
    ).toEqual(sfs.long(2147570048));
    for (
        const data of [
            null,
            {},
            { ...ticket, expire: Math.floor(now / 1000) },
            { ...ticket, expire: 1.5 },
            { ...ticket, expire: Number.MAX_SAFE_INTEGER + 1 },
            { ...ticket, session: "invalid" },
            { ...ticket, session: "_".repeat(43) },
        ]
    )
    {
        const f = fixture(async () => data as typeof ticket);
        await expect(f.game.execute("self", "chat.session.create", {})).rejects.toMatchObject({
            code: "E000000",
        });
    }
    const throwing = fixture(async () => {
        throw new Error("synthetic private diagnostic");
    });
    await expect(throwing.game.execute("self", "chat.session.create", {})).rejects.toThrow(
        "E000000",
    );
});

test("HTTP issuer validates successful responses and sanitizes transport, authentication and storage failures", async () => {
    for (
        const response of [
            new Response("redirect", {
                status: 302,
                headers: { location: "http://other.invalid/" },
            }),
            Response.json({ code: 0, data: {} }),
            Response.json({ code: "1", data: ticket }),
            Response.json({ code: 1, data: { ...ticket, session: "invalid" } }),
            Response.json({ code: 1, data: { ...ticket, expire: 0 } }),
            new Response("private-secret", { status: 503 }),
            new Response(""),
            new Response("not-json", { headers: { "content-type": "application/json" } }),
            new Response(Buffer.from([255]), { headers: { "content-type": "application/json" } }),
            new Response(JSON.stringify({ code: 1, data: ticket }), {
                headers: { "content-type": "text/html" },
            }),
        ]
    )
    {
        await expect(issuer(async () => response)(request)).rejects.toThrow(
            "Chat session unavailable",
        );
    }
    const unavailable: SessionStore = {
        create: async () => {
            throw new Error("private-store-failure");
        },
        getById: unused,
    };
    await expect(issuer(memoryExchange(unavailable))(request)).rejects.toThrow(
        "Chat session unavailable",
    );
    let writes = 0;
    const store: SessionStore = {
        create: async () => {
            writes++;
        },
        getById: unused,
    };
    await expect(
        issuer(memoryExchange(store, () => now, "wrong-synthetic-secret"))(request),
    ).rejects.toThrow("Chat session unavailable");
    expect(writes).toBe(0);
    await expect(
        issuer(async () => {
            throw new Error("private-network-failure");
        })(request),
    ).rejects.toThrow("Chat session unavailable");
    expect(
        await issuer(async () => Response.json({ code: 1, data: { ...ticket, extra: "ignored" } }))(
            request,
        ),
    ).toEqual(ticket);
});

test("form and streamed response bounds fail before oversized input is sent or retained", async () => {
    let calls = 0;
    const create = issuer(async () => {
        calls++;
        return Response.json({ code: 1, data: ticket });
    });
    await expect(create({ uid: "self", userinfo: { value: "🎮".repeat(2000) } })).rejects.toThrow(
        "Chat session unavailable",
    );
    for (const uid of ["", " ", "x".repeat(41), "\0", "\ud800"])
    {
        await expect(create({ ...request, uid })).rejects.toThrow("Chat session unavailable");
    }
    expect(calls).toBe(0);
    let cancelled = 0;
    const stream = new ReadableStream<Uint8Array>({
        start(controller)
        {
            controller.enqueue(Buffer.alloc(10000, 32));
            controller.enqueue(Buffer.alloc(10000, 32));
        },
        cancel()
        {
            cancelled++;
        },
    });
    await expect(
        issuer(async () =>
            new Response(stream, { headers: { "content-type": "application/json" } })
        )(
            request,
        ),
    ).rejects.toThrow("Chat session unavailable");
    expect(cancelled).toBe(1);
    for (const length of ["16385", "-1", "invalid"])
    {
        await expect(
            issuer(
                async () =>
                    new Response("{}", {
                        headers: { "content-type": "application/json", "content-length": length },
                    }),
            )(request),
        ).rejects.toThrow("Chat session unavailable");
    }
});

test("the deadline covers both a stalled fetch and a stalled response stream", async () => {
    let signal: AbortSignal | null | undefined;
    await expect(
        issuer(
            async (_url, options) => {
                signal = options.signal;
                return new Promise(() => {});
            },
            { timeoutMs: 100 },
        )(request),
    ).rejects.toThrow("Chat session unavailable");
    expect(signal?.aborted).toBe(true);
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
        cancel()
        {
            cancelled = true;
        },
    });
    await expect(
        issuer(
            async () => new Response(stream, { headers: { "content-type": "application/json" } }),
            {
                timeoutMs: 100,
            },
        )(request),
    ).rejects.toThrow("Chat session unavailable");
    expect(cancelled).toBe(true);
});

test("internal endpoint validation cannot send signing material through redirects or malformed configuration", () => {
    for (
        const url of [
            "invalid",
            "ftp://chat.internal/external/session",
            "http://u:p@chat.internal/external/session",
            "https://chat.internal/external/session?secret=x",
            "https://chat.internal/external/session#x",
            "https://chat.internal/other",
            "https://cok.chat/external/session",
            "https://other.cok.chat/external/session",
        ]
    )
    {
        expect(() => createRealmChatSessionIssuer({ url, signingSecret: secret, timeoutMs: 1000 }))
            .toThrow("Invalid chat session configuration");
    }
    for (const timeoutMs of [0, 99, 30001, 100.5, NaN])
    {
        expect(() =>
            createRealmChatSessionIssuer({ url: endpoint, signingSecret: secret, timeoutMs })
        ).toThrow();
    }
    expect(() =>
        createRealmChatSessionIssuer({ url: endpoint, signingSecret: "", timeoutMs: 1000 })
    ).toThrow();
});
