import { expect, test } from "bun:test";
import { Rules } from "@opencok/rules/game";
import { militaryRankingGroup } from "@opencok/rules/military-ranking";
import { loadMilitaryRanking } from "@opencok/storage/military-ranking";
import { militaryRanking } from "@opencok/mappings/military-ranking";
import { sfs, fields, type Value } from "@opencok/messages/sfs";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";

const entry = {
    serverId: "1",
    uid: "self",
    serverName: "Realm",
    name: "Self",
    pic: "",
    abbr: "AL",
    militaryScore: 7,
};

test("military groups retain integer hash traversal, inclusive ranges and the zero fallback", () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.ranking.militaryGroups = new Map([
        ["2", { sever: "1-4" }],
        ["1", { sever: "1;7" }],
    ]);
    expect(militaryRankingGroup(rules, 1)).toBe(1);
    expect(militaryRankingGroup(rules, 4)).toBe(2);
    expect(militaryRankingGroup(rules, 9)).toBe(0);
    delete rules.ranking.militaryGroups;
    expect(() => militaryRankingGroup(rules, 1)).toThrow();
});

test("military cache checks publication completion and reads ordered members with their metadata atomically", async () => {
    for (const type of [0, 1])
    {
        const prefix = type === 0 ? "score" : "exp";
        expect(
            await loadMilitaryRanking(
                async (name, script, ...args) => {
                    expect(name).toBe("EVAL");
                    expect(script).toContain("~= '0'");
                    expect(script).toContain("'ZREVRANGE', KEYS[2], 0, 150");
                    expect(script).toContain("Missing ranking metadata");
                    expect(args).toEqual([
                        "3",
                        `${prefix}RankingGroupKey_2`,
                        `${prefix}RankingKey_2`,
                        `${prefix}RankingUserKey_2`,
                    ]);
                    return [JSON.stringify(entry)];
                },
                type,
                2,
            ),
        ).toHaveLength(1);
    }
    await expect(loadMilitaryRanking(async () => Array(152).fill("{}"), 0, 1)).rejects.toThrow();
});

test("military projection assigns positions and matches self by both realm and identity", () => {
    const entries = [
        JSON.stringify({ ...entry, serverId: "2" }),
        JSON.stringify(entry),
        JSON.stringify(entry),
    ];
    const result = militaryRanking(entries, "self", 1, 0);
    expect(result.selfRanking).toEqual(sfs.int(3));
    expect(fields((result.playerArr!.value as Value[])[0]).ranking).toEqual(sfs.int(1));
    expect(militaryRanking([], "self", 1, 0).selfRanking).toEqual(sfs.int(0));
    expect(() => militaryRanking([JSON.stringify(entry)], "self", 1, 1)).toThrow();
});

test("military handler reads published ranks without invoking settlement and rejects disabled selectors", async () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.features.set("wr_switch", { version: "1.0.0", online: "all" });
    rules.ranking.militaryGroups = new Map([["2", { sever: "1-4" }]]);
    const db = {
        getProfileById: async () => ({ uid: "self", serverId: 1, banFlag: 0 }),
    } as unknown as GameStore;
    const calls: number[][] = [];
    const game = createRealmGameService(db, rules, { kingdomId: 1 }, () => 1000, {
        militaryRanking: async (type, group) => {
            calls.push([type, group]);
            return [JSON.stringify(entry)];
        },
    });
    const result = await game.execute("self", "military.ranking", {
        type: sfs.int(0),
        _cok_: sfs.int(1),
    });
    expect(result.body.selfRanking).toEqual(sfs.int(1));
    expect(result.body._cok_).toEqual(sfs.int(1));
    expect(result.pushes).toEqual([]);
    expect(calls).toEqual([[0, 2]]);
    await expect(game.execute("self", "military.ranking", { type: sfs.int(2) })).rejects.toThrow();
    rules.features.clear();
    await expect(game.execute("self", "military.ranking", { type: sfs.int(0) })).rejects.toThrow();
    expect(calls).toHaveLength(1);
});
