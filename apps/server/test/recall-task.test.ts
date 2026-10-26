import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("recall task native reads and claims preserve correlation while login and counter producers stay internal", async () => {
  const rules = await loadRules();
  expect(rules.advanced.recallTasks!.get("9040007")!.num).toBe("2000");
  expect(rules.advanced.recallTasks!.get("9040007")!.extend_type).toBe("1");
  const game = new GameService({} as GameStore, rules, { kingdomId: 1 }, () => 1000, {
    cityProgression: async () => ({ body: {}, pushes: [] }),
  });
  for (const command of ["recall.task.ui", "recall.task.receive"]) {
    expect(
      (
        await game.execute("owner", command, {
          id: sfs.string("9040007"),
          _cok_: sfs.long(9007199254740993n),
        })
      ).body._cok_,
    ).toEqual(sfs.long(9007199254740993n));
  }
  await expect(game.execute("owner", "recall.task.init", {})).rejects.toThrow();
  await expect(
    game.execute("owner", "recall.task.progress", { num: sfs.int(99999) }),
  ).rejects.toThrow();
});
