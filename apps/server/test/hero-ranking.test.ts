import { expect, test } from "bun:test";
import { heroRankingLookup, heroSelfRanking } from "@opencok/hero/rules/hero-ranking";
import { loadHeroRankingPosition } from "@opencok/hero/storage/hero-ranking";
import { heroSelfRanking as mapResult } from "@opencok/hero/mappings/hero-ranking";
import { Rules } from "@opencok/rules/game";
import { GameService as Game } from "@opencok/services/game";
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
  if (typeof personal === "number") {throw new Error();}
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

test("alliance event command routes the owner and exposes exact public member widths", async () => {
  const current = { uid: "self", serverId: 2, crossFightSrcServerId: 1, banFlag: 0 };
  const game = new Game(
    {
      getProfileById: async () => current,
      heroInsideRanking: async (uid: string, realm: number, event: string) => {
        expect([uid, realm, event]).toEqual(["self", 1, "event"]);
        return {
          profile: { ...current, serverId: 1 },
          rows: [
            {
              uid: "member",
              score: 2147483647,
              power: 9007199254740993n,
              name: "Member",
              pic: "1",
              picVer: 2,
              picfraId: 3,
              allianceId: "alliance",
              vipEndTime: 0n,
              offLineTime: 12n,
            },
          ],
        };
      },
    } as unknown as GameStore,
    rules(),
    { kingdomId: 2 },
    () => 1000,
  );
  const response = await game.execute("self", "hero.al.inside.ranking", {
    actId: sfs.string("event"),
  });
  expect(response.body.rankList).toEqual(
    sfs.array([
      sfs.object({
        uid: sfs.string("member"),
        name: sfs.string("Member"),
        pic: sfs.string("1"),
        picVer: sfs.int(2),
        picfraId: sfs.int(3),
        power: sfs.long(9007199254740993n),
        allianceId: sfs.string("alliance"),
        gmFlag: sfs.int(0),
        crossFightSrcServerId: sfs.int(-1),
        vipLevel: sfs.int(0),
        svipLevel: sfs.int(0),
        offLineTime: sfs.long(12n),
        rank: sfs.int(1),
        score: sfs.int(2147483647),
      }),
    ]),
  );
});

test("hero history reads completed publications with rank rewards, deduplication and realm presentation", async () => {
  const catalog = rules();
  catalog.ranking.heroEvents = new Map([["rule", { rankreward: "11;12|21;22", ranklist: "1|10" }]]);
  const current = { uid: "self", serverId: 2, crossFightSrcServerId: 1, banFlag: 0 };
  const queried: string[][] = [];
  const game = new Game(
    {
      getProfileById: async () => current,
      heroHistory: async (uid: string, realm: number, type: number, now: number) => {
        expect([uid, realm, type, now]).toEqual(["self", 1, 3, 1000]);
        return {
          profile: { ...current, serverId: 1 },
          active: { eventId: "rule" },
          castleLevel: 2,
          alliancePower: 0n,
          events: [
            { eventId: "old", type: 3, endTime: 2000n, serverGroup: "1_2", kingdomRank: "2|1" },
            {
              eventId: "duplicate-time",
              type: 3,
              endTime: 2000n,
              serverGroup: "1_2",
              kingdomRank: "2|1",
            },
          ],
        };
      },
      heroHistoryPresentation: async (alliances: string[], realms: number[]) => {
        expect(alliances).toEqual([]);
        expect(realms).toEqual([2, 1]);
        return { alliances: [], realms: [{ id: 2, name: "Two", banner: "b" }] };
      },
      getPlayerSummariesByIds: async (uids: string[]) => {
        queried.push(uids);
        return [
          {
            data: { uid: "member", name: "Member", pic: "1", picVer: 0, picfraId: 0, abbr: "AL" },
            kingdomId: 2,
            remote: true,
          },
        ];
      },
    } as unknown as GameStore,
    catalog,
    { kingdomId: 2 },
    () => 1000,
    {
      heroHistoryPublication: async (keys, alliance) => {
        expect(keys).toEqual(["KINGDOM_PERSON_RANK_1_1_2_2", "KINGDOM_PERSON_RANK_1_1_2_2"]);
        expect(alliance).toBe(false);
        return keys.map(() => ({ members: ["member", "missing"], alliances: [] }));
      },
    },
  );
  const response = await game.execute("self", "hero.event.ranking.his.get", {
    type: sfs.int(3),
    _cok_: sfs.int(7),
  });
  expect(queried).toEqual([["member", "missing"]]);
  expect(response.body._cok_).toEqual(sfs.int(7));
  expect(response.body.history).toEqual(
    sfs.array([
      sfs.object({
        eventId: sfs.string("duplicate-time"),
        endTime: sfs.long(2000n),
        userList: sfs.array([
          sfs.object({
            uid: sfs.string("member"),
            rewardId: sfs.string("21"),
            rank: sfs.int(1),
            name: sfs.string("Member"),
            server: sfs.int(2),
            pic: sfs.string("1"),
            picVer: sfs.int(0),
            picfraId: sfs.int(0),
            abbr: sfs.string("AL"),
          }),
          sfs.object({ uid: sfs.string("missing"), rewardId: sfs.string("22"), rank: sfs.int(2) }),
        ]),
        kingdomList: sfs.array([
          sfs.object({
            id: sfs.int(2),
            rank: sfs.int(1),
            name: sfs.string("Two"),
            banner: sfs.string("b"),
          }),
          sfs.object({ id: sfs.int(1), rank: sfs.int(2) }),
        ]),
      }),
    ]),
  );
});

test("history cache retains ascending rank order and missing alliance metadata without writes", async () => {
  const { loadHeroHistoryPublication } = await import("@opencok/hero/storage/hero-ranking");
  const keys = ["HERO_ALLIANCE_RANK_0_0_1"];
  const result = await loadHeroHistoryPublication(
    async (name, script, count, key, mode) => {
      expect([name, count, key, mode]).toEqual(["EVAL", "1", keys[0]!, "1"]);
      expect(script).toContain("'ZRANGE', key, 0, 9");
      expect(script).not.toMatch(/ZADD|DEL|HSET/);
      return [
        [
          ["a", "b"],
          [null, '{"name":"B"}'],
        ],
      ];
    },
    keys,
    true,
  );
  expect(result).toEqual([{ members: ["a", "b"], alliances: [null, '{"name":"B"}'] }]);
  await expect(
    loadHeroHistoryPublication(
      async () => [
        [
          ["a", "a"],
          [null, null],
        ],
      ],
      keys,
      true,
    ),
  ).rejects.toThrow();
  await expect(loadHeroHistoryPublication(async () => [[["a"], []]], keys, true)).rejects.toThrow();
});

test("history power bands retain integer division and reward thresholds", async () => {
  const { heroHistoryBand, heroHistoryRewards } = await import("@opencok/hero/rules/hero-ranking");
  const catalog = rules();
  catalog.ranking.heroEvents = new Map([["rule", { rankreward: "1;2|3", ranklist: "1|10" }]]);
  expect(heroHistoryBand(2, 0, 0n, catalog)).toBe(-1);
  expect(heroHistoryBand(2, 0, 1999n, catalog)).toBe(0);
  expect(heroHistoryBand(4, 0, 2000n, catalog)).toBe(1);
  expect(heroHistoryBand(1, 40, 0n, catalog)).toBe(39);
  expect(heroHistoryRewards(catalog, "rule", 1).slice(0, 2)).toEqual(["3", "0"]);
  expect(() => heroHistoryRewards(catalog, "absent", 1)).toThrow();
});
