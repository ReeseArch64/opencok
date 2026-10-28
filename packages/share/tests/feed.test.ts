import { expect, test } from "bun:test";
import { ShareFeedService } from "../src/services/feed";
import { ShareFeedPolicy } from "../src/rules/feed";
import { ShareFeedMapper } from "../src/mappings/feed";
import type {
    ShareFeed,
    ShareFeedActor,
    ShareFeedOperation,
    ShareFeedTransaction,
} from "../src/contracts/feed";

const now = 9007199254740993n;
const actor: ShareFeedActor = {
    serverId: 1,
    allianceId: "guild",
    membershipAllianceId: "guild",
};
const runtime = {
    randomUUID: () => "12345678-1234-1234-1234-123456789012",
    fail(code: string): never
    {
        throw new Error(code);
    },
};

function operation(change: Partial<ShareFeedOperation> = {}): ShareFeedOperation
{
    return {
        owner: "alice",
        command: "chat.feed.send",
        body: "Battle Ω",
        ids: [],
        feedId: "",
        feedType: 7,
        feedData: "{\"battle\":\"synthetic\"}",
        feedAuth: "alliance",
        notices: [],
        localId: "local-1",
        ...change,
    };
}

function record(change: Partial<ShareFeed> = {}): ShareFeed
{
    return {
        id: "root",
        owner: "bob",
        realm: 1,
        alliance: "guild",
        parent: null,
        type: 7,
        body: { id: "root" },
        createdAt: now,
        expiresAt: now + 2_592_000_000n,
        deletedAt: null,
        ...change,
    };
}

function fixture(change: Partial<ShareFeedTransaction> = {})
{
    const calls: unknown[][] = [];
    const written: ShareFeed[] = [];
    const tx: ShareFeedTransaction = {
        now,
        actor,
        players: new Map(),
        blocked: async (first, second) => {
            calls.push(["blocked", first, second]);

            return second === "blocked";
        },
        feed: async (id) => {
            calls.push(["feed", id]);

            return record();
        },
        feeds: async (owner, realm, alliance) => {
            calls.push(["feeds", owner, realm, alliance]);

            return [];
        },
        putFeed: async (row) => {
            calls.push(["put", row.id]);
            written.push(row);
        },
        removeFeed: async (id) => {
            calls.push(["remove", id]);
        },
        feedNotice: async (owner, id) => {
            calls.push(["notice", owner, id]);
        },
        removeFeedNotices: async (owner, ids) => {
            calls.push(["ack", owner, ids]);
        },
        event: async (owner, command, data, target, room) => {
            calls.push(["event", owner, command, data, target, room]);
        },
        ...change,
    };
    const service = new ShareFeedService(
        runtime,
        new ShareFeedPolicy(runtime),
        new ShareFeedMapper(),
    );

    return { service, tx, calls, written };
}

test("feed envelopes retain alias precedence, defaults, notice order and native field order", () => {
    const mapper = new ShareFeedMapper();
    expect(mapper.normalizeEnvelope({})).toEqual({
        feedId: "",
        feedType: 0,
        feedData: "",
        feedAuth: "self",
        notices: [],
        localId: "",
    });
    expect(mapper.normalizeEnvelope({
        fid: "",
        id: "fallback",
        type: 101,
        data: "payload",
        auth: "alliance",
        notices: "bob,,alice,bob,",
        localid: "native",
    })).toEqual({
        feedId: "",
        feedType: 101,
        feedData: "payload",
        feedAuth: "alliance",
        notices: ["bob", "alice", "bob"],
        localId: "native",
    });
    expect(mapper.normalizeEnvelope({ id: "fallback" }).feedId).toBe("fallback");
    const body = mapper.feedBody("id", now, operation(), null, "");
    expect(Object.keys(body)).toEqual([
        "id",
        "time",
        "type",
        "msg",
        "data",
        "sender",
        "fid",
        "status",
        "authority",
    ]);
    expect(body).toEqual({
        id: "id",
        time: Number(now),
        type: 7,
        msg: "Battle Ω",
        data: "{\"battle\":\"synthetic\"}",
        sender: "alice",
        fid: "",
        status: 1,
        authority: { owner: "alice" },
    });
    expect(mapper.sent("id", "")).toEqual({ id: "id" });
    expect(mapper.sent("id", "native")).toEqual({ id: "id", localid: "native" });
});

test("alliance sharing persists once before ordered notices and preserves cross-realm notice eligibility", async () => {
    const h = fixture({
        players: new Map([
            ["bob", actor],
            ["blocked", actor],
            ["stale", { ...actor, membershipAllianceId: "old" }],
            ["outsider", { ...actor, allianceId: "other", membershipAllianceId: "other" }],
            ["remote", { ...actor, serverId: 2 }],
            ["absent", null],
        ]),
    });
    const result = await h.service.execute(
        operation({
            notices: ["bob", "bob", "blocked", "stale", "outsider", "remote", "absent"],
        }),
        h.tx,
    );
    const id = `alice${now}12345678`;
    expect(result).toEqual({ id, localid: "local-1" });
    expect(h.written).toHaveLength(1);
    expect(h.written[0]).toMatchObject({
        id,
        owner: "alice",
        realm: 1,
        alliance: "guild",
        parent: null,
        type: 7,
        createdAt: now,
        expiresAt: now + 2_592_000_000n,
        deletedAt: null,
        body: { authority: { alliance: "guild" } },
    });
    expect(h.calls).toEqual([
        ["put", id],
        ["blocked", "alice", "bob"],
        ["notice", "bob", id],
        ["event", "alice", "push.chat.feed.notice", { id }, "bob", ""],
        ["blocked", "alice", "blocked"],
        ["blocked", "alice", "remote"],
        ["notice", "remote", id],
        ["event", "alice", "push.chat.feed.notice", { id }, "remote", ""],
    ]);
});

test("message and alliance validation reject before parent reads or writes", async () => {
    for (
        const input of [
            operation({ body: "" }),
            operation({ body: "", feedType: 102 }),
            operation({ notices: ["invalid uid"] }),
            operation({ notices: Array.from({ length: 51 }, () => "bob") }),
        ]
    )
    {
        const h = fixture();
        await expect(h.service.execute(input, h.tx)).rejects.toThrow("invalid_message");
        expect(h.calls).toEqual([]);
    }

    const stale = fixture({ actor: { ...actor, membershipAllianceId: "old" } });
    await expect(stale.service.execute(operation(), stale.tx)).rejects.toThrow("invalid_room");
    expect(stale.calls).toEqual([]);
    await stale.service.execute(operation({ feedAuth: "self", notices: ["bob"] }), stale.tx);
    expect(stale.written[0]?.alliance).toBe("");
    expect(stale.calls).toEqual([["put", `alice${now}12345678`]]);
});

test("types 101 and 102 bind only accessible root feeds while owner access survives realm changes", async () => {
    for (const feedType of [101, 102])
    {
        const h = fixture();
        await h.service.execute(
            operation({ feedType, feedId: "root", body: feedType === 101 ? "" : "reply" }),
            h.tx,
        );
        expect(h.written[0]?.parent).toBe("root");
        expect(h.written[0]?.body).toMatchObject({ fid: "root", type: feedType });
    }

    for (
        const original of [
            null,
            record({ parent: "other" }),
            record({ realm: 2 }),
            record({ alliance: "" }),
        ]
    )
    {
        const h = fixture({ feed: async () => original });
        await expect(
            h.service.execute(operation({ feedType: 101, feedId: "root", body: "" }), h.tx),
        )
            .rejects.toThrow("feed_permission_denied");
        expect(h.written).toEqual([]);
    }

    const own = fixture({ feed: async () => record({ owner: "alice", realm: 99, alliance: "" }) });
    await own.service.execute(operation({ feedType: 101, feedId: "root", body: "" }), own.tx);
    expect(own.written[0]?.parent).toBe("root");
});

test("deletion requires ownership or both truthy GM and moderation permission", async () => {
    for (
        const [gmFlag, moderationAllowed, allowed] of [
            [-1, true, true],
            [1, true, true],
            [0, true, false],
            [1, false, false],
        ] as const
    )
    {
        const h = fixture({ actor: { ...actor, gmFlag, moderationAllowed } });
        const input = operation({ command: "chat.feed.del", feedId: "root" });

        if (allowed)
        {
            expect(await h.service.execute(input, h.tx)).toEqual({});
            expect(h.calls).toEqual([["feed", "root"], ["remove", "root"]]);
        }
        else
        {
            await expect(h.service.execute(input, h.tx)).rejects.toThrow("feed_permission_denied");
            expect(h.calls).toEqual([["feed", "root"]]);
        }
    }

    const missing = fixture({
        feed: async () => null,
        actor: { ...actor, gmFlag: 10, moderationAllowed: true },
    });
    await expect(missing.service.execute(operation({ command: "chat.feed.del" }), missing.tx))
        .rejects.toThrow("feed_permission_denied");
});

test("feed reads preserve owner access, realm and current membership checks before block filtering", async () => {
    const rows = [
        record({ id: "own", owner: "alice", realm: 2, alliance: "", body: { id: "own" } }),
        record({ id: "visible", body: { id: "visible" } }),
        record({ id: "remote", realm: 2, body: { id: "remote" } }),
        record({ id: "blocked", owner: "blocked", body: { id: "blocked" } }),
    ];
    const selections: unknown[][] = [];
    const h = fixture({
        feeds: async (...args) => {
            selections.push(args);

            return rows;
        },
    });
    expect(await h.service.execute(operation({ command: "chat.feed.get" }), h.tx))
        .toEqual({ feed: [{ id: "own" }, { id: "visible" }] });
    expect(selections).toEqual([["alice", 1, "guild"]]);
    expect(h.calls).toEqual([
        ["blocked", "alice", "alice"],
        ["blocked", "alice", "bob"],
        ["blocked", "alice", "blocked"],
    ]);
    h.tx.actor = { ...actor, membershipAllianceId: "old" };
    expect(await h.service.execute(operation({ command: "chat.feed.get" }), h.tx)).toEqual({
        feed: [{ id: "own" }],
    });
    expect(selections.at(-1)).toEqual(["alice", 1, ""]);
});

test("notice acknowledgment keeps the actor and selected IDs and the planner handles only feed commands", async () => {
    const h = fixture();
    expect(
        await h.service.execute(
            operation({ command: "chat.feed.notice.del", ids: ["a", "a", "b"] }),
            h.tx,
        ),
    )
        .toEqual({});
    expect(h.calls).toEqual([["ack", "alice", ["a", "a", "b"]]]);

    for (
        const command of [
            "chat.feed.send",
            "chat.feed.del",
            "chat.feed.notice.del",
            "chat.feed.get",
        ]
    )
    {
        expect(h.service.handles(command)).toBe(true);
    }

    expect(h.service.handles("push.chat.feed.notice")).toBe(false);
    expect(h.service.handles("chat.room.send")).toBe(false);
    await expect(h.service.execute(operation({ command: "chat.room.send" }), h.tx)).rejects.toThrow(
        "unsupported_command",
    );
});
