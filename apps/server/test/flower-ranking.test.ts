import { expect, test } from "bun:test";
import { flowerRankingRefresh } from "@opencok/rules/flower-ranking";
import { loadFlowerRanking } from "@opencok/storage/flower-ranking";
import { flowerRanking, flowerRankingEntries } from "@opencok/mappings/flower-ranking";
import { sfs, fields, type Value } from "@opencok/messages/sfs";

const now = Date.UTC(2026, 9, 25, 12, 0, 0, 123);

test("flower refresh preserves the missing-time Long sentinel, Sunday calendar behavior and elapsed periods", () => {
  expect(flowerRankingRefresh(now, undefined, 1)).toBe(
    BigInt.asIntN(64, BigInt(now) + 9223372036854775807n),
  );
  expect(flowerRankingRefresh(now, 0n, 1)).toBe(BigInt(Date.UTC(2026, 10, 2, 0, 0, 0, 123)));
  expect(flowerRankingRefresh(now, 0n, 2)).toBe(BigInt(Date.UTC(2026, 10, 1, 0, 0, 0, 123)));
  expect(flowerRankingRefresh(now, 0n, 3)).toBe(BigInt(now));
  expect(flowerRankingRefresh(now, BigInt(now), 3)).toBe(BigInt(now) + 1209600000n);
});

test("flower publication reads local and global state together and preserves absent-self fallback", async () => {
  const result = await loadFlowerRanking(
    async (name, script, count, ...args) => {
      expect(name).toBe("EVAL");
      expect(script).toContain("redis.call('HGET'");
      expect(count).toBe("4");
      expect(args).toEqual([
        "flower_ranking_2",
        "flower_ranking_self_2",
        "flower_global_rank_1",
        "flower_global_rank_2",
        "self",
        "2",
      ]);
      return [['{"uid":"self","scoreVal":8}'], "", ['{"uid":"self","rank":4}', " "]];
    },
    2,
    "self",
    2,
    true,
  );
  expect(result.selfRank).toBe(5001);
  expect(result.global).toHaveLength(1);
  await expect(
    loadFlowerRanking(async () => [[], "2147483648", []], 2, "self", 2, false),
  ).rejects.toThrow();
  await expect(loadFlowerRanking(async () => [[], "", [3]], 2, "self", 2, true)).rejects.toThrow();
});

test("flower rows hydrate current profiles, skip missing identities and preserve global visibility", () => {
  const local = [
    '{"uid":"missing","scoreVal":3}',
    '{"uid":"self","scoreVal":8}',
    '{"uid":"self","scoreVal":9}',
  ];
  expect(flowerRankingEntries(local)).toHaveLength(3);
  const state = {
    profile: { uid: "self" },
    profiles: [{ uid: "self", name: "Current", pic: "", picVer: 2, picfraId: 3 }],
    hide: 1,
    time: 0n,
  };
  const publication = {
    local,
    selfRank: 4,
    global: ['{"uid":"self","rank":2}', '{"uid":"self","rank":7}'],
  };
  const result = flowerRanking(publication, state, "self", 1n, true);
  expect(result.flowerRanking?.value).toHaveLength(2);
  expect(fields((result.flowerRanking!.value as Value[])[0]).name).toEqual(sfs.string("Current"));
  expect(result.selfRanking).toEqual(sfs.int(4));
  expect(result.myGRank).toEqual(sfs.int(7));
  expect(result.myHide).toEqual(sfs.int(1));
  expect(flowerRanking(publication, state, "self", 1n, false)).not.toHaveProperty("rankGlobal");
  expect(() => flowerRankingEntries(['{"uid":"self","scoreVal":9007199254740993}'])).toThrow();
});

test("flower command routes local presentation to the origin and reads visibility from the executing realm", async () => {
  const { GameService: Game } = await import("@opencok/services/game");
  const { Rules } = await import("@opencok/rules/game");
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.items.set("ranking", { k2: "2" });
  rules.items.set("flowers", { k5: "3" });
  rules.features.set("flowers_all_sev", { online: "all", version: "1.0.0" });
  const current = { uid: "self", serverId: 2, crossFightSrcServerId: 1, banFlag: 0 };
  const calls: number[] = [];
  const db = {
    getProfileById: async () => current,
    crossRankingRealm: async () => true,
    flowerRanking: async (uid: string, realm: number) => {
      expect(uid).toBe("self");
      calls.push(realm);
      return {
        profile: { ...current, serverId: realm },
        profiles: [{ uid: "self", name: "Self", pic: "", picVer: 0, picfraId: 0 }],
        hide: realm === 2 ? 1 : 0,
        time: BigInt(now),
      };
    },
  } as unknown as import("@opencok/contracts/game").GameStore;
  const game = new Game(db, rules, { kingdomId: 2 }, () => now, {
    flowerRankingPublication: async (realm, uid, limit, global) => {
      expect([realm, uid, limit, global]).toEqual([1, "self", 2, true]);
      return { local: ['{"uid":"self","scoreVal":3}'], selfRank: 1, global: [] };
    },
  });
  const result = await game.execute("self", "flower.ranking", { _cok_: sfs.int(3) });
  expect(calls).toEqual([1, 2]);
  expect(result.body.myHide).toEqual(sfs.int(1));
  expect(result.body._cok_).toEqual(sfs.int(3));
  expect(result.pushes).toEqual([]);
});
