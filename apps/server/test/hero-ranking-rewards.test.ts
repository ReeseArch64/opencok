import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { heroRankPrize, heroRankAwardIdentity } from "@opencok/rules/hero-ranking-rewards";
import { pinProgressionReward } from "../../../packages/services/src/progression-rewards";
import { mailRewardEntries } from "@opencok/rules/mail-rewards";
test("hero ranking boundaries select funded tiers or the native personal consolation message", async () => {
  const rules = await loadRules(),
    base = rules.ranking.heroEvents!.get("9001000")!;
  rules.ranking.heroEvents!.set("synthetic", { ...base, ranklist: "1|5", rankreward: "246192;0" });
  const event = { eventId: "synthetic", type: 1 };
  expect(heroRankPrize(event, { rank: 1, level: 0 }, rules)).toEqual({
    rewardId: "246192",
    template: "11639",
  });
  expect(heroRankPrize(event, { rank: 5, level: 0 }, rules)).toEqual({
    rewardId: "0",
    template: "11639",
  });
  expect(heroRankPrize(event, { rank: 6, level: 0 }, rules)).toEqual({
    rewardId: null,
    template: "11684",
  });
  expect(heroRankPrize({ ...event, type: 3 }, { rank: 1000, level: 0 }, rules)).toEqual({
    rewardId: null,
    template: "11685",
  });
  expect(heroRankPrize(event, { rank: 1001, level: 0 }, rules)).toBeUndefined();
  expect(heroRankPrize({ ...event, type: 2 }, { rank: 6, level: 0 }, rules)).toBeUndefined();
  expect(heroRankPrize({ ...event, type: 4 }, { rank: 1, level: 0 }, rules)?.template).toBe(
    "11670",
  );
  expect(() => heroRankPrize(event, { rank: 0, level: 0 }, rules)).toThrow();
  expect(heroRankAwardIdentity("a", "bc", "d")).not.toBe(heroRankAwardIdentity("ab", "c", "d"));
});
test("every maintained hero ranking reward pins to claimable mail goods", async () => {
  const rules = await loadRules(),
    ids = new Set(
      [...rules.ranking.heroEvents!.values()]
        .flatMap((row) => (row.rankreward ?? "").split(/[|;]/))
        .filter((id) => id && id !== "0"),
    );
  expect(ids.size).toBeGreaterThan(0);
  for (const id of ids) {
    const reward = mailRewardEntries(pinProgressionReward({ rules, now: BigInt(Date.now()) }, id));
    expect(reward.length).toBeGreaterThan(0);
    expect(reward.every((row) => row.category === "goods" && rules.goods.has(row.itemId))).toBe(
      true,
    );
  }
});
