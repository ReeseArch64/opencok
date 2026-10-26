import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { heroScoreDelta, heroScoreInteger } from "@opencok/rules/hero-score";
import { heroScoreFlags } from "@opencok/rules/hero-event";
test("hero scoring uses the configured action and parameter pairs and signed power changes", async () => {
  const rules = await loadRules();
  rules.ranking.heroEvents!.set("synthetic", { id: "synthetic", score: "47075|47077|47078|47009" });
  expect(
    heroScoreDelta(rules, { eventId: "synthetic" }, [
      { type: 8, parameter: "1", count: 2n, at: 1n },
      { type: 8, parameter: "2", count: 100n, at: 1n },
      { type: 9, parameter: "1", count: 3n, at: 1n },
      { type: 9, parameter: "2", count: 1n, at: 1n },
      { type: 4, parameter: "107000", count: 7n, at: 1n },
      { type: 4, parameter: "107100", count: 1n, at: 1n },
      { type: 4, parameter: "foreign", count: 999n, at: 1n },
    ]),
  ).toBe(5082n);
  expect(heroScoreInteger(-2147483648n)).toBe(-2147483648);
  expect(() => heroScoreInteger(-2147483649n)).toThrow();
  expect(() => heroScoreInteger(2147483648n)).toThrow();
  expect(heroScoreFlags({ rewardFlag: "-1,1,0,1" })).toBe("0,1");
});
test("every maintained hero event resolves its scoring rules without needing private runtime catalogs", async () => {
  const rules = await loadRules();
  for (const rule of rules.ranking.heroEvents!.values())
    expect(heroScoreDelta(rules, { eventId: rule.id! }, [])).toBe(0n);
});
