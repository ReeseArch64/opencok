import { test, expect } from "bun:test";
import { temporaryEffect } from "@opencok/rules/player-effects";
import { loadRules } from "@opencok/resources/rules";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("overlap-five counters retain their original deadline and reset at the configured count", async () => {
  const rules = await loadRules();
  const first = temporaryEffect([], rules, "owner", "509877", 1000n, 1, () => 0),
    original = first.states[0]!;
  const second = temporaryEffect(first.states, rules, "owner", "509877", 2000n, 1, () => 0)
    .states[0]!;
  expect(second.count).toBe(2);
  expect(second.endTime).toBe(original.endTime);
  expect(
    temporaryEffect([{ ...second, count: 60 }], rules, "owner", "509877", 3000n, 1, () => 0)
      .states[0]!.count,
  ).toBe(1);
  expect(temporaryEffect([], rules, "owner", "509877", 1000n, 4, () => 0).states[0]!.count).toBe(4);
  const game = new GameService({} as GameStore, rules, { kingdomId: 1 }, () => 1000, {
    cityProgression: async () => ({ body: { type: sfs.int(44) }, pushes: [] }),
  });
  expect(
    (
      await game.execute("owner", "trigger.activity", {
        type: sfs.int(44),
        _cok_: sfs.long(9007199254740993n),
      })
    ).body._cok_,
  ).toEqual(sfs.long(9007199254740993n));
  await expect(game.execute("owner", "campaign.action", { event: sfs.int(54) })).rejects.toThrow();
});
