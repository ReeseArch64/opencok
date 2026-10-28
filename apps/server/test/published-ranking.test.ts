import { expect, test } from "bun:test";
import {
    loadAttributeRanking,
    loadPublishedGlobalRanking,
} from "@opencok/storage/published-ranking";
import { attributeRanking, publishedRanking } from "@opencok/mappings/published-ranking";
import { decode, encode, sfs } from "@opencok/messages/sfs";
import { createRealmGameService } from "../src/composition/game";
import { Rules } from "@opencok/rules/game";
import type { GameStore } from "@opencok/contracts/game";

const entries = [
    "{\"uid\":\"self\",\"rank\":3,\"val\":9007199254740993}",
    "{\"uid\":\"self\",\"rank\":7}",
];

test("published boards atomically read the numbered publication and stop at its first missing slot", async () => {
    for (const kind of ["payment", "consumption"] as const)
    {
        const calls: unknown[][] = [];
        const result = await loadPublishedGlobalRanking(async (...args) => {
            calls.push(args);
            return [...entries, "", "invalid ignored tail", ...Array(96).fill(null)];
        }, kind);
        expect(result).toEqual(entries);
        expect(calls).toHaveLength(1);
        expect(calls[0]?.[0]).toBe("MGET");
        expect(calls[0]).toHaveLength(101);
        expect(calls[0]?.[1]).toBe(
            `${kind === "payment" ? "paytotal" : "continuedcost"}_global_rank_1`,
        );
    }
});

test("published ranking preserves order, duplicate self positions, long payloads and visibility", () => {
    const result = decode(encode(publishedRanking(entries, "self", 1)));
    expect(result.myRank).toEqual(sfs.int(7));
    expect(result.myHide).toEqual(sfs.int(1));
    expect(result.rankList?.value).toEqual([
        sfs.object({ uid: sfs.string("self"), rank: sfs.int(3), val: sfs.long(9007199254740993n) }),
        sfs.object({ uid: sfs.string("self"), rank: sfs.int(7) }),
    ]);
    expect(publishedRanking(entries, "absent", 0).myRank).toEqual(sfs.int(-1));
    expect(() => publishedRanking(["{\"uid\":\"self\"}"], "self", 0)).toThrow();
    expect(() => publishedRanking(entries, "self", 2147483648)).toThrow();
});

test("attribute categories retain exact keys and inclusive limits without sorting published ties", async () => {
    for (
        const [type, key, end] of [
            [0, "global_attack_wins_ranking", 150],
            [1, "global_defence_wins_ranking", 29],
            [2, "global_hp_ranking", 29],
        ] as const
    )
    {
        const result = await loadAttributeRanking(
            async (...args) => {
                expect(args).toEqual(["LRANGE", `${key}_4`, "0", String(end)]);
                return entries;
            },
            4,
            type,
        );
        expect(attributeRanking(result, type).rankMap?.value).toHaveLength(2);
    }
});

test("published readers reject failed or malformed dependencies without partial success", async () => {
    const failed = async (): Promise<never> => {
        throw new Error("unavailable");
    };
    await expect(loadPublishedGlobalRanking(failed, "payment")).rejects.toThrow();
    await expect(loadPublishedGlobalRanking(async () => [], "payment")).rejects.toThrow();
    await expect(
        loadPublishedGlobalRanking(async () => [3, ...Array(99).fill(null)], "payment"),
    ).rejects.toThrow();
    await expect(loadAttributeRanking(async () => Array(31).fill("{}"), 1, 2)).rejects.toThrow();
    expect(() => attributeRanking(["{\"x\":\"" + "a".repeat(32768) + "\"}"], 0)).toThrow();
});

function fixture()
{
    const rules = new Rules(new Map(), new Map(), new Map());
    for (const key of ["new_rank_recharge", "new_rank_cost"])
    {
        rules.features.set(key, { online: "all", version: "1.0.0" });
    }
    const profile = { uid: "self", serverId: 1, banFlag: 0, banTime: 0n };
    const calls: string[] = [];
    const db = {
        getProfileById: async () => profile,
        normalRankingRealm: async () => true,
        rankingPrivacy: async (uid: string, kind: string) => {
            calls.push(`${uid}:${kind}`);
            return 1;
        },
    } as unknown as GameStore;
    const game = createRealmGameService(db, rules, { kingdomId: 1 }, () => 1000, {
        publishedGlobalRanking: async (kind) => {
            calls.push(kind);
            return entries;
        },
        attributeRanking: async (type) => {
            calls.push(String(type));
            return entries;
        },
    });
    return { game, rules, profile, calls, db };
}

test("new ranking commands authenticate, preserve correlation, ignore target IDs and produce no pushes", async () => {
    const { game, calls, profile } = fixture();
    for (const command of ["paytotal.ranking", "continuedcost.ranking", "attributeRank.info"])
    {
        const result = await game.execute("self", command, {
            uid: sfs.string("foreign"),
            rankType: sfs.int(2),
            _cok_: sfs.string("correlation"),
        });
        expect(result.body._cok_).toEqual(sfs.string("correlation"));
        expect(result.pushes).toEqual([]);
    }
    expect(calls).toEqual(["self:payment", "payment", "self:consumption", "consumption", "2"]);
    profile.serverId = 2;
    await expect(game.execute("self", "paytotal.ranking", {})).rejects.toThrow();
    expect(calls).toHaveLength(5);
});

test("disabled features and unsupported attributes acknowledge without consuming boards", async () => {
    const { game, rules, calls, db } = fixture();
    rules.features.set("new_rank_recharge", { online: "all", version: "99.0.0" });
    await game.execute("self", "paytotal.ranking", {});
    await game.execute("self", "attributeRank.info", { rankType: sfs.int(3) });
    db.normalRankingRealm = async () => false;
    await game.execute("self", "attributeRank.info", {});
    expect(calls).toEqual([]);
});
