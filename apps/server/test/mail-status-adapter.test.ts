import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { readMailStatus } from "@opencok/repositories/mail";

const query = { category: undefined, now: 1792756800000 };
function database(
    options: { missing?: boolean; banned?: boolean; fail?: string; overflow?: boolean; } = {},
)
{
    const queries: { text: string; params: unknown[]; }[] = [];
    const client = {
        query: async (statement: { text: string; }, params: unknown[] = []) => {
            queries.push({ text: statement.text, params });
            if (statement.text.includes("from \"opencok_kingdom\".\"userprofile\""))
            {
                if (options.fail === "profile")
                {
                    throw new Error("Synthetic profile failure");
                }
                return { rows: options.missing ? [] : [["self", 1, "0", options.banned ? 1 : 0]] };
            }
            if (statement.text.includes("from \"opencok_kingdom\".\"mail\""))
            {
                if (options.fail === "counts")
                {
                    throw new Error("Synthetic mailbox failure");
                }
                return {
                    rows: options.overflow
                        ? Array.from({ length: 32768 }, (_, i) => [i, 0, false, "1"])
                        : [
                            [2, 0, false, "9007199254740993"],
                            [34, 1, true, "2"],
                        ],
                };
            }
            return { rows: [] };
        },
    };
    return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}

test("mail status aggregates only the authenticated recipient and preserves nullable status and count precision", async () => {
    const { db, queries } = database();
    expect(await readMailStatus(db, "self", query)).toEqual({
        profile: { uid: "self", serverId: 1, banTime: 0n, banFlag: 0 },
        counts: [
            { type: 2, status: 0, allianceNotice: false, count: 9007199254740993n },
            { type: 34, status: 1, allianceNotice: true, count: 2n },
        ],
    });
    expect(queries).toHaveLength(4);
    expect(queries[0]?.text).toBe("begin isolation level repeatable read read only");
    expect(queries.at(-1)?.text).toBe("commit");
    expect(queries[1]?.params).toEqual(["self", 1]);
    const counts = queries[2]!;
    expect(counts.params).toEqual(["self", 32768]);
    expect(counts.text).toContain("where \"opencok_kingdom\".\"mail\".\"toUser\" = $1");
    expect(counts.text).toContain("coalesce(\"opencok_kingdom\".\"mail\".\"status\", 0)");
    expect(counts.text).toContain("\"mail\".\"title\" = '115429'");
    expect(counts.text).toContain("count(*)::text");
    expect(counts.text).toContain("group by \"opencok_kingdom\".\"mail\".\"type\"");
    for (const entry of queries)
    {
        expect(entry.text).not.toMatch(
            /\b(insert|update|delete)\b|select \*|contents|rewardId|fromName|email|"gold"/,
        );
    }
});

test("unknown categories and missing or banned profiles skip mailbox reads; failures and excessive groups roll back", async () => {
    for (const options of [{ missing: true }, { banned: true }])
    {
        const { db, queries } = database(options);
        expect((await readMailStatus(db, "self", query)).counts).toEqual([]);
        expect(queries).toHaveLength(3);
    }
    const unknown = database();
    expect((await readMailStatus(unknown.db, "self", { ...query, category: 99 })).counts).toEqual(
        [],
    );
    expect(unknown.queries).toHaveLength(3);
    for (const options of [{ fail: "profile" }, { fail: "counts" }, { overflow: true }])
    {
        const { db, queries } = database(options);
        await expect(readMailStatus(db, "self", query)).rejects.toThrow();
        expect(queries.at(-1)?.text).toBe("rollback");
        expect(queries.some((entry) => entry.text === "commit")).toBe(false);
    }
    const untouched = database();
    for (const uid of ["", " ", "x".repeat(41)])
    {
        expect(() => readMailStatus(untouched.db, uid, query)).toThrow();
    }
    for (const category of [NaN, 1.5, 2147483648])
    {
        expect(() => readMailStatus(untouched.db, "self", { ...query, category })).toThrow();
    }
    expect(untouched.queries).toEqual([]);
});
