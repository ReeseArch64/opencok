import { expect, test } from "bun:test";
import { heroRankingLookup, heroSelfRanking } from "@opencok/rules/hero-ranking";
import { loadHeroRankingPosition } from "@opencok/storage/hero-ranking";
import { heroSelfRanking as mapResult } from "@opencok/mappings/hero-ranking";
import { Rules } from "@opencok/rules/game";
import { Game } from "@opencok/controllers/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";

function rules() {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.items.set("heroactivity", { k1: "1000|2000", k2: "2|5" });
  rules.items.set("heroactivity_on", { k3: "all", k4: "1.0.0", k7: "all", k8: "1.0.0" });
  return rules;
}

test("hero ranking keys retain realm bands, current event versions, alliance bands and cross groups", () => {
  const catalog = rules();
  const lookup = (type: number, realm = 4) =>
    heroRankingLookup(
      { type, endTime: 2147483648000n, serverGroup: "2_4" },
      "self",
      "alliance",
      catalog,
      realm,
      "12.06.0",
    );
  const personal = lookup(1);
  expect(typeof personal).toBe("object");
  if (typeof personal === "number") throw new Error();
  expect(personal.keys).toHaveLength(40);
  expect(personal.keys[0]).toBe("HERO_PERSON_RANK_0_1_-2147483648");
  expect(personal.member).toBe("self");
  expect(lookup(2)).toEqual({
    member: "alliance",
    keys: ["HERO_ALLIANCE_RANK_0_1_-2147483648", "HERO_ALLIANCE_RANK_1_1_-2147483648"],
  });
  expect(lookup(4)).toEqual({
    member: "alliance",
    keys: ["KINGDOM_ALLIANCE_RANK_0_2_4_-2147483648", "KINGDOM_ALLIANCE_RANK_1_2_4_-2147483648"],
  });
  expect(heroRankingLookup({ type: 2, endTime: 1000n }, "self", "", catalog, 1, "12.06.0")).toBe(0);
  catalog.items.delete("heroactivity_on");
  expect(lookup(1)).toBe(-1);
});

test("hero result preserves last-event overwrite and the distinct type-four alliance position", () => {
  const result = heroSelfRanking([{ type: 4 }, { type: 2 }, { type: 1 }], [7, 3, -1]);
  expect(mapResult(result)).toEqual({
    eventList: sfs.array([]),
    ranking: sfs.int(-1),
    rankingAlliance: sfs.int(7),
    type: sfs.int(1),
  });
  expect(heroSelfRanking([], [])).toEqual({ ranking: 0, rankingAlliance: 0, type: 1 });
  expect(() => heroSelfRanking([{ type: 1 }], [5002])).toThrow();
});

test("hero cache lookup performs one read-only script and rejects unavailable or invalid positions", async () => {
  const query = { member: "self", keys: ["HERO_PERSON_RANK_0_0_1", "HERO_PERSON_RANK_1_0_1"] };
  const rank = await loadHeroRankingPosition(async (name, script, count, ...args) => {
    expect(name).toBe("EVAL");
    expect(script).toContain("redis.call('ZRANK'");
    expect(script).toContain("position <= 5000");
    expect(count).toBe("2");
    expect(args).toEqual([...query.keys, "self"]);
    return "5001";
  }, query);
  expect(rank).toBe(5001);
  await expect(loadHeroRankingPosition(async () => null, query)).rejects.toThrow();
  await expect(loadHeroRankingPosition(async () => 5002, query)).rejects.toThrow();
  await expect(
    loadHeroRankingPosition(async () => {
      throw new Error("offline");
    }, query),
  ).rejects.toThrow();
});

test("hero self command routes only the authenticated owner's origin and retains correlation", async () => {
  const current = { uid: "self", serverId: 2, crossFightSrcServerId: 1, banFlag: 0, banTime: 0n };
  const db = {
    getProfileById: async () => current,
    heroRanking: async (uid: string, realm: number, activity: string, now: number) => {
      expect([uid, realm, activity, now]).toEqual(["self", 1, "activity", 1000]);
      return {
        profile: { ...current, serverId: 1, allianceId: "alliance" },
        events: [
          { type: 4, endTime: 2000n, serverGroup: "1_2" },
          { type: 1, endTime: 2000n },
        ],
      };
    },
  } as unknown as GameStore;
  const game = new Game(db, rules(), { kingdomId: 2 }, () => 1000, {
    heroRankingPosition: async (query) => (query.member === "alliance" ? 5 : 2),
  });
  const response = await game.execute("self", "hero.self.rank", {
    activityId: sfs.string("activity"),
    uid: sfs.string("foreign"),
    _cok_: sfs.int(7),
  });
  expect(response.body.ranking).toEqual(sfs.int(2));
  expect(response.body.rankingAlliance).toEqual(sfs.int(5));
  expect(response.body._cok_).toEqual(sfs.int(7));
  expect(response.pushes).toEqual([]);
  current.uid = "foreign";
  await expect(
    game.execute("self", "hero.self.rank", { activityId: sfs.string("activity") }),
  ).rejects.toThrow();
});
