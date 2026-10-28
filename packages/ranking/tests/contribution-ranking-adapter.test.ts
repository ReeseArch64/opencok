import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { readPlayerRanking } from "@opencok/ranking/repositories/ranking";
import type { PlayerRankingQuery } from "@opencok/ranking/contracts/ranking";

const query: PlayerRankingQuery = {
    kind: "contribution",
    limit: 3,
    hideGm: true,
    now: 1792756800000,
};
function database(
    options: { fail?: string; empty?: boolean; orphan?: boolean; missingCount?: boolean; } = {},
)
{
    const queries: { text: string; params: unknown[]; }[] = [];
    const client = {
        query: async (statement: { text: string; }, params: unknown[] = []) => {
            const text = statement.text;
            queries.push({ text, params });
            const fail = (phase: string) => {
                if (options.fail === phase)
                {
                    throw new Error(`Synthetic ${phase} failure`);
                }
            };
            if (text.startsWith("select \"uid\", \"level\", \"serverId\""))
            {
                return { rows: [["self", 10, 1, "0", 0]] };
            }
            if (text.includes("left join"))
            {
                fail("board");
                return {
                    rows: options.empty
                        ? []
                        : [
                            [
                                "other",
                                2147483647,
                                options.orphan ? null : "other",
                                "Name",
                                "picture",
                                1,
                                2,
                                "a",
                                "0",
                                "a",
                                "Alliance",
                                "A",
                            ],
                        ],
                };
            }
            if (text.startsWith("select (count(*) + 1)::text"))
            {
                fail("count");
                return { rows: options.missingCount ? [] : [["9007199254740993"]] };
            }
            return { rows: [] };
        },
    };
    return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}

test("contribution snapshots select positive totals before post-window exclusions and use unrestricted greater-total fallback", async () => {
    const { db, queries } = database();
    const result = await readPlayerRanking(db, "self", query);
    expect(result.fallbackRank).toBe(9007199254740993n);
    expect(result.candidates[0]).toEqual({
        uid: "other",
        contributeSum: 2147483647,
        profileUid: "other",
        name: "Name",
        pic: "picture",
        picVer: 1,
        picfraId: 2,
        allianceId: "a",
        banTime: 0n,
        allianceUid: "a",
        alliancename: "Alliance",
        abbr: "A",
    });
    expect(queries).toHaveLength(5);
    expect(queries[0]?.text).toBe("begin isolation level repeatable read read only");
    expect(queries.at(-1)?.text).toBe("commit");
    expect(queries[1]?.params).toEqual(["self", 1]);
    const board = queries[2]!;
    expect(board.params).toEqual([0, 3]);
    expect(board.text).toContain("left join \"opencok_kingdom\".\"userprofile\"");
    expect(board.text).toContain(
        "where \"opencok_kingdom\".\"material_cost_ranking\".\"contributeSum\" > $1",
    );
    expect(board.text).toContain(
        "order by \"opencok_kingdom\".\"material_cost_ranking\".\"contributeSum\" desc, \"opencok_kingdom\".\"material_cost_ranking\".\"uid\" collate \"C\" asc",
    );
    expect(board.text).not.toMatch(/gmFlag|crossFightSrcServerId|"banTime"\s*[<=>]/);
    const fallback = queries[3]!;
    expect(fallback.params).toEqual(["self", 1]);
    expect(fallback.text).toContain("\"contributeSum\" > (select");
    expect(fallback.text).not.toMatch(/join|userprofile|banTime|gmFlag/);
    for (const entry of queries)
    {
        expect(entry.text).not.toMatch(
            /\b(insert|update|delete|truncate)\b|select \*|"gold"|email/,
        );
    }
});

test("empty contribution boards and orphan records retain query results while failures roll back", async () => {
    for (const options of [{ empty: true }, { orphan: true }])
    {
        const { db } = database(options);
        const result = await readPlayerRanking(db, "self", query);
        if (options.empty)
        {
            expect(result.candidates).toEqual([]);
        }
        else
        {
            expect(result.candidates[0]?.profileUid).toBeNull();
        }
    }
    for (const options of [{ fail: "board" }, { fail: "count" }, { missingCount: true }])
    {
        const { db, queries } = database(options);
        await expect(readPlayerRanking(db, "self", query)).rejects.toThrow();
        expect(queries.at(-1)?.text).toBe("rollback");
        expect(queries.some((entry) => entry.text === "commit")).toBe(false);
    }
});
