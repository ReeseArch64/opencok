import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { readMailContents } from "@opencok/repositories/mail-contents";
import { mailContentsProjection } from "@opencok/services/mail-contents";
import type { MailContentsEntry } from "@opencok/contracts/mail";

const now = 1792756800000;
function database(options: { profile?: unknown[] | null; fail?: string; size?: number; } = {})
{
    let rows = [
        {
            uid: "plain",
            owner: "self",
            type: 2,
            contents: Buffer.from("hello"),
            extra: null as Buffer | null,
            extraOwner: null as string | null,
        },
        {
            uid: "json",
            owner: "self",
            type: 5,
            contents: Buffer.from("{\"n\":9223372036854775807}"),
            extra: null,
            extraOwner: null,
        },
        {
            uid: "bad",
            owner: "self",
            type: 5,
            contents: Buffer.from("broken"),
            extra: Buffer.from("retained auxiliary"),
            extraOwner: "self",
        },
        {
            uid: "extra",
            owner: "self",
            type: 26,
            contents: Buffer.from("extra"),
            extra: Buffer.from("{\"recipient\":\"synthetic\"}"),
            extraOwner: "self",
        },
        {
            uid: "blank-extra",
            owner: "self",
            type: 2,
            contents: Buffer.from("extra"),
            extra: Buffer.from("blank owner"),
            extraOwner: "",
        },
        {
            uid: "null-extra",
            owner: "self",
            type: 2,
            contents: Buffer.from("extra"),
            extra: Buffer.from("null owner"),
            extraOwner: null,
        },
        {
            uid: "foreign-extra",
            owner: "self",
            type: 2,
            contents: Buffer.from("extra"),
            extra: Buffer.from("private"),
            extraOwner: "other",
        },
        {
            uid: "foreign",
            owner: "other",
            type: 2,
            contents: Buffer.from("secret"),
            extra: null,
            extraOwner: null,
        },
    ].map((row) => ({
        ...row,
        saveFlag: 1,
        status: 0,
        rewardStatus: 0,
        createTime: 9007199254740993n,
    }));
    let before = rows;
    const queries: { text: string; params: unknown[]; }[] = [];
    const client = {
        query: async (statement: { text: string; }, params: unknown[] = []) => {
            const text = statement.text;
            queries.push({ text, params });
            if (text.startsWith("begin"))
            {
                before = rows.map((row) => ({ ...row }));
            }
            if (text === "rollback")
            {
                rows = before;
            }
            const fail = (name: string) => {
                if (options.fail === name)
                {
                    throw new Error("Synthetic " + name + " failure");
                }
            };
            if (text.includes("from \"opencok_kingdom\".\"userprofile\""))
            {
                fail("profile");
                return {
                    rows: options.profile === null ? [] : [options.profile ?? ["self", 1, "0", 0]],
                };
            }
            if (text.startsWith("select") && text.includes("from \"opencok_kingdom\".\"mail\""))
            {
                const [extraOwner, _blank, owner, ...ids] = params;
                const selected = rows
                    .filter((row) => row.owner === owner && ids.includes(row.uid))
                    .sort((a, b) => (a.uid < b.uid ? -1 : 1));
                const extra = (row: (typeof rows)[number]) =>
                    row.extraOwner === extraOwner || row.extraOwner === ""
                        || row.extraOwner === null
                        ? row.extra
                        : null;
                if (text.includes("octet_length"))
                {
                    fail("metadata");
                    return {
                        rows: selected.map((row) => [
                            row.uid,
                            options.size ?? row.contents.length + (extra(row)?.length ?? 0),
                        ]),
                    };
                }
                fail("bodies");
                return {
                    rows: selected.map((row) => [
                        row.uid,
                        row.type,
                        String(row.createTime),
                        row.contents,
                        extra(row),
                    ]),
                };
            }
            if (text.startsWith("delete from \"opencok_kingdom\".\"mail\""))
            {
                fail("delete");
                const [owner, ...ids] = params;
                rows = rows.filter((row) => row.owner !== owner || !ids.includes(row.uid));
            }
            if (text === "commit")
            {
                fail("commit");
            }
            return { rows: [] };
        },
    };
    return {
        db: drizzle(client as unknown as NodePgClient, { schema }),
        queries,
        rows: () => rows,
    };
}
const inspect = (entries: readonly MailContentsEntry[]) =>
    mailContentsProjection(entries).invalidIds;

test("mail detail repository scopes reads and malformed removals to the recipient in one locked snapshot", async () => {
    const { db, queries, rows } = database();
    const before = rows().map((row) => ({ ...row }));
    let selected: readonly MailContentsEntry[] = [];
    await readMailContents(
        db,
        1,
        "self",
        { ids: ["plain", "bad", "extra", "json", "foreign", "missing"], now },
        (entries) => {
            selected = entries;
            return inspect(entries);
        },
    );
    expect(selected.map((row) => row.uid)).toEqual(["bad", "extra", "json", "plain"]);
    expect(selected[0]!.createTime).toBe(9007199254740993n);
    expect(rows()).toEqual(before.filter((row) => row.uid !== "bad"));
    expect(queries.map((q) => q.text.split(" ")[0])).toEqual([
        "begin",
        "select",
        "select",
        "select",
        "delete",
        "commit",
    ]);
    expect(queries[0]!.text).toBe("begin isolation level repeatable read read write");
    expect(queries[1]!.text).toEndWith("limit $2 for update");
    expect(queries[2]!.text).toContain("for update of \"selected_mail\"");
    expect(queries[2]!.text).toContain("\"selected_mail\".\"toUser\" = $3");
    expect(queries[2]!.text).toContain("\"mail_contents\".\"toUser\" is null");
    expect(queries[2]!.text).toContain("\"selected_mail\".\"uid\" collate \"C\" asc");
    expect(queries[3]!.params).toEqual([
        "self",
        "",
        "self",
        "plain",
        "bad",
        "extra",
        "json",
        "foreign",
        "missing",
    ]);
    expect(queries[4]!.params).toEqual(["self", "bad"]);
    expect(queries[4]!.text).toContain("\"mail\".\"toUser\" = $1");
    expect(queries.map((q) => q.text).join("\n")).not.toMatch(
        /insert |update "|delete from "opencok_kingdom"\."mail_contents"|mail_group|mail_update|gift/,
    );
});

test("extra contents accept owned and historical unassigned rows while foreign or absent payloads reject without deleting mail", async () => {
    const { db, rows } = database();
    for (const id of ["extra", "blank-extra", "null-extra"])
    {
        await readMailContents(db, 1, "self", { ids: [id], now }, inspect);
    }
    const before = rows().map((row) => ({ ...row }));
    await expect(
        readMailContents(db, 1, "self", { ids: ["bad", "foreign-extra"], now }, inspect),
    ).rejects.toThrow("Missing persisted mail contents");
    expect(rows()).toEqual(before);
    rows().find((row) => row.uid === "extra")!.extra = null;
    await expect(
        readMailContents(db, 1, "self", { ids: ["bad", "extra"], now }, inspect),
    ).rejects.toThrow("Missing persisted mail contents");
    expect(rows().some((row) => row.uid === "bad")).toBe(true);
});

test("mail detail capacity is checked before body retrieval and projection failures never authorize deletion", async () => {
    const bounded = database({ size: 4 * 1024 * 1024 + 1 });
    await expect(
        readMailContents(bounded.db, 1, "self", { ids: ["bad"], now }, inspect),
    ).rejects.toThrow("capacity");
    expect(bounded.queries).toHaveLength(4);
    expect(bounded.queries.at(-1)!.text).toBe("rollback");
    for (
        const plan of [
            () => ["foreign"],
            () => ["bad", "bad"],
            () => {
                throw new Error("Synthetic projection failure");
            },
        ]
    )
    {
        const { db, rows, queries } = database();
        const before = rows().map((row) => ({ ...row }));
        await expect(readMailContents(db, 1, "self", { ids: ["bad"], now }, plan)).rejects
            .toThrow();
        expect(rows()).toEqual(before);
        expect(queries.some((q) => q.text.startsWith("delete"))).toBe(false);
    }
    const oversized = database();
    oversized.rows().find((row) => row.uid === "plain")!.contents = Buffer.from("x".repeat(32768));
    await expect(
        readMailContents(oversized.db, 1, "self", { ids: ["bad", "plain"], now }, inspect),
    ).rejects.toThrow();
    expect(oversized.rows().some((row) => row.uid === "bad")).toBe(true);
});

test("mail detail authorization and transaction failures preserve message state; missing IDs return an empty projection", async () => {
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
        const { db, queries } = database({ profile });
        await readMailContents(db, 1, "self", { ids: ["bad"], now }, () => {
            throw new Error("Unauthorized projection");
        });
        expect(queries).toHaveLength(3);
    }
    for (const fail of ["profile", "metadata", "bodies", "delete", "commit"])
    {
        const { db, queries, rows } = database({ fail });
        const before = rows().map((row) => ({ ...row }));
        await expect(readMailContents(db, 1, "self", { ids: ["bad"], now }, inspect)).rejects
            .toThrow();
        expect(rows()).toEqual(before);
        expect(queries.at(-1)!.text).toBe("rollback");
    }
    const missing = database();
    let calls = 0;
    await readMailContents(
        missing.db,
        1,
        "self",
        { ids: ["missing", "foreign"], now },
        (entries) => {
            calls++;
            expect(entries).toEqual([]);
            return [];
        },
    );
    expect(calls).toBe(1);
    expect(missing.queries).toHaveLength(4);
});

test("direct mail detail callers cannot bypass identifier, time, owner and realm bounds", () => {
    const { db, queries } = database();
    for (const owner of ["", " ", "x".repeat(41), "\0", "\ud800"])
    {
        expect(() => readMailContents(db, 1, owner, { ids: ["plain"], now }, inspect)).toThrow();
    }
    for (const realm of [0, 1.5, 2147483648])
    {
        expect(() => readMailContents(db, realm, "self", { ids: ["plain"], now }, inspect))
            .toThrow();
    }
    for (
        const ids of [
            [],
            [""],
            ["plain", "plain"],
            ["\0"],
            ["\ud800"],
            ["x".repeat(41)],
            Array.from({ length: 1001 }, (_, i) => String(i)),
        ]
    )
    {
        expect(() => readMailContents(db, 1, "self", { ids, now }, inspect)).toThrow();
    }
    for (const time of [-1, NaN, 1.5])
    {
        expect(() => readMailContents(db, 1, "self", { ids: ["plain"], now: time }, inspect))
            .toThrow();
    }
    expect(queries).toEqual([]);
});
