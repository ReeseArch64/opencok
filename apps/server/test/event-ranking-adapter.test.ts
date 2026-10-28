import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { readHeroRanking } from "@opencok/hero/repositories/hero-ranking";
import { readThroneRanking } from "@opencok/repositories/throne-ranking";

function database(tableRows: Record<string, unknown[][]>)
{
    const queries: { text: string; params: unknown[]; }[] = [];
    const client = {
        query: async (query: { text: string; }, params: unknown[] = []) => {
            queries.push({ text: query.text, params });
            const table = query.text.match(/from "opencok_(?:kingdom|global)"\."([^"]+)"/)?.[1];
            return { rows: table ? (tableRows[table] ?? []) : [] };
        },
    };
    return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}

test("hero adapter reads one owner's activity and ordered events in a read-only snapshot", async () => {
    const { db, queries } = database({
        userprofile: [["self", "alliance", 1, 0, "0"]],
        hero_activity: [["active"]],
        hero_event: [["event", "active", "rule", 4, "9007199254740993", "1_2"]],
    });
    const state = await readHeroRanking(db, "self", "activity", 1000);
    expect(state.events[0]?.endTime).toBe(9007199254740993n);
    expect(queries[0]?.text).toContain("repeatable read read only");
    expect(
        queries.find((query) => query.text.includes("from \"opencok_kingdom\".\"hero_event\""))
            ?.params,
    ).toContain("active");
    expect(queries.some((query) => /insert|update|delete/i.test(query.text))).toBe(false);
    expect(queries.map((query) => query.text).join(" ")).not.toMatch(
        /device|email|password|deadDetail/,
    );
    const invalid = database({
        userprofile: [["self", "", 1, 0, "0"]],
        hero_activity: [["one"], ["two"]],
    });
    await expect(readHeroRanking(invalid.db, "self", "activity", 1000)).rejects.toThrow();
    expect(invalid.queries.at(-1)?.text).toBe("rollback");
});

test("throne adapter scopes the current fight, stabilizes kill ties and reads only public columns", async () => {
    const { db, queries } = database({
        fight_king_status: [[7, "{\"isCrossOpen\":true}"]],
        user_cross_throne: [[1, "self", "9007199254740993", "2", "Self", "Alliance", "AL", 2]],
        server_king_info: [[2, "Realm"]],
    });
    const state = await readThroneRanking(
        db,
        db as unknown as Parameters<typeof readThroneRanking>[1],
    );
    expect(state.rows[0]).toMatchObject({
        uid: "self",
        totalKills: 9007199254740993n,
        kingdomName: "Realm",
    });
    const select = queries.find((query) =>
        query.text.includes("from \"opencok_kingdom\".\"user_cross_throne\"")
    )!;
    expect(select.params).toContain(7);
    expect(select.text).toContain("\"totalKills\" desc");
    expect(select.text).toContain("\"id\" asc");
    expect(select.text).not.toContain("deadDetail");
    expect(queries.some((query) => /insert|update|delete/i.test(query.text))).toBe(false);
});

test("inside event adapter isolates the owner's alliance, scores and public metadata without settlement", async () => {
    const { readHeroInsideRanking } = await import("@opencok/hero/repositories/hero-ranking");
    const { db, queries } = database({
        userprofile: [["self", "own-alliance", 1, 0, "0"]],
        hero_event: [[2]],
    });
    expect((await readHeroInsideRanking(db, "self", "event", 1000)).rows).toEqual([]);
    const query = queries.find((query) =>
        query.text.includes("from \"opencok_kingdom\".\"score_act_in\"")
    )!;
    expect(query.params).toContain("own-alliance");
    expect(query.params).toContain("event");
    expect(query.text).toContain("\"score\" desc");
    expect(query.text).toContain("\"score_act_in\".\"uid\" asc");
    expect(queries.some((query) => /insert|update|delete/i.test(query.text))).toBe(false);
    expect(query.text).not.toMatch(/device|password|email/);
    const absent = database({ userprofile: [["self", "", 1, 0, "0"]] });
    expect((await readHeroInsideRanking(absent.db, "self", "event", 1000)).rows).toEqual([]);
    expect(absent.queries).toHaveLength(3);
});

test("hero history requires an active event and rejects invalid types without lifecycle writes", async () => {
    const { readHeroHistory } = await import("@opencok/hero/repositories/hero-ranking");
    const { db, queries } = database({
        userprofile: [["self", "alliance", 1, 0, "0"]],
        hero_event: [],
        user_building: [[4]],
        alliance_member: [["9007199254740993"]],
    });
    expect((await readHeroHistory(db, "self", 3, 1000)).events).toEqual([]);
    expect(queries.map((query) => query.text).join(" ")).toContain("\"hero_activity\".\"finish\"");
    expect(queries.some((query) => /insert|update|delete/i.test(query.text))).toBe(false);
    await expect(readHeroHistory(db, "self", 5, 1000)).rejects.toThrow();
});

test("donation and flower adapters keep owner scoping and never initialize missing records", async () => {
    const { readDonationRanking } = await import("@opencok/repositories/community-ranking");
    const { readFlowerRanking } = await import("@opencok/repositories/flower-ranking");
    const donation = database({
        userprofile: [["self", 1, "alliance", 0, "0"]],
        alliance: [["alliance"]],
    });
    expect((await readDonationRanking(donation.db, "self", 1000)).rows).toEqual([]);
    const members = donation.queries.find((query) =>
        query.text.includes("from \"opencok_kingdom\".\"alliance_member\"")
    )!;
    expect(members.params).toContain("alliance");
    expect(members.text).toContain("\"alliance_member\".\"uid\" asc");
    expect(members.text).not.toMatch(/password|email|deadDetail/);
    const flowers = database({ userprofile: [["self", 1, 0, "0"]] });
    const state = await readFlowerRanking(flowers.db, "self", []);
    expect(state.hide).toBe(0);
    expect(state.time).toBeUndefined();
    expect(
        flowers.queries.find((query) =>
            query.text.includes("from \"opencok_kingdom\".\"flower_ranking\"")
        )!
            .params,
    ).toContain("self");
    expect(
        [...donation.queries, ...flowers.queries].some((query) =>
            /insert|update|delete/i.test(query.text)
        ),
    ).toBe(false);
});

test("battle adapter reads only the authenticated observer and unexpired ticket pairs", async () => {
    const { readBattleRankingState } = await import("@opencok/repositories/battle-ranking");
    const local = database({
        userprofile: [["self", "own", 1, 0, "0"]],
        server_info: [["123"]],
        ob_user: [["a,b"]],
        ob_record: [["a,b"], ["b,c"]],
    });
    const global = database({ server_info: [[7]] });
    const state = await readBattleRankingState(
        local.db,
        global.db as unknown as Parameters<typeof readBattleRankingState>[1],
        "self",
        1,
        8000000,
    );
    expect(state.observerTeam).toBe("a");
    expect(state.tickets).toEqual(["a", "b", "c"]);
    expect(state.openedAt).toBe(123n);
    expect(state.realmType).toBe(7);
    const tickets = local.queries.find((query) =>
        query.text.includes("from \"opencok_kingdom\".\"ob_record\"")
    )!;
    expect(tickets.params).toContain("self");
    expect(tickets.params).toContain(800000n);
    expect(local.queries.some((query) => /insert|update|delete/i.test(query.text))).toBe(false);
});

test("completed hero history queries retain exact power and select only rewarded events in descending time", async () => {
    const { readHeroHistory } = await import("@opencok/hero/repositories/hero-ranking");
    const queries: { text: string; params: unknown[]; }[] = [];
    const client = {
        query: async (query: { text: string; }, params: unknown[] = []) => {
            queries.push({ text: query.text, params });
            const table = query.text.match(/from "opencok_kingdom"\."([^"]+)"/)?.[1];
            if (table === "userprofile")
            {
                return { rows: [["self", "alliance", 1, 0, "0"]] };
            }
            if (table === "user_building")
            {
                return { rows: [[4]] };
            }
            if (table === "alliance_member")
            {
                return { rows: [["9007199254740993"]] };
            }
            if (table === "hero_event")
            {
                return {
                    rows: query.text.includes("\"rewardStatus\"")
                        ? [["old", "rule", 4, "9007199254740993", "1_2", "2|1"]]
                        : [["rule", 4]],
                };
            }
            return { rows: [] };
        },
    };
    const state = await readHeroHistory(
        drizzle(client as unknown as NodePgClient, { schema }),
        "self",
        4,
        1000,
    );
    expect(state.alliancePower).toBe(9007199254740993n);
    expect(state.castleLevel).toBe(4);
    expect(state.events[0]?.endTime).toBe(9007199254740993n);
    const historical = queries.find((query) => query.text.includes("\"rewardStatus\""))!;
    expect(historical.params).toEqual([4, 1, 10]);
    expect(historical.text).toContain("\"endTime\" desc");
    expect(queries.some((query) => /insert|update|delete/i.test(query.text))).toBe(false);
});
