import { expect, test } from "bun:test";
import type { IncomingMessage, ServerResponse } from "node:http";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as global from "@opencok/drizzle/schema/global";
import * as kingdom from "@opencok/drizzle/schema/kingdom";
import { createChatAvatarProfileStore } from "@opencok/repositories/chat-avatar-profile";
import { publishAvatarChat } from "@opencok/repositories/avatar-profile";
import { avatarChatUpdate, avatarProfileUpdate } from "@opencok/rules/avatar-profile";
import { createChatAvatarProfilePublisher } from "@opencok/connection/chat-avatar-profile";
import { createChatHttpHandler } from "@opencok/connection/chat-server";
import { createChatAvatarProfileHandler } from "@opencok/controllers/chat-avatar-profile";
import {
    signChatAvatarProfile,
    verifyChatAvatarProfile,
} from "@opencok/identity/chat-avatar-profile";
import {
    chatAvatarProfilePath,
    encodeAvatarProfile,
    decodeAvatarProfile,
    type ChatAvatarProfileStore,
} from "@opencok/contracts/chat-avatar-profile";
import type { AvatarCompletionRecord, AvatarProfileUpdate } from "@opencok/contracts/files";

const now = 1792756800123;
const secret = "synthetic-chat-secret";
const url = `http://chat.internal${chatAvatarProfilePath}`;
const update: AvatarProfileUpdate = {
    owner: "1001",
    kingdomId: 1,
    sequence: 5,
    picVer: 2000005,
    committedAt: BigInt(now),
    updatedAt: "1792756800",
    userName: "玩家 + & Ç",
    platform: "synthetic",
};
const entry = (): AvatarCompletionRecord => ({
    ownerUid: update.owner,
    sequence: update.sequence,
    hash: "a".repeat(64),
    picVer: update.picVer,
    committedAt: update.committedAt,
    pendingEffects: 7,
    effects: JSON.stringify({
        version: 1,
        profile: {
            userName: update.userName,
            platform: update.platform,
            updatedAt: update.updatedAt,
        },
    }),
});
const values = (u: AvatarProfileUpdate) => [
    u.owner,
    u.kingdomId,
    u.sequence,
    u.picVer,
    u.committedAt,
    u.userName,
    u.platform,
    u.revision ?? 0n,
];
function globalFixture()
{
    let state = { route: ["1001", "1"] as unknown[] | null, row: null as unknown[] | null };
    let working = structuredClone(state);
    let failure = "";
    const queries: { text: string; params: unknown[]; }[] = [];
    const client = {
        query: async (query: { text: string; }, params: unknown[] = []) => {
            const text = query.text;
            queries.push({ text, params });
            if (text.startsWith("begin"))
            {
                working = structuredClone(state);
                return { rows: [] };
            }
            if (text === "rollback")
            {
                return { rows: [] };
            }
            if (text === "commit")
            {
                if (failure === "commit")
                {
                    throw new Error("synthetic-private-detail");
                }
                state = working;
                if (failure === "lost")
                {
                    throw new Error("synthetic-private-detail");
                }
                return { rows: [] };
            }
            if (text.startsWith("select"))
            {
                if (text.includes("inner join"))
                {
                    expect(text).toContain(
                        "cast(\"opencok_chat\".\"chat_avatar_profile\".\"kingdom_id\" as text)",
                    );
                    expect(params).toEqual(["1001", 1, 1]);
                    const row = state.row;
                    return {
                        rows: row && state.route?.[0] === row[0]
                                && state.route?.[1] === String(row[1])
                            ? [row]
                            : [],
                    };
                }
                if (text.includes("\"account_new\""))
                {
                    if (text.endsWith("for update"))
                    {
                        expect(params).toEqual(["1001", 1]);
                        return { rows: working.route ? [working.route] : [] };
                    }
                    expect(params).toEqual(["1001", 1, "1001", 1]);
                    return { rows: working.route ? [[null, false]] : [] };
                }
                expect(text).toEndWith("for update");
                expect(params).toEqual(["1001", 1, 1]);
                return { rows: working.row ? [working.row] : [] };
            }
            if (failure === "write")
            {
                throw new Error("synthetic-private-detail");
            }
            expect(text.startsWith("insert") || text.startsWith("update")).toBe(true);
            expect(text).toContain("\"opencok_chat\".\"chat_avatar_profile\"");
            if (text.startsWith("update"))
            {
                expect(params.slice(8)).toEqual(["1001", 1]);
            }
            if (failure === "empty")
            {
                return { rows: [] };
            }
            working.row = params.slice(0, 8);
            return { rows: [["1001"]] };
        },
    };
    const db = drizzle(client as unknown as NodePgClient, { schema: global });
    return {
        store: createChatAvatarProfileStore(db),
        queries,
        get state()
        {
            return state;
        },
        fail(value: string)
        {
            failure = value;
        },
    };
}
function realmFixture()
{
    let state = {
        profile: ["1001", 1] as unknown[] | null,
        entry: entry() as AvatarCompletionRecord | null,
    };
    let working = structuredClone(state);
    let failure = "";
    const queries: { text: string; params: unknown[]; }[] = [];
    const client = {
        query: async (query: { text: string; }, params: unknown[] = []) => {
            const text = query.text;
            queries.push({ text, params });
            if (text.startsWith("begin"))
            {
                working = structuredClone(state);
                return { rows: [] };
            }
            if (text === "rollback")
            {
                return { rows: [] };
            }
            if (text === "commit")
            {
                if (failure === "commit")
                {
                    throw new Error("Synthetic commit failure");
                }
                state = working;
                if (failure === "lost")
                {
                    throw new Error("Synthetic lost reply");
                }
                return { rows: [] };
            }
            if (text.startsWith("select"))
            {
                expect(text).toEndWith("for update");
                if (text.includes("\"userprofile\""))
                {
                    expect(params).toEqual(["1001", 1]);
                    return { rows: working.profile ? [working.profile] : [] };
                }
                expect(params).toEqual(["1001", 5, 1]);
                const e = working.entry;
                return {
                    rows: e
                        ? [
                            [
                                e.ownerUid,
                                e.sequence,
                                e.hash,
                                e.picVer,
                                e.committedAt,
                                e.effects,
                                e.pendingEffects,
                                e.revision ?? 0n,
                            ],
                        ]
                        : [],
                };
            }
            expect(text).toStartWith("update \"opencok_kingdom\".\"avatar_completion\"");
            expect(params.slice(1)).toEqual(["1001", 5, working.entry!.pendingEffects]);
            if (failure === "cas")
            {
                return { rows: [] };
            }
            working.entry!.pendingEffects = Number(params[0]);
            return { rows: [["1001"]] };
        },
    };
    const db = drizzle(client as unknown as NodePgClient, { schema: kingdom });
    return {
        db,
        queries,
        get state()
        {
            return state;
        },
        fail(value: string)
        {
            failure = value;
        },
        run: (publisher: ReturnType<typeof createChatAvatarProfilePublisher>, timeoutMs = 1000) =>
            publishAvatarChat(db, 1, "1001", 5, avatarChatUpdate, publisher, timeoutMs),
    };
}
async function invoke(
    handler: ReturnType<typeof createChatAvatarProfileHandler>,
    body: string | Uint8Array,
    headers: Record<string, string> = {},
    chunks?: AsyncIterable<Buffer>,
)
{
    let status = 0,
        responseBody = "";
    const request = {
        headers: { "content-type": "application/json", ...headers },
        [Symbol.asyncIterator]: chunks
            ? chunks[Symbol.asyncIterator].bind(chunks)
            : async function*()
            {
                yield Buffer.from(body);
            },
    } as unknown as IncomingMessage;
    const response = {
        writeHead(value: number)
        {
            status = value;
        },
        end(value: string)
        {
            responseBody = value;
        },
    } as unknown as ServerResponse;
    await handler(request, response);
    return new Response(responseBody, { status, headers: { "content-type": "application/json" } });
}
const auth = (body: string, time = String(now)) => ({
    "x-opencok-timestamp": time,
    "x-opencok-signature": signChatAvatarProfile(body, time, secret),
});
function publisher(
    store: ChatAvatarProfileStore,
    transform?: (response: Response) => Response | Promise<Response>,
)
{
    const handler = createChatAvatarProfileHandler({
        profiles: store,
        signingSecret: secret,
        now: () => now,
    });
    return createChatAvatarProfilePublisher({
        url,
        signingSecret: secret,
        timeoutMs: 1000,
        now: () => now,
        fetch: async (target, options) => {
            expect(target).toBe(url);
            expect(options.method).toBe("POST");
            expect(options.redirect).toBe("error");
            expect(options.signal).toBeInstanceOf(AbortSignal);
            const response = await invoke(
                handler,
                String(options.body),
                options.headers as Record<string, string>,
            );
            return transform ? transform(response) : response;
        },
    });
}

test("chat persists captured metadata before the realm acknowledges only bit four, without sockets", async () => {
    for (const bits of [4, 5, 6, 7])
    {
        const g = globalFixture(),
            r = realmFixture();
        r.state.entry!.pendingEffects = bits;
        const before = structuredClone(r.state.entry!);
        expect(await r.run(publisher(g.store))).toEqual({
            profile: { uid: "1001", serverId: 1 },
            published: true,
        });
        expect(await g.store.find("1001", 1)).toEqual(update);
        expect(r.state.entry).toEqual({ ...before, pendingEffects: bits & ~4 });
        expect(g.state.row).toEqual(values(update));
        expect(g.queries[0]!.text).toBe("begin isolation level read committed read write");
        const count = g.queries.length;
        expect((await r.run(publisher(g.store))).published).toBe(false);
        expect(g.queries.length).toBe(count);
    }
});

test("chat orders avatar sequences despite clock rollback and accepts exact retries only", async () => {
    const g = globalFixture();
    expect(await g.store.publish(update)).toBe("applied");
    expect(await g.store.publish(update)).toBe("unchanged");
    const newer = {
        ...update,
        sequence: 6,
        picVer: 2000006,
        committedAt: 1n,
        updatedAt: "0",
        userName: "Newer",
    };
    expect(await g.store.publish(newer)).toBe("applied");
    expect(await g.store.publish(update)).toBe("superseded");
    expect(await g.store.find("1001", 1)).toEqual(newer);
    for (
        const patch of [
            { userName: "different" },
            { platform: "different" },
            { picVer: 6 },
            { committedAt: 2n },
        ]
    )
    {
        await expect(g.store.publish({ ...newer, ...patch })).rejects.toThrow("Conflicting");
    }
    expect(await g.store.find("1001", 1)).toEqual(newer);
    expect(g.queries.filter((q) => /^(insert|update)/.test(q.text))).toHaveLength(2);
});

test("account routing and realm owner checks prevent foreign delivery and reads", async () => {
    for (const route of [null, ["other", "1"], ["1001", "2"], ["1001", "01"]])
    {
        const g = globalFixture();
        g.state.route = route;
        await expect(g.store.publish(update)).rejects.toThrow("owner unavailable");
        expect(g.queries.some((q) => q.text.includes("\"chat_avatar_profile\""))).toBe(false);
    }
    const g = globalFixture();
    await g.store.publish(update);
    g.state.route = ["1001", "2"];
    expect(await g.store.find("1001", 1)).toBeNull();
    for (const profile of [null, ["other", 1], ["1001", 2]])
    {
        const r = realmFixture();
        r.state.profile = profile;
        const receiver = globalFixture();
        expect((await r.run(publisher(receiver.store))).published).toBe(false);
        expect(receiver.queries).toHaveLength(0);
        expect(r.state.entry!.pendingEffects).toBe(7);
    }
});

test("failed chat transactions and lost replies preserve safe retry and durable acknowledgment", async () => {
    for (const failure of ["write", "empty", "commit", "lost"])
    {
        const g = globalFixture(),
            r = realmFixture();
        g.fail(failure);
        await expect(r.run(publisher(g.store))).rejects.toThrow(
            "Avatar profile publication unavailable",
        );
        expect(r.state.entry!.pendingEffects).toBe(7);
        expect(g.state.row).toEqual(failure === "lost" ? values(update) : null);
        g.fail("");
        await r.run(publisher(g.store));
        expect(r.state.entry!.pendingEffects).toBe(3);
        expect(g.state.row).toEqual(values(update));
    }
    for (const failure of ["commit", "lost", "cas"])
    {
        const g = globalFixture(),
            r = realmFixture();
        r.fail(failure);
        await expect(r.run(publisher(g.store))).rejects.toThrow();
        expect(g.state.row).toEqual(values(update));
        expect(r.state.entry!.pendingEffects).toBe(failure === "lost" ? 3 : 7);
        r.fail("");
        await r.run(publisher(g.store));
        expect(r.state.entry!.pendingEffects).toBe(3);
        expect(g.queries.filter((q) => q.text.startsWith("insert"))).toHaveLength(1);
    }
    const g = globalFixture(),
        r = realmFixture();
    await expect(
        r.run(
            publisher(g.store, () => {
                throw new Error("synthetic-private-detail");
            }),
        ),
    ).rejects.not.toThrow("synthetic-private-detail");
    expect(r.state.entry!.pendingEffects).toBe(7);
    expect(g.state.row).toEqual(values(update));
    await r.run(publisher(g.store));
    expect(r.state.entry!.pendingEffects).toBe(3);
});

test("invalid metadata and pending bits reject before publication", async () => {
    for (
        const patch of [
            { owner: "wrong" },
            { kingdomId: 0 },
            { sequence: 0 },
            { sequence: 1000000 },
            { picVer: -1 },
            { picVer: 6 },
            { committedAt: -1n },
            { committedAt: 9007199254740992n },
            { updatedAt: "01792756800" },
            { userName: "\ud800" },
            { platform: "x\0" },
            { userName: "x".repeat(256) },
        ]
    )
    {
        const value = { ...update, ...patch },
            g = globalFixture();
        expect(() => encodeAvatarProfile(value)).toThrow();
        await expect(g.store.publish(value)).rejects.toThrow();
        expect(g.queries).toHaveLength(0);
    }
    const e = entry();
    e.pendingEffects = 4;
    expect(avatarChatUpdate(e, 1)).toEqual(update);
    expect(() => avatarProfileUpdate(e, 1)).toThrow();
    for (const bit of [0, 1, 2, 3, 8, -1])
    {
        expect(() => avatarChatUpdate({ ...e, pendingEffects: bit }, 1)).toThrow();
    }
    const g = globalFixture();
    for (
        const [owner, realm] of [
            ["other", 1],
            ["1001", 0],
            ["1001", 2147483648],
        ] as const
    )
    {
        await expect(g.store.find(owner, realm)).rejects.toThrow();
    }
    expect(g.queries).toHaveLength(0);
});

test("signed internal bodies bind metadata, timestamp and domain without exposing secrets", async () => {
    expect(signChatAvatarProfile("{}", "123", "synthetic-test")).toBe(
        "e30d182ab9b7428a60fb7b0d52f4524c87a1dcb385cbc06d0d73d6a6866d6d13",
    );
    const body = encodeAvatarProfile(update);
    expect(decodeAvatarProfile(body)).toEqual(update);
    expect(
        verifyChatAvatarProfile(body, String(now), auth(body)["x-opencok-signature"], secret, now),
    ).toBe(true);
    for (const difference of [-30001, 30001])
    {
        expect(
            verifyChatAvatarProfile(
                body,
                String(now + difference),
                auth(body, String(now + difference))["x-opencok-signature"],
                secret,
                now,
            ),
        ).toBe(false);
    }
    expect(
        verifyChatAvatarProfile(body, String(now), auth(body)["x-opencok-signature"], "other", now),
    ).toBe(false);
    const g = globalFixture(),
        handler = createChatAvatarProfileHandler({
            profiles: g.store,
            signingSecret: secret,
            now: () => now,
        });
    for (
        const headers of [
            {},
            { ...auth(body), "x-opencok-timestamp": "0" },
            auth(body.replace("synthetic", "forged")),
            { ...auth(body), "x-opencok-signature": "0".repeat(64) },
        ]
    )
    {
        const response = await invoke(handler, body, headers);
        expect(response.status).toBe(403);
        expect(await response.text()).toBe("{\"code\":0,\"data\":{}}");
    }
    expect(g.queries).toHaveLength(0);
});

test("receiver bounds and validates malformed JSON, UTF-8, fields, bodies and deadlines", async () => {
    const g = globalFixture(),
        handler = createChatAvatarProfileHandler({
            profiles: g.store,
            signingSecret: secret,
            now: () => now,
            timeoutMs: 100,
        });
    const body = encodeAvatarProfile(update);
    const object = JSON.parse(body);
    for (
        const malformed of [
            "{",
            "[]",
            "null",
            JSON.stringify({ ...object, committedAt: "01" }),
            JSON.stringify({ ...object, extra: true }),
            JSON.stringify({ ...object, sequence: "5" }),
            JSON.stringify({ ...object, userName: null }),
        ]
    )
    {
        expect((await invoke(handler, malformed, auth(malformed))).status).toBe(400);
    }
    expect((await invoke(handler, Buffer.from([255]), auth(""))).status).toBe(400);
    expect((await invoke(handler, "\ufeff" + body, auth(body))).status).toBe(403);
    expect((await invoke(handler, "\ufeff" + body, auth("\ufeff" + body))).status).toBe(400);
    expect((await invoke(handler, "x".repeat(4097))).status).toBe(413);
    expect((await invoke(handler, body, { "content-length": "4097" })).status).toBe(413);
    expect((await invoke(handler, body, { "content-type": "text/plain" })).status).toBe(415);
    let resume!: () => void;
    const pending = invoke(handler, body, auth(body), {
        async *[Symbol.asyncIterator]()
        {
            await new Promise<void>((resolve) => {
                resume = resolve;
            });
            yield Buffer.from(body);
        },
    });
    expect((await pending).status).toBe(503);
    resume();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(g.queries).toHaveLength(0);
});

test("late receiver results and malformed acknowledgments cannot clear pending work", async () => {
    let release!: () => void;
    const g = globalFixture(),
        r = realmFixture();
    const send = publisher(g.store, async (response) => {
        await new Promise<void>((resolve) => {
            release = resolve;
        });
        return response;
    });
    await expect(r.run(send, 100)).rejects.toThrow();
    expect(r.state.entry!.pendingEffects).toBe(7);
    release();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(r.state.entry!.pendingEffects).toBe(7);
    await r.run(publisher(g.store));
    expect(r.state.entry!.pendingEffects).toBe(3);
    for (
        const value of [
            { code: 0 },
            { code: 1, data: {} },
            { code: 1, data: { owner: "other", kingdomId: 1, sequence: 5, result: "applied" } },
            { code: 1, data: { owner: "1001", kingdomId: 2, sequence: 5, result: "applied" } },
            { code: 1, data: { owner: "1001", kingdomId: 1, sequence: 4, result: "applied" } },
            { code: 1, data: { owner: "1001", kingdomId: 1, sequence: 5, result: "invalid" } },
        ]
    )
    {
        const realm = realmFixture();
        const publish = createChatAvatarProfilePublisher({
            url,
            signingSecret: secret,
            timeoutMs: 1000,
            now: () => now,
            fetch: async () => Response.json(value),
        });
        await expect(realm.run(publish)).rejects.toThrow();
        expect(realm.state.entry!.pendingEffects).toBe(7);
    }
});

test("publisher validates configuration, aborts and malformed or oversized transport responses", async () => {
    for (
        const target of [
            "bad",
            "file:///tmp/profile",
            "http://cok.chat/_internal/avatar-profile",
            url + "?x=1",
            url + "#x",
            url + "/",
            "http://user:pass@chat.internal/_internal/avatar-profile",
        ]
    )
    {
        expect(() =>
            createChatAvatarProfilePublisher({ url: target, signingSecret: secret, timeoutMs: 100 })
        ).toThrow();
    }
    let calls = 0;
    const send = createChatAvatarProfilePublisher({
        url,
        signingSecret: secret,
        timeoutMs: 100,
        now: () => now,
        fetch: async () => {
            calls++;
            return new Promise<Response>(() => {});
        },
    });
    const aborted = new AbortController();
    aborted.abort();
    await expect(send(update, aborted.signal)).rejects.toThrow("Chat avatar profile unavailable");
    expect(calls).toBe(0);
    const active = new AbortController();
    const pending = send(update, active.signal);
    active.abort();
    await expect(pending).rejects.toThrow("Chat avatar profile unavailable");
    expect(calls).toBe(1);
    await expect(send(update, new AbortController().signal)).rejects.toThrow();
    for (
        const response of [
            new Response("{}"),
            new Response("bad", { headers: { "content-type": "application/json" } }),
            new Response("x".repeat(16385), { headers: { "content-type": "application/json" } }),
            new Response("{}", { status: 503, headers: { "content-type": "application/json" } }),
        ]
    )
    {
        const send = createChatAvatarProfilePublisher({
            url,
            signingSecret: secret,
            timeoutMs: 100,
            now: () => now,
            fetch: async () => response,
        });
        await expect(send(update, new AbortController().signal)).rejects.toThrow(
            "Chat avatar profile unavailable",
        );
    }
});

test("the internal route is exact and remains distinct from public discovery routes", () => {
    let calls = 0;
    const handler = createChatHttpHandler({
        profileHandler: async () => {
            calls++;
        },
    });
    for (
        const [method, path, expected] of [
            ["POST", chatAvatarProfilePath, 0],
            ["GET", chatAvatarProfilePath, 404],
            ["POST", chatAvatarProfilePath + "?x=1", 404],
            ["POST", chatAvatarProfilePath + "/", 404],
        ] as const
    )
    {
        let status = 0;
        handler(
            { method, url: path } as IncomingMessage,
            {
                setHeader()
                {},
                once()
                {},
                writeHead(code: number)
                {
                    status = code;
                },
                end()
                {},
            } as unknown as ServerResponse,
        );
        expect(status).toBe(expected);
    }
    expect(calls).toBe(1);
});

test("receiver storage deadline returns one failure while an uncertain commit stays retryable", async () => {
    const g = globalFixture();
    let release!: () => void;
    const handler = createChatAvatarProfileHandler({
        signingSecret: secret,
        now: () => now,
        timeoutMs: 100,
        profiles: {
            ...g.store,
            publish: async (value) => {
                const result = await g.store.publish(value);
                await new Promise<void>((resolve) => {
                    release = resolve;
                });
                return result;
            },
        },
    });
    const body = encodeAvatarProfile(update);
    const response = await invoke(handler, body, auth(body));
    expect(response.status).toBe(503);
    expect(g.state.row).toEqual(values(update));
    release();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(await g.store.publish(update)).toBe("unchanged");
    expect(g.queries.filter((q) => q.text.startsWith("insert"))).toHaveLength(1);
});
