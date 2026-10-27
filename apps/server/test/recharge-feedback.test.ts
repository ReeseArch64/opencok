import { loadRules } from "@opencok/resources/rules";
import { test, expect } from "bun:test";
import { feedbackPrice, feedbackWindow } from "@opencok/rules/recharge-feedback";
import { Rules } from "@opencok/rules/game";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("feedback derives exact nominal cents from consistent catalogs and honors inclusive dated controls", () => {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.advanced.castleExchanges = new Map([
    ["1", { product_id: "gold_8", dollar: "0.99" }],
    ["2", { product_id: "gold_8", dollar: "0.99" }],
  ]);
  expect(feedbackPrice(rules, "gold_8")).toBe(99);
  expect(feedbackPrice(rules, "missing")).toBeUndefined();
  rules.advanced.castleExchanges.set("3", { product_id: "gold_8", dollar: "1.99" });
  expect(feedbackPrice(rules, "gold_8")).toBeUndefined();
  rules.configuration.payControl = new Map([
    ["69025", { k1: "1.0.0", k2: "all", k4: "1", k5: "2026-10-25-00-00", k6: "2026-10-26-00-00" }],
  ]);
  const context = { kingdomId: 1, version: "12.06.0", now: Date.UTC(2026, 9, 26) };
  expect(feedbackWindow(rules, context)?.active).toBe(true);
  expect(feedbackWindow(rules, { ...context, now: context.now + 1 })?.active).toBe(false);
});
test("native feedback queries retain correlation and paid callbacks cannot be invoked publicly", async () => {
  const game = new GameService(
    {} as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    { cityProgression: async () => ({ body: {}, pushes: [] }) },
  );
  expect(
    (await game.execute("owner", "pay.recharge.ui.state", { _cok_: sfs.long(9007199254740993n) }))
      .body._cok_,
  ).toEqual(sfs.long(9007199254740993n));
  await expect(game.execute("owner", "feedback.paid", {})).rejects.toThrow();
});

test("the maintained empty feedback catalog remains a valid disabled configuration", async () => {
  const rules = await loadRules();
  expect(rules.advanced.rechargeFeedback?.size).toBe(0);
  expect(
    feedbackWindow(rules, { kingdomId: 1, version: "12.06.0", now: Date.UTC(2026, 9, 25) })?.active,
  ).toBe(false);
});
