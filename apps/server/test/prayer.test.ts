import { test, expect } from "bun:test";
import { prayerHit, prayerSteel } from "@opencok/rules/prayer";
import { loadRules } from "@opencok/resources/rules";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("prayer first-hit and weighted intervals preserve reference boundaries and float steel arithmetic", () => {
  expect([0, 1, 2].map((roll) => prayerHit(true, [], () => roll))).toEqual([2, 5, 10]);
  const weights = [6300, 2000, 1200, 500];
  expect(
    [0, 6299, 6300, 8299, 8300, 9499, 9500, 9999].map((roll) =>
      prayerHit(false, weights, () => roll),
    ),
  ).toEqual([1, 1, 2, 2, 5, 5, 10, 10]);
  expect(() => prayerHit(false, weights, () => 10000)).toThrow();
  expect(prayerSteel(100, 50)).toBe(150);
});
test("native prayer reads and actions preserve long correlation and keep item-credit and login producers internal", async () => {
  const rules = await loadRules(),
    game = new GameService({} as GameStore, rules, { kingdomId: 1 }, () => 1000, {
      cityProgression: async () => ({ body: {}, pushes: [] }),
    });
  for (const command of ["user.pray.info", "user.pray"])
    expect(
      (await game.execute("owner", command, { _cok_: sfs.long(9007199254740993n) })).body._cok_,
    ).toEqual(sfs.long(9007199254740993n));
  await expect(game.execute("owner", "prayer.item", { count: sfs.int(999999) })).rejects.toThrow();
  await expect(game.execute("owner", "prayer.init", {})).rejects.toThrow();
});
