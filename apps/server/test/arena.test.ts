import { test, expect } from "bun:test";
import { arenaArmySelection, arenaRankDelta } from "@opencok/rules/arena";
import { Rules } from "@opencok/rules/game";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";

test("arena selections retain virtual roster deltas and enforce canonical identifiers and total capacity", () => {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.items.set("fight_arena", { id: "fight_arena", k9: "200000" });
  rules.arms.set("107000", { id: "107000", arm: "1" });
  rules.arms.set("107100", { id: "107100", arm: "2" });
  expect(arenaArmySelection(rules, "107100;10", [{ armyId: "107000", count: 20 }])).toEqual([
    { armyId: "107000", count: 20 },
    { armyId: "107100", count: 10 },
  ]);
  for (const value of ["107000;200001", "107000;1|107000;2", "0107000;1", "107000,10", "107000;-1"])
    expect(() => arenaArmySelection(rules, value, [])).toThrow();
  expect(arenaRankDelta(30, 100, true)).toBe(0);
  expect(arenaRankDelta(100, 100, true)).toBe(10);
  expect(arenaRankDelta(100, 100, false)).toBe(5);
  expect(arenaRankDelta(0, 0, false)).toBe(0);
  expect(() => arenaRankDelta(101, 100, true)).toThrow();
});

test("native arena requests retain correlation while match and result messages remain internal", async () => {
  const calls: string[] = [];
  const game = new GameService(
    {} as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    {
      cityProgression: async (_owner, command) => {
        calls.push(command);
        return { body: { ok: sfs.bool(true) }, pushes: [] };
      },
    },
  );
  for (const command of [
    "arena.info",
    "arena.apply",
    "arena.army",
    "show.arena.army",
    "arena.enter",
    "arena.leave",
  ])
    expect((await game.execute("owner", command, { _cok_: sfs.long(7n) })).body._cok_).toEqual(
      sfs.long(7n),
    );
  await expect(game.execute("owner", "arena.matched", {})).rejects.toThrow();
  await expect(game.execute("owner", "arena.finished", {})).rejects.toThrow();
  expect(calls).toHaveLength(6);
});
