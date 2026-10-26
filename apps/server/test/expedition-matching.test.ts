import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
  expeditionMatchingConfiguration,
  expeditionMatchWeight,
  expeditionMatchPairs,
  expeditionMatchStats,
} from "@opencok/rules/expedition-matching";
import type { ExpeditionMatchRealm } from "@opencok/contracts/expedition-matching";
function realm(kingdomId: number, previousMatch = 0): ExpeditionMatchRealm {
  return {
    kingdomId,
    previousMatch,
    stats: {
      topAlliancePower: 0,
      topUserPower: "1000",
      over30: 10,
      over26: 2,
      over10M: 0,
      r5: 0,
      victories: 0,
      failures: 0,
    },
  };
}
const seed = "1234567890abcdef1234567890abcdef";
test("expedition pairs are reciprocal, stable after recovery and never fabricate an opponent for a singleton", async () => {
  const config = expeditionMatchingConfiguration(await loadRules()),
    cohort = [realm(1), realm(2), realm(3)],
    first = expeditionMatchPairs(cohort, config, seed);
  expect(expeditionMatchPairs(cohort, config, seed)).toEqual(first);
  expect(first.filter((x) => x.opponent > 0)).toHaveLength(2);
  expect(first.filter((x) => x.opponent === 0)).toHaveLength(1);
  for (const row of first.filter((x) => x.opponent > 0))
    expect(first.find((x) => x.kingdomId === row.opponent)!.opponent).toBe(row.kingdomId);
  expect(expeditionMatchPairs([realm(1)], config, seed)).toEqual([{ kingdomId: 1, opponent: 0 }]);
  expect(
    expeditionMatchPairs([realm(1, 2), realm(2, 1)], config, seed).every((x) => x.opponent === 0),
  ).toBe(true);
});
test("weighted matching retains the native asymmetric castle comparison and float zero-power behavior", async () => {
  const original = expeditionMatchingConfiguration(await loadRules()),
    config = { ...original, weights: [1, 2, 4, 8, 16, 32, 64, 128] },
    a = realm(1),
    b = realm(2);
  b.stats.over26 = 10;
  b.stats.over10M = 1;
  expect(expeditionMatchWeight(a, b, config)).toBe(245);
  a.stats.topUserPower = "0";
  b.stats.topUserPower = "0";
  expect(expeditionMatchWeight(a, b, config)).toBe(244);
  a.stats.topUserPower = "9007199254740993";
  b.stats.topUserPower = "9007199254740992";
  expect(expeditionMatchWeight(a, b, config)).toBe(245);
});
test("rematch filtering follows the top-choice cutoff and permits a later realm to choose a deferred candidate", async () => {
  const config = { ...expeditionMatchingConfiguration(await loadRules()), choices: 1 },
    first = realm(1, 2),
    second = realm(2, 1),
    third = realm(3);
  expect(expeditionMatchPairs([first, second, third], config, seed)).toEqual([
    { kingdomId: 1, opponent: 3 },
    { kingdomId: 2, opponent: 0 },
    { kingdomId: 3, opponent: 1 },
  ]);
  expect(
    expeditionMatchPairs([realm(1), realm(2)], { ...config, window: 0 }, seed).every(
      (x) => x.opponent === 0,
    ),
  ).toBe(true);
});
test("matching rejects duplicate realms, malformed configuration and unsafe persisted power", async () => {
  const config = expeditionMatchingConfiguration(await loadRules());
  expect(() => expeditionMatchPairs([realm(1), realm(1)], config, seed)).toThrow();
  expect(() => expeditionMatchPairs([realm(1)], { ...config, weights: [NaN] }, seed)).toThrow();
  expect(() =>
    expeditionMatchStats({ ...realm(1).stats, topUserPower: "9223372036854775808" }),
  ).toThrow();
  expect(() => expeditionMatchPairs([realm(1)], config, "invalid")).toThrow();
  expect(
    expeditionMatchStats({ ...realm(1).stats, topUserPower: "9007199254740993" }).topUserPower,
  ).toBe("9007199254740992");
  expect(
    expeditionMatchStats({ ...realm(1).stats, topUserPower: "9223372036854775807" }).topUserPower,
  ).toBe("9223372036854775807");
});
