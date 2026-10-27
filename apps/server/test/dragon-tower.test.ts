import { test, expect } from "bun:test";
import {
  towerArmy,
  towerMonsterChoices,
  towerWeekStart,
  towerIndex,
  towerOpen,
} from "@opencok/rules/dragon-tower";
import { loadRules } from "@opencok/resources/rules";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { Rules } from "@opencok/rules/game";
import { sfs } from "@opencok/messages/sfs";
test("tower catalogs retain weighted monster choices, bounded virtual armies and native layer indexes", async () => {
  const rules = await loadRules();
  expect(towerMonsterChoices(rules, 84501, () => 0)).toBe("84140|83820|83500");
  expect(() => towerMonsterChoices(rules, 84501, () => -1)).toThrow();
  expect([...towerArmy('{"107000":10,"107100":0}')]).toEqual([["107000", 10]]);
  for (const value of [
    '{"107000":-1}',
    '{"107000":1.5}',
    '{"__proto__":1}',
    "[]",
    "null",
    "broken",
  ])
    expect(() => towerArmy(value)).toThrow();
  expect(towerOpen(new Rules(new Map(), new Map(), new Map()), {}, 0, 0n, 1000n)).toBe(false);
  expect(towerIndex(0)).toBe(0);
  expect(towerIndex(84501)).toBe(1);
  expect(towerWeekStart(BigInt(Date.UTC(2027, 0, 1, 12)))).toBe(BigInt(Date.UTC(2027, 0, 1)));
  expect(towerWeekStart(BigInt(Date.UTC(2026, 9, 27, 12)))).toBe(BigInt(Date.UTC(2026, 9, 26)));
});
test("tower native commands retain correlation and internal recovery cannot be requested by players", async () => {
  const calls: string[] = [];
  const game = new GameService(
    {} as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    {
      cityProgression: async (_, command) => {
        calls.push(command);
        return { body: {}, pushes: [] };
      },
    },
  );
  expect(
    (
      await game.execute("owner", "dragontower", {
        M__REQUEST_ID__H: sfs.string("entertower"),
        _cok_: sfs.long(7n),
      })
    ).body._cok_,
  ).toEqual(sfs.long(7n));
  await expect(game.execute("owner", "dragontower.init", {})).rejects.toThrow();
  await expect(game.execute("owner", "dragontower.tick", {})).rejects.toThrow();
  expect(calls).toEqual(["dragontower"]);
});
