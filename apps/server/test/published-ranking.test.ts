import { expect, test } from "bun:test";
import { sfs } from "@opencok/messages/sfs";
import { createRealmGameService } from "../src/composition/game";
import { Rules } from "@opencok/rules/game";
import type { GameStore } from "@opencok/contracts/game";

const entries = [
    "{\"uid\":\"self\",\"rank\":3,\"val\":9007199254740993}",
    "{\"uid\":\"self\",\"rank\":7}",
];

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
