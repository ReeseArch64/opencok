import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import type { MailConversationReadQuery } from "@opencok/contracts/mail";
import { markMailConversationRead } from "@opencok/repositories/mail-conversation-read";
import { mailConversationReadQuery } from "@opencok/rules/mail-conversation-read";

const now = 1792756800000;
type Message = {
    owner: string;
    from: string | null;
    type: number;
    status: number | null;
    saved: number;
    reward: number;
    contents: string;
};
type Intent = typeof schema.mail_chat_read_intent.$inferSelect;
function database(
    options: {
        profile?: unknown[] | null;
        fail?: string;
        count?: unknown;
        beforeProfile?: () => void;
    } = {},
)
{
    const queries: { text: string; params: unknown[]; }[] = [];
    let rows: Message[] = ["self", "other"].flatMap((owner) =>
        ["sender", "elsewhere", "", "null", null].flatMap((from) =>
            [2, 7, 10, 12, 14, 20, 21, 22, 23, 24, 28, 37, 38, 39, 40, 43, 44, 45, 46].flatMap((
                type,
            ) => [null, -1, 0, 1, 2].map((status) => ({
                owner,
                from,
                type,
                status,
                saved: 2,
                reward: 0,
                contents: "synthetic",
            })))
        )
    );
    let intents: Intent[] = [];
    let before: { rows: Message[]; intents: Intent[]; };
    const client = {
        query: async (statement: { text: string; }, params: unknown[] = []) => {
            const text = statement.text;
            queries.push({ text, params });
            if (text.startsWith("begin"))
            {
                before = structuredClone({ rows, intents });
            }
            if (text === "rollback")
            {
                ({ rows, intents } = before);
            }
            if (text.includes("from \"opencok_kingdom\".\"userprofile\""))
            {
                options.beforeProfile?.();
                if (options.fail === "profile")
                {
                    throw new Error("Synthetic profile failure");
                }
                return {
                    rows: options.profile === null ? [] : [options.profile ?? ["self", 1, "0", 0]],
                };
            }
            if (text.includes("from \"opencok_kingdom\".\"mail_chat_read_intent\""))
            {
                if (options.fail === "count")
                {
                    throw new Error("Synthetic count failure");
                }
                expect(text).toBe(
                    "select count(*)::text from \"opencok_kingdom\".\"mail_chat_read_intent\" where \"opencok_kingdom\".\"mail_chat_read_intent\".\"ownerUid\" = $1",
                );
                return {
                    rows: [
                        [
                            options.count
                                ?? String(
                                    intents.filter((entry) => entry.ownerUid === params[0]).length,
                                ),
                        ],
                    ],
                };
            }
            if (text.startsWith("update \"opencok_kingdom\".\"mail\""))
            {
                if (options.fail === "update")
                {
                    throw new Error("Synthetic update failure");
                }
                const parameter = (reference: string) => params[Number(reference.slice(1)) - 1];
                const owner = text.match(/"mail"\."toUser" = (\$\d+)/)![1]!;
                const alternatives = text
                    .split(" where ")[1]!
                    .split(" or ")
                    .map((part) => {
                        const types = part.match(/"mail"\."type" (?:in \(([^)]+)\)|= (\$\d+))/)!;
                        const sender = part.match(/"mail"\."fromUser" = (\$\d+)/);
                        const status = part.match(/"mail"\."status" = (\$\d+)/);
                        return {
                            types: (types[1] ?? types[2])!.split(", ").map(parameter),
                            sender: sender ? parameter(sender[1]!) : undefined,
                            status: status ? parameter(status[1]!) : undefined,
                        };
                    });
                expect(text).not.toMatch(/coalesce|is null|returning|limit|rewardStatus|saveFlag/);
                for (const row of rows)
                {
                    if (
                        row.owner === parameter(owner)
                        && alternatives.some(
                            (selection) =>
                                selection.types.includes(row.type)
                                && (selection.sender === undefined
                                    || (selection.sender !== null && row.from === selection.sender))
                                && (selection.status === undefined
                                    || row.status === selection.status),
                        )
                    )
                    {
                        row.status = params[0] as number;
                    }
                }
            }
            if (text.startsWith("insert into \"opencok_kingdom\".\"mail_chat_read_intent\""))
            {
                expect(text).not.toMatch(/on conflict|returning/);
                expect(text).toContain(
                    "(\"commandId\", \"effectIndex\", \"ownerUid\", \"others\", \"chatTypes\", \"requestedAt\", \"action\")",
                );
                for (let index = 0; index < params.length; index += 6)
                {
                    const [commandId, effectIndex, ownerUid, others, chatTypes, requestedAt] =
                        params.slice(
                            index,
                            index + 6,
                        );
                    expect(
                        intents.some(
                            (entry) =>
                                entry.commandId === commandId && entry.effectIndex === effectIndex,
                        ),
                    ).toBe(false);
                    intents.push({
                        commandId: commandId as string,
                        effectIndex: effectIndex as number,
                        ownerUid: ownerUid as string,
                        action: "read",
                        others: others as string,
                        chatTypes: chatTypes as string,
                        requestedAt: BigInt(requestedAt as string),
                    });
                }
                if (options.fail === "insert")
                {
                    throw new Error("Synthetic insert failure");
                }
            }
            if (text === "commit" && options.fail === "commit")
            {
                throw new Error("Synthetic commit failure");
            }
            return { rows: [] };
        },
    };
    return {
        db: drizzle(client as unknown as NodePgClient, { schema }),
        queries,
        rows: () => rows,
        intents: () => intents,
    };
}

const plan = (input: Parameters<typeof mailConversationReadQuery>[0]) =>
    mailConversationReadQuery(input, now);
const run = (fixture: ReturnType<typeof database>, query: MailConversationReadQuery) =>
    markMailConversationRead(fixture.db, 1, "self", query);

test("conversation reads preserve exact unread status, sender, owner and subtype predicates", async () => {
    for (const mode of ["personal", "moderator", "bottle"] as const)
    {
        const fixture = database();
        const before = structuredClone(fixture.rows());
        const query = plan({
            fromUser: "sender",
            mod: mode === "moderator" ? 1 : 0,
            driftingBottle: mode === "personal" ? 0 : 1,
        });
        await run(fixture, query);
        const types = mode === "moderator" ? [23, 24] : mode === "bottle" ? [43, 44] : [20, 21, 22];
        expect(fixture.rows()).toEqual(
            before.map((row) => ({
                ...row,
                status: row.owner === "self"
                        && row.from === "sender"
                        && types.includes(row.type)
                        && (mode === "bottle" || row.status === 0)
                    ? 1
                    : row.status,
            })),
        );
        expect(fixture.intents()).toEqual([
            {
                commandId: expect.any(String),
                effectIndex: 1,
                ownerUid: "self",
                action: "read",
                others: "sender",
                chatTypes: mode === "moderator" ? "2" : mode === "bottle" ? "3" : "1,20",
                requestedAt: BigInt(now),
            },
        ]);
        expect(fixture.queries.map((entry) => entry.text.split(" ")[0])).toEqual([
            "begin",
            "select",
            "select",
            "update",
            "insert",
            "commit",
        ]);
        expect(fixture.queries[0]!.text).toBe("begin isolation level read committed read write");
        expect(fixture.queries[1]!.text).toEndWith("limit $2 for update");
        expect(fixture.queries[1]!.params).toEqual(["self", 1]);
        expect(fixture.queries.map((entry) => entry.text).join("\n")).not.toMatch(
            /mail_update|mail_group|mail_gift|mail_extra|contents|rewardId|delete /,
        );
    }
});

test("combined selectors update the union once and preserve ordered durable chat identities", async () => {
    const fixture = database();
    const before = structuredClone(fixture.rows());
    await run(fixture, plan({ fromUser: "sender", mod: 1, types: "0,1,20" }));
    expect(fixture.rows()).toEqual(
        before.map((row) => ({
            ...row,
            status: row.owner === "self"
                    && row.status === 0
                    && ([20, 21, 22].includes(row.type)
                        || (row.from === "sender" && [23, 24].includes(row.type)))
                ? 1
                : row.status,
        })),
    );
    const events = fixture.intents();
    expect(events).toHaveLength(2);
    expect(
        events.map(({ effectIndex, others, chatTypes }) => ({ effectIndex, others, chatTypes })),
    ).toEqual([
        { effectIndex: 1, others: "sender", chatTypes: "2" },
        { effectIndex: 5, others: "", chatTypes: "1,20" },
    ]);
    expect(events[0]!.commandId).toMatch(
        /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/,
    );
    expect(events[0]!.commandId).toBe(events[1]!.commandId);
    const updates = fixture.queries.filter(({ text }) => text.startsWith("update"));
    expect(updates).toHaveLength(1);
    expect(updates[0]!.params).toEqual([1, "self", 23, 24, "sender", 0, 21, 0, 22, 0, 20, 0]);
});

test("type-only reads map all senders, keep duplicate tokens and avoid chat backlog admission", async () => {
    const fixture = database({ count: "1000" });
    const before = structuredClone(fixture.rows());
    await run(fixture, plan({ type: 14, types: "4,4,21" }));
    expect(fixture.rows()).toEqual(
        before.map((row) => ({
            ...row,
            status: row.owner === "self" && row.status === 0 && [7, 10, 12].includes(row.type)
                ? 1
                : row.status,
        })),
    );
    expect(fixture.intents()).toEqual([]);
    expect(fixture.queries).toHaveLength(4);
    expect(fixture.queries[2]!.params).toEqual([1, "self", 12, 0, 7, 0, 7, 0, 10, 0]);
});

test("null SQL sender matches nothing while empty and raw peer values survive in chat intents", async () => {
    for (const sender of [null, "", " ", "a,b", "missing"])
    {
        const fixture = database();
        const before = structuredClone(fixture.rows());
        await run(fixture, plan({ fromUser: sender }));
        expect(fixture.rows()).toEqual(
            before.map((row) => ({
                ...row,
                status: sender !== null
                        && row.owner === "self"
                        && row.from === sender
                        && row.status === 0
                        && [20, 21, 22].includes(row.type)
                    ? 1
                    : row.status,
            })),
        );
        expect(fixture.intents()[0]!.others).toBe(sender === null ? "null" : sender);
    }
});

test("repeated read requests create distinct durable events even when mailbox rows no longer change", async () => {
    const fixture = database();
    const query = plan({ fromUser: "sender" });
    await run(fixture, query);
    const after = structuredClone(fixture.rows());
    const first = structuredClone(fixture.intents()[0]!);
    await run(fixture, query);
    expect(fixture.rows()).toEqual(after);
    expect(fixture.intents()).toHaveLength(2);
    expect(fixture.intents()[0]).toEqual(first);
    expect(fixture.intents()[1]!.commandId).not.toBe(first.commandId);
    expect({ ...fixture.intents()[1], commandId: first.commandId }).toEqual(first);
});

test("conversation reads update large selections without fetching bodies or truncating affected rows", async () => {
    const fixture = database();
    fixture.rows().push(
        ...Array.from({ length: 1500 }, () => ({
            owner: "self",
            from: "large",
            type: 21,
            status: 0,
            saved: 2,
            reward: 0,
            contents: "synthetic",
        })),
    );
    await run(fixture, plan({ fromUser: "large" }));
    expect(fixture.rows().filter((row) => row.from === "large" && row.status === 1)).toHaveLength(
        1500,
    );
    expect(fixture.queries.filter(({ text }) => text.startsWith("update"))).toHaveLength(1);
    expect(
        fixture.queries.some(({ text }) => text.startsWith("select") && text.includes("\"mail\"")),
    ).toBe(false);
});

test("backlog admission is owner scoped and rejects before mailbox writes at capacity", async () => {
    const fixture = database();
    fixture.intents().push(
        ...Array.from({ length: 1000 }, (_, effectIndex) => ({
            commandId: "00000000-0000-4000-8000-000000000001",
            effectIndex,
            ownerUid: "other",
            action: "read",
            others: "",
            chatTypes: "1,20",
            requestedAt: 0n,
        })),
    );
    await run(fixture, plan({ fromUser: "sender" }));
    expect(fixture.intents()).toHaveLength(1001);
    const last = database({ count: "999" });
    await run(last, plan({ fromUser: "sender" }));
    expect(last.intents()).toHaveLength(1);
    for (
        const [count, query] of [
            ["999", plan({ fromUser: "sender", types: "0,1,20" })],
            ["1000", plan({ fromUser: "sender" })],
            ["9007199254740993", plan({ types: "0,1,20" })],
            ["-1", plan({ fromUser: "sender" })],
            ["01", plan({ fromUser: "sender" })],
            ["1.5", plan({ fromUser: "sender" })],
            ["invalid", plan({ fromUser: "sender" })],
        ] as const
    )
    {
        const full = database({ count });
        const before = structuredClone(full.rows());
        await expect(run(full, query)).rejects.toThrow();
        expect(full.rows()).toEqual(before);
        expect(full.intents()).toEqual([]);
        expect(full.queries.some(({ text }) => /^(update|insert)/.test(text))).toBe(false);
        expect(full.queries.at(-1)!.text).toBe("rollback");
    }
});

test("missing, foreign, banned and misplaced owners cannot modify mail or enqueue events", async () => {
    for (
        const profile of [
            null,
            ["other", 1, "0", 0],
            ["self", 2, "0", 0],
            ["self", 1, "0", 1],
            ["self", 1, String(now + 1), 0],
        ]
    )
    {
        const fixture = database({ profile });
        const before = structuredClone(fixture.rows());
        await run(fixture, plan({ fromUser: "sender" }));
        expect(fixture.rows()).toEqual(before);
        expect(fixture.intents()).toEqual([]);
        expect(fixture.queries).toHaveLength(3);
    }
    const empty = database();
    await run(empty, plan({}));
    expect(empty.queries).toHaveLength(3);
    const boundary = database({ profile: ["self", 1, String(now), 0] });
    await run(boundary, plan({ fromUser: "sender" }));
    expect(boundary.intents()).toHaveLength(1);
});

test("transaction failures roll back both read assignments and durable intents", async () => {
    for (const fail of ["profile", "count", "update", "insert", "commit"])
    {
        const fixture = database({ fail });
        const before = structuredClone(fixture.rows());
        await expect(run(fixture, plan({ fromUser: "sender", types: "0,1,20" }))).rejects.toThrow();
        expect(fixture.rows()).toEqual(before);
        expect(fixture.intents()).toEqual([]);
        expect(fixture.queries.at(-1)!.text).toBe("rollback");
    }
});

test("validated query values cannot change while the transaction awaits its owner lock", async () => {
    const query = plan({ fromUser: "sender" });
    const fixture = database({
        beforeProfile: () => {
            const assignment = query.effects[0]!;
            if (assignment.kind === "mail")
            {
                assignment.fromUser = "elsewhere";
                (assignment.types as number[])[0] = 28;
            }
            const intent = query.effects[1]!;
            if (intent.kind === "chat")
            {
                intent.others = "elsewhere";
                (intent.types as string[])[0] = "2";
            }
            query.now = 0;
        },
    });
    await run(fixture, query);
    expect(fixture.queries.find(({ text }) => text.startsWith("update"))!.params).toEqual([
        1,
        "self",
        20,
        21,
        22,
        "sender",
        0,
    ]);
    expect(fixture.intents()[0]).toMatchObject({
        others: "sender",
        chatTypes: "1,20",
        requestedAt: BigInt(now),
    });
});

test("invalid plans reject before database work even when called directly", () => {
    const fixture = database();
    const query = plan({ fromUser: "sender" });
    for (const owner of ["", " ", "\0", "\ud800", "x".repeat(41)])
    {
        expect(() => markMailConversationRead(fixture.db, 1, owner, query)).toThrow();
    }
    for (const realm of [0, 1.5, 2147483648])
    {
        expect(() => markMailConversationRead(fixture.db, realm, "self", query)).toThrow();
    }
    for (const time of [-1, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])
    {
        expect(() => run(fixture, { ...query, now: time })).toThrow();
    }
    for (
        const effects of [
            null,
            [null],
            Array.from({ length: 1003 }, () => query.effects[0]),
            [{ kind: "other", types: [20] }],
            [{ kind: "mail", types: [20], unreadOnly: false }],
            [{ kind: "mail", types: [NaN], unreadOnly: true }],
            [{ kind: "mail", types: [2147483648], unreadOnly: true }],
            [{ kind: "mail", types: [], unreadOnly: true }],
            [{ kind: "mail", types: [20, 21, 22], fromUser: "\0", unreadOnly: true }],
            [{ kind: "mail", types: [20, 21, 22], fromUser: "sender", unreadOnly: false }],
            [{ kind: "mail", types: [43, 44], fromUser: "sender", unreadOnly: true }],
            [{ kind: "chat", types: ["1,20"], others: "sender" }],
            [{ kind: "chat", types: ["20", "1"], others: "sender" }],
            [{ kind: "chat", types: [2], others: "sender" }],
            [{ kind: "chat", types: ["2"], others: "x".repeat(41) }],
            Array.from({ length: 3 }, () => query.effects[1]),
        ]
    )
    {
        expect(() => run(fixture, { now, effects } as MailConversationReadQuery)).toThrow();
    }
    expect(fixture.queries).toEqual([]);
});
