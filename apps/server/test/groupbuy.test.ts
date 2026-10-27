import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
  groupBuyPeriod,
  groupBuyProducts,
  groupBuyRounds,
  groupBuyTiers,
} from "@opencok/rules/groupbuy";
import { GameService } from "@opencok/services/game";
import { groupBuyOperation } from "@opencok/services/groupbuy";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("group-buy rounds preserve midnight anchoring, configured count, cutoff and native product definitions", async () => {
  const rules = await loadRules();
  rules.power.activityPanels!.set("57133", { start: "2023-01-01-08-30", end: "2023-01-03-00-00" });
  const period = groupBuyPeriod(rules)!;
  expect(period.rounds).toHaveLength(2);
  expect(period.start).toBe(BigInt(Date.UTC(2023, 0, 1)));
  expect(period.rounds[0]!.cTime).toBe(Date.UTC(2023, 0, 1, 23));
  expect(groupBuyProducts(rules).map((product) => product.point)).toEqual([1, 5]);
  expect(groupBuyTiers(rules, 1).at(-1)).toMatchObject({ level: 1000, mail: "12036" });
  expect(groupBuyRounds(JSON.stringify(period.rounds))).toEqual([...period.rounds]);
  expect(() => groupBuyRounds('[{"sTime":2,"eTime":1,"cTime":1,"flag":0}]')).toThrow();
});
test("only the native group-buy query is exposed and it retains LONG correlation", async () => {
  const rules = await loadRules(),
    game = new GameService({} as GameStore, rules, { kingdomId: 1 }, () => 1000, {
      cityProgression: async () => ({ body: {}, pushes: [] }),
    });
  expect(
    (await game.execute("owner", "groupbuys.info", { _cok_: sfs.long(9007199254740993n) })).body
      ._cok_,
  ).toEqual(sfs.long(9007199254740993n));
  for (const command of [
    "groupbuys.reserve",
    "groupbuys.paid",
    "groupbuys.cancel",
    "groupbuys.close",
    "groupbuys.settle",
  ])
    {await expect(game.execute("owner", command, {})).rejects.toThrow();}
  expect(groupBuyOperation("paid", "order")).not.toBe(groupBuyOperation("reserve", "order"));
});
