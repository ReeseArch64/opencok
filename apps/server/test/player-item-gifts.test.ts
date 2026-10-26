import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { playerItemGiftTarget } from "@opencok/rules/player-item-gifts";
import { playerItemGiftLogin } from "@opencok/mappings/player-item-gifts";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { Rules } from "@opencok/rules/game";
import { sfs, Type } from "@opencok/messages/sfs";
test("gift definitions require the maintained give-item type and login uses paired native string arrays", async () => {
  const rules = await loadRules();
  expect(playerItemGiftTarget(rules, "210059")).toBe("210052");
  expect(() => playerItemGiftTarget(rules, "210052")).toThrow();
  expect(() => playerItemGiftLogin(["Synthetic"], [])).toThrow();
  const view = playerItemGiftLogin(["Synthetic, sender"], ["210059"]);
  expect(Object.keys(view)).toEqual(["item_allname", "item_allitemId"]);
  expect(view.item_allname).toEqual({ type: Type.StringArray, value: ["Synthetic, sender"] });
});
test("native gift sending preserves long correlations and cannot invoke receipt delivery directly", async () => {
  const game = new GameService(
    {} as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    { cityProgression: async () => ({ body: { result: sfs.bool(true) }, pushes: [] }) },
  );
  expect(
    (
      await game.execute("owner", "item.send", {
        uid: sfs.string("other"),
        itemId: sfs.string("210059"),
        _cok_: sfs.long(9007199254740993n),
      })
    ).body._cok_,
  ).toEqual(sfs.long(9007199254740993n));
  await expect(game.execute("owner", "gift.init", {})).rejects.toThrow();
});
