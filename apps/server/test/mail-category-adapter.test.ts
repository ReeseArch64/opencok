import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import * as globalSchema from "@opencok/drizzle/schema/global";
import { readMailCategory } from "@opencok/repositories/mail-category";
import { Database } from "@opencok/repositories/game";
import { createRealmGameService } from "../src/composition/game";
import { Rules } from "@opencok/rules/game";
import { mailCategoryProjection } from "@opencok/services/mail-category";
import type { MailCategoryQuery, MailListEntry } from "@opencok/contracts/mail";
import { fields, sfs, type Value } from "@opencok/messages/sfs";
import { mailCategoryNow as now, mailListEntry } from "./fixtures/mail-category.ts";

const query = (category = 3, begin = 0, offset = 10): MailCategoryQuery => ({
    category,
    begin,
    offset,
    now,
});
const columns = [
    "uid",
    "toUser",
    "fromUser",
    "fromName",
    "title",
    "rewardId",
    "rewardStatus",
    "status",
    "itemIdFlag",
    "saveFlag",
    "reply",
    "translationId",
    "type",
    "createTime",
    "contents",
    "extra",
] as const;
function fixture(
    options: {
        profile?: unknown[] | null;
        fail?: string;
        size?: number;
        bodyMismatch?: boolean;
    } = {},
)
{
    let rows = [
        mailListEntry({
            uid: "other",
            toUser: "foreign",
            type: 32,
            createTime: 20n,
            contents: Buffer.from("secret"),
        }),
        mailListEntry({ uid: "newest", type: 2, createTime: 10n }),
        mailListEntry({ uid: "bad", type: 32, createTime: 9n, contents: Buffer.from("broken") }),
        mailListEntry({
            uid: "good",
            type: 32,
            createTime: 8n,
            contents: Buffer.from("extra"),
            extra: Buffer.from("{n:9223372036854775807}"),
        }),
        mailListEntry({ uid: "tie", type: 32, createTime: 8n, contents: Buffer.from("{n:2}") }),
    ].map((row) => ({ ...row, extraOwner: "self" as string | null }));
    let before = rows;
    const calls: { text: string; params: unknown[]; }[] = [];
    const client = {
        query: async (statement: { text: string; }, params: unknown[] = []) => {
            const text = statement.text;
            calls.push({ text, params });
            const fail = (name: string) => {
                if (name === options.fail)
                {
                    throw new Error("Synthetic " + name + " failure");
                }
            };
            if (text.startsWith("begin"))
            {
                before = rows.map((row) => ({ ...row }));
            }
            if (text === "rollback")
            {
                rows = before;
            }
            if (text.includes("from \"opencok_kingdom\".\"translationv2\""))
            {
                const contents = Buffer.from("traduzido");
                return {
                    rows: [[
                        "translation",
                        text.includes("octet_length") ? contents.length : contents,
                    ]],
                };
            }
            if (
                text.includes("from \"opencok_kingdom\".\"userprofile\"")
                && text.includes("\"name\"")
            )
            {
                return { rows: [["sender", 1, "Current", "portrait", 2, "pt", "TAG"]] };
            }
            if (text.includes("from \"opencok_kingdom\".\"userprofile\""))
            {
                fail("profile");
                return {
                    rows: options.profile === null ? [] : [options.profile ?? ["self", 1, "0", 0]],
                };
            }
            if (text.startsWith("select") && text.includes("from \"opencok_kingdom\".\"mail\""))
            {
                const [extraOwner, _blank, owner, ...rest] = params;
                const selected = rows
                    .filter((row) => row.toUser === owner)
                    .sort((a, b) =>
                        a.createTime !== b.createTime
                            ? a.createTime > b.createTime
                                ? -1
                                : 1
                            : a.uid < b.uid
                            ? -1
                            : 1
                    );
                const extra = (row: (typeof rows)[number]) =>
                    row.extraOwner === extraOwner || row.extraOwner === ""
                        || row.extraOwner === null
                        ? row.extra
                        : null;
                if (text.includes("octet_length"))
                {
                    fail("metadata");
                    return {
                        rows: selected
                            .slice(0, Number(rest[0]))
                            .map((row) => [
                                row.uid,
                                options.size
                                    ?? (row.contents?.length ?? 0)
                                        + (extra(row)?.length ?? 0)
                                        + Buffer.byteLength(row.rewardId ?? ""),
                            ]),
                    };
                }
                fail("bodies");
                return {
                    rows: selected
                        .filter((row) => rest.includes(row.uid))
                        .map((row) =>
                            columns.map((column) =>
                                column === "createTime"
                                    ? String(row.createTime)
                                    : column === "rewardId"
                                    ? row.rewardId === null
                                        ? null
                                        : Buffer.from(row.rewardId)
                                    : column === "extra"
                                    ? extra(row)
                                    : column === "uid" && options.bodyMismatch
                                    ? "wrong"
                                    : row[column]
                            )
                        ),
                };
            }
            if (text.startsWith("delete from \"opencok_kingdom\".\"mail\""))
            {
                fail("delete");
                const [owner, ...ids] = params;
                rows = rows.filter((row) => row.toUser !== owner || !ids.includes(row.uid));
            }
            if (text === "commit")
            {
                fail("commit");
            }
            return { rows: [] };
        },
    };
    const db = drizzle(client as unknown as NodePgClient, { schema });
    const globalClient = { query: async () => ({ rows: [["sender", "1"]] }) };
    const databases = {
        getKingdom: () => ({ db }),
        kingdoms: new Map([[1, { db }]]),
        global: { db: drizzle(globalClient as unknown as NodePgClient, { schema: globalSchema }) },
    } as unknown as Parameters<typeof readMailCategory>[0];
    return { db, databases, calls, rows: () => rows };
}
const inspect = (q: MailCategoryQuery) => async (entries: readonly MailListEntry[]) =>
    mailCategoryProjection("self", q, entries, {
        senders: new Map(),
        translations: new Map(),
        recipientUpdateTime: "",
        translationEnabled: true,
    }).invalidIds;

test("category snapshot windows all owned mail before filtering and removes only projected malformed primary rows", async () => {
    const f = fixture();
    const before = f.rows().map((row) => ({ ...row }));
    let ids: string[] = [];
    await readMailCategory(f.databases, 1, "self", query(3, 0, 3), async (entries) => {
        ids = entries.map((row) => row.uid);
        expect(entries[2]!.extra).toEqual(Buffer.from("{n:9223372036854775807}"));
        return inspect(query(3, 0, 3))(entries);
    });
    expect(ids).toEqual(["newest", "bad", "good"]);
    expect(f.rows()).toEqual(before.filter((row) => row.uid !== "bad"));
    expect(f.calls.map((call) => call.text.split(" ")[0])).toEqual([
        "begin",
        "select",
        "select",
        "select",
        "delete",
        "commit",
    ]);
    expect(f.calls[0]!.text).toBe("begin isolation level repeatable read read write");
    expect(f.calls[1]!.text).toEndWith("limit $2 for update");
    const metadata = f.calls[2]!;
    expect(metadata.params).toEqual(["self", "", "self", 3]);
    expect(metadata.text).toContain(
        "order by \"selected_mail\".\"createTime\" desc, \"selected_mail\".\"uid\" collate \"C\" asc",
    );
    expect(metadata.text).toContain("for update of \"selected_mail\"");
    expect(metadata.text).not.toContain("\"type\"");
    expect(metadata.text).toContain("\"mail_contents\".\"toUser\" is null");
    expect(f.calls[3]!.params).toEqual(["self", "", "self", "newest", "bad", "good"]);
    expect(f.calls[4]!.params).toEqual(["self", "bad"]);
    expect(f.calls[4]!.text).toContain("\"mail\".\"toUser\" = $1");
    expect(f.calls.map((call) => call.text).join("\n")).not.toMatch(
        /mail_update|mail_group|gift|insert into|update "|delete from "opencok_kingdom"\."mail_contents"/,
    );
});

test("category repository handles signed windows, invalid categories and snapshot authorization without body reads", async () => {
    for (
        const q of [
            query(0),
            query(9),
            query(1, 1, 10),
            query(1, 0, -1),
            query(1, -10, 10),
            query(1, -2147483648, -2147483648),
        ]
    )
    {
        const f = fixture();
        await readMailCategory(f.databases, 1, "self", q, async (entries) => {
            expect(entries).toEqual([]);
            return [];
        });
        expect(f.calls).toHaveLength(3);
    }
    for (
        const [begin, offset, expected] of [
            [-1, 3, 2],
            [-2147483648, -1, 1001],
        ]
    )
    {
        const f = fixture();
        await readMailCategory(f.databases, 1, "self", query(1, begin, offset), async () => []);
        expect(f.calls[2]!.params.at(-1)).toBe(expected);
    }
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
        const f = fixture({ profile });
        await readMailCategory(f.databases, 1, "self", query(), async () => {
            throw new Error("Unauthorized projection");
        });
        expect(f.calls).toHaveLength(3);
    }
});

test("category capacities reject before body fetch and malformed cleanup rolls back on projection or storage failure", async () => {
    for (
        const options of [
            { size: 4 * 1024 * 1024 + 1 },
            { size: -1 },
            { size: NaN },
            { bodyMismatch: true },
            ...["profile", "metadata", "bodies", "delete", "commit"].map((fail) => ({ fail })),
        ]
    )
    {
        const f = fixture(options);
        const before = f.rows().map((row) => ({ ...row }));
        await expect(
            readMailCategory(f.databases, 1, "self", query(), inspect(query())),
        ).rejects.toThrow();
        expect(f.rows()).toEqual(before);
        expect(f.calls.at(-1)!.text).toBe("rollback");
        if ("size" in options)
        {
            expect(f.calls).toHaveLength(4);
        }
    }
    const rewards = fixture();
    rewards.rows().find((row) => row.uid === "newest")!.rewardId = "x".repeat(4 * 1024 * 1024 + 1);
    await expect(
        readMailCategory(rewards.databases, 1, "self", query(), inspect(query())),
    ).rejects.toThrow("capacity");
    expect(rewards.calls).toHaveLength(4);
    const large = fixture();
    for (let i = 0; i < 1001; i++)
    {
        large.rows().push({ ...mailListEntry({ uid: `large-${i}` }), extraOwner: "self" });
    }
    await expect(
        readMailCategory(large.databases, 1, "self", query(1, 0, 2147483647), async () => []),
    ).rejects.toThrow("capacity");
    expect(large.calls).toHaveLength(4);
    for (
        const plan of [
            async () => ["other"],
            async () => ["bad", "bad"],
            async () => {
                throw new Error("Synthetic async presentation failure");
            },
        ]
    )
    {
        const f = fixture();
        const before = f.rows().map((row) => ({ ...row }));
        await expect(readMailCategory(f.databases, 1, "self", query(), plan)).rejects.toThrow();
        expect(f.rows()).toEqual(before);
        expect(f.calls.some((call) => call.text.startsWith("delete"))).toBe(false);
    }
});

test("extra ownership is enforced and absent payloads do not become malformed-mail deletion", async () => {
    for (const extraOwner of ["self", "", null])
    {
        const f = fixture();
        f.rows().find((row) => row.uid === "good")!.extraOwner = extraOwner;
        await readMailCategory(f.databases, 1, "self", query(), inspect(query()));
        expect(f.rows().some((row) => row.uid === "good")).toBe(true);
    }
    for (const missing of [false, true])
    {
        const f = fixture();
        const good = f.rows().find((row) => row.uid === "good")!;
        if (missing)
        {
            good.extra = null;
        }
        else
        {
            good.extraOwner = "foreign";
        }
        await expect(
            readMailCategory(f.databases, 1, "self", query(), inspect(query())),
        ).rejects.toThrow("Missing persisted mail contents");
        expect(f.rows().some((row) => row.uid === "bad")).toBe(true);
    }
});

test("game command reaches category SQL through the production repository adapter using an injected client", async () => {
    const f = fixture();
    const repository: Database = Object.assign(Object.create(Database.prototype), {
        databases: f.databases,
        config: { kingdomId: 1 },
    });
    const game = createRealmGameService(
        repository,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => now,
    );
    const result = await game.execute("self", "mread.batch.category", {
        category: sfs.int(3),
        num: sfs.int(0),
        offset: sfs.int(4),
        _cok_: sfs.string("request"),
    });
    const entries = (result.body.result!.value as Value[]).map(fields);
    expect(entries.map((row) => row.uid)).toEqual([sfs.string("good"), sfs.string("tie")]);
    expect(fields(entries[0]!.detail).n).toEqual(sfs.long(9223372036854775807n));
    expect(f.rows().some((row) => row.uid === "bad")).toBe(false);
    expect(result.body._cok_).toEqual(sfs.string("request"));
    const g = fixture();
    const other: Database = Object.assign(Object.create(Database.prototype), {
        databases: g.databases,
        config: { kingdomId: 1 },
    });
    await expect(
        createRealmGameService(
            other,
            new Rules(new Map(), new Map(), new Map()),
            { kingdomId: 1 },
            () => now,
        ).execute("self", "mread.batch.category", {
            category: sfs.int(3),
            num: sfs.int(0),
            offset: sfs.int(4),
            _cok_: sfs.string("x".repeat(32768)),
        }),
    ).rejects.toThrow();
    expect(g.rows().some((row) => row.uid === "bad")).toBe(true);
    expect(g.calls.at(-1)!.text).toBe("rollback");
});

test("direct category callers cannot bypass numeric or identity bounds", () => {
    const f = fixture();
    for (const owner of ["", " ", "x".repeat(41), "\0", "\ud800"])
    {
        expect(() => readMailCategory(f.databases, 1, owner, query(), inspect(query()))).toThrow();
    }
    for (const realm of [0, 1.5, 2147483648])
    {
        expect(() => readMailCategory(f.databases, realm, "self", query(), inspect(query())))
            .toThrow();
    }
    for (
        const q of [
            { ...query(), now: -1 },
            { ...query(), category: 0.5 },
            { ...query(), offset: 2147483648 },
            { ...query(), begin: NaN },
        ]
    )
    {
        expect(() => readMailCategory(f.databases, 1, "self", q, inspect(q))).toThrow();
    }
    expect(f.calls).toEqual([]);
});

test("chat command resolves public senders and translations through readers bound to the owner transaction", async () => {
    const f = fixture();
    f.rows().push({
        ...mailListEntry({
            uid: "chat",
            type: 22,
            createTime: 30n,
            translationId: "en|translation",
        }),
        extraOwner: "self",
    });
    const repository: Database = Object.assign(Object.create(Database.prototype), {
        databases: f.databases,
        config: { kingdomId: 1 },
    });
    const game = createRealmGameService(
        repository,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => now,
        { playerUpdateTimes: async () => new Map([["self", "marker"]]) },
    );
    const result = await game.execute("self", "mread.batch.category", {
        category: sfs.int(4),
        num: sfs.int(0),
        offset: sfs.int(1),
    });
    const first = fields((result.body.result!.value as Value[])[0]);
    expect(first.fromName).toEqual(sfs.string("Current"));
    expect(first.pic).toEqual(sfs.string("portrait"));
    expect(first.alliance).toEqual(sfs.string("TAG"));
    expect(first.originalLang).toEqual(sfs.string("en"));
    expect(first.translationMsg).toEqual(sfs.string("traduzido"));
    expect(first.lastUpdateTime).toEqual(sfs.string("marker"));
    expect(f.calls.filter((call) => call.text.startsWith("begin"))).toHaveLength(1);
    expect(f.calls.at(-1)!.text).toBe("commit");
    expect(
        f.calls.filter((call) =>
            call.text.includes("from \"opencok_kingdom\".\"translationv2\"")
        )[1]!.text,
    ).toContain("select \"id\", \"pt\"");
    expect(f.calls.some((call) => call.text.startsWith("delete"))).toBe(false);
});
