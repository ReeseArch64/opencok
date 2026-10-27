import { expect, test } from "bun:test";
import { loadThroneRankingPeriod } from "@opencok/storage/throne-ranking";
import { throneRanking, throneRankingBoard } from "@opencok/mappings/throne-ranking";
import { GameService as Game } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { Rules } from "@opencok/rules/game";
import { sfs, fields, type Value } from "@opencok/messages/sfs";

const period = { index: 7, info: '{"isCrossOpen":true}' };
const rows = Array.from({ length: 21 }, (_, i) => ({
  uid: `player-${i}`,
  totalKills: 9007199254740993n - BigInt(i),
  totalDeads: 4n,
  name: "Synthetic",
  allianceName: "Alliance",
  abbr: "AL",
  serverId: 1,
  kingdomName: "Realm",
}));

test("throne cache selects the maximum positive period with bounded validated state", async () => {
  const value = await loadThroneRankingPeriod(async (...args) => {
    expect(args).toEqual(["HGETALL", "fight_of_king_inf2"]);
    return ["1", "{}", "7", period.info, "2", "{}"];
  }, 2);
  expect(value).toEqual(period);
  expect(await loadThroneRankingPeriod(async () => [], 2)).toBeUndefined();
  for (const response of [["1"], ["bad", "{}"], ["2147483648", "{}"], ["1", "x".repeat(8193)]])
    {await expect(loadThroneRankingPeriod(async () => response, 2)).rejects.toThrow();}
});

test("throne boards preserve the nineteen-entry boundary, exact longs and absent-self tail position", () => {
  const result = throneRankingBoard({ period, rows }, 1, "player-20")!;
  expect(result.list?.value).toHaveLength(19);
  expect(result.selfRank).toEqual(sfs.int(21));
  expect(fields((result.list!.value as Value[])[0]).killCount).toEqual(sfs.long(9007199254740993n));
  expect(throneRankingBoard({ period, rows }, 2, "")!.selfRank).toEqual(sfs.int(21));
  expect(throneRankingBoard({ period, rows: [] }, 1, "self")!.selfRank).toEqual(sfs.int(0));
  expect(throneRankingBoard({ period: { index: 1, info: "{}" }, rows }, 1, "self")).toBeUndefined();
  expect(() =>
    throneRankingBoard({ period: { index: 1, info: '{"isCrossOpen":1}' }, rows }, 1, "self"),
  ).toThrow();
  expect(throneRanking([])).toEqual({ rank: sfs.array([]) });
});

test("throne dispatch gates paired realms and skips closed peers without requesting their database", async () => {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.features.set("wk_switch", { online: "all", version: "1.0.0" });
  const calls: number[] = [];
  const db = {
    getProfileById: async () => ({ uid: "self", serverId: 1, banFlag: 0 }),
    throneRanking: async (realm: number) => {
      calls.push(realm);
      return { period, rows };
    },
  } as unknown as GameStore;
  const game = new Game(db, rules, { kingdomId: 1 }, () => 1000, {
    throneRankingPeriod: async (realm) =>
      realm === 1 ? undefined : { index: 7, info: '{"isCrossOpen":false}' },
  });
  const response = await game.execute("self", "ctf.get.rank", { _cok_: sfs.int(2) });
  expect(calls).toEqual([1]);
  expect(response.body.rank?.value).toHaveLength(1);
  expect(response.body._cok_).toEqual(sfs.int(2));
  expect(response.pushes).toEqual([]);
  await game.execute("self", "ctf.get.rank", { serverId: sfs.int(3) });
  expect(calls).toEqual([1]);
  await expect(game.execute("self", "ctf.get.rank", { serverId: sfs.int(0) })).rejects.toThrow();
});
