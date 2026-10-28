import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import { getTableColumns } from "drizzle-orm";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { readPublicProfile } from "@opencok/repositories/profile";

function database(
    options: {
        allianceId?: string;
        missing?: boolean;
        leaders?: number;
        members?: string;
        failure?: string;
        overflow?: boolean;
    } = {},
)
{
    const queries: { text: string; params: unknown[]; }[] = [];
    const allianceId = options.allianceId ?? "alliance-a";
    const record: Record<string, unknown> = {
        uid: allianceId,
        alliancename: "Synthetic",
        giftlevel: 2501,
        maxMember: 50,
        createtime: "9007199254740993",
        wood: "9007199254740995",
        permission: "{\"mail\":4}",
    };
    const client = {
        query: async (query: { text: string; }, params: unknown[] = []) => {
            queries.push({ text: query.text, params });
            const table = query.text.match(/from "opencok_kingdom"\."([^"]+)"/)?.[1];
            if (table && table === options.failure)
            {
                throw new Error("Synthetic alliance failure");
            }
            if (table === "userprofile")
            {
                return { rows: [["synthetic", "Public", 5, 123, null, 2, 3, 0, allianceId, 2]] };
            }
            if (table === "user_achievement")
            {
                return { rows: [["0"]] };
            }
            if (table === "alliance")
            {
                return {
                    rows: options.missing
                        ? []
                        : [
                            Object.keys(getTableColumns(alliance)).map((key) =>
                                record[key] ?? null
                            ),
                        ],
                };
            }
            if (table === "alliance_member")
            {
                if (query.text.includes("inner join \"opencok_kingdom\".\"userprofile\""))
                {
                    return {
                        rows: Array.from({ length: options.leaders ?? 1 }, (_, index) => [
                            `leader-${index}`,
                            "Leader",
                        ]),
                    };
                }
                return { rows: [[options.members ?? "2", "9007199254740993"]] };
            }
            if (table === "alliance_science")
            {
                return {
                    rows: Array.from({ length: options.overflow ? 32768 : 1 }, () => [1000, 1]),
                };
            }
            if (table === "alliance_vedio")
            {
                return {
                    rows: [[
                        allianceId,
                        "synthetic-video",
                        "synthetic-thumbnail",
                        720,
                        1280,
                        1234,
                        10,
                        1,
                    ]],
                };
            }
            return { rows: [] };
        },
    };
    return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}

test("public alliance inputs share the profile transaction and bind persisted membership with aggregate SQL", async () => {
    const { db, queries } = database({ allianceId: "alliance'a" });
    const state = await readPublicProfile(db, "synthetic", "other-alliance");
    expect(state.alliance).toMatchObject({
        alliance: {
            uid: "alliance'a",
            giftlevel: 2501,
            maxMember: 50,
            createtime: 9007199254740993n,
            wood: 9007199254740995n,
        },
        leader: { uid: "leader-0", name: "Leader" },
        totals: { member: "2", fightpower: "9007199254740993" },
        sciences: [{ scienceId: 1000, level: 1 }],
        withEffects: true,
        video: { allianceId: "alliance'a", vedioURL: "synthetic-video", checkSign: 1 },
    });
    expect(queries[0]?.text).toBe("begin isolation level repeatable read read only");
    expect(queries.at(-1)?.text).toBe("commit");
    const reads = queries.filter((query) =>
        query.text.includes("from \"opencok_kingdom\".\"alliance")
    );
    expect(reads).toHaveLength(5);
    for (const query of reads)
    {
        expect(query.params[0]).toBe("alliance'a");
        expect(query.text).not.toContain("alliance'a");
        expect(query.text).not.toMatch(/\b(insert|update|delete)\b|passmd5|device|email|select \*/);
    }
    const leader = reads[1]!;
    expect(leader.params).toEqual(["alliance'a", 5, 2]);
    expect(leader.text).toContain(
        "\"userprofile\".\"uid\" = \"opencok_kingdom\".\"alliance_member\".\"uid\"",
    );
    const totals = reads[2]!;
    expect(totals.text).toContain("count(*)::text");
    expect(totals.text).toContain("sum(\"opencok_kingdom\".\"playerinfo\".\"power\")");
    expect(totals.text).toContain(
        "\"playerinfo\".\"uid\" = \"opencok_kingdom\".\"alliance_member\".\"uid\"",
    );
    expect(reads[3]?.params).toEqual(["alliance'a", 32768]);
});

test("missing membership skips all alliance reads and same-alliance observers skip research", async () => {
    const absent = database({ allianceId: " ", failure: "alliance" });
    expect((await readPublicProfile(absent.db, "synthetic")).alliance).toBeUndefined();
    expect(
        absent.queries.some((query) => query.text.includes("from \"opencok_kingdom\".\"alliance")),
    ).toBe(false);
    const own = database({ failure: "alliance_science" });
    expect((await readPublicProfile(own.db, "synthetic", "alliance-a")).alliance).toMatchObject({
        withEffects: false,
        sciences: [],
    });
    expect(
        own.queries.some((query) =>
            query.text.includes("from \"opencok_kingdom\".\"alliance_science\"")
        ),
    ).toBe(false);
});

test("missing alliance records, ambiguous leadership and late dependencies reject the entire snapshot", async () => {
    for (
        const options of [
            { missing: true },
            { leaders: 0 },
            { leaders: 2 },
            { members: "0" },
            { failure: "alliance_science" },
            { failure: "alliance_vedio" },
            { overflow: true },
        ]
    )
    {
        const { db, queries } = database(options);
        await expect(readPublicProfile(db, "synthetic")).rejects.toThrow();
        expect(queries.at(-1)?.text).toBe("rollback");
        expect(queries.some((query) => query.text === "commit")).toBe(false);
    }
});
