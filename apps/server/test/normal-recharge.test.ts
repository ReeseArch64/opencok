import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
  normalRechargeMergeStart,
  normalRechargePeriod,
  normalRechargeNode,
  normalRechargeThresholds,
} from "@opencok/rules/normal-recharge";
import { activityOperators } from "@opencok/rules/activity-operators";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
const now = BigInt(Date.UTC(2030, 0, 2)),
  day = 86400000n;
async function fixture() {
  const rules = await loadRules();
  rules.configuration.payControl!.set("69022", {
    k1: "2.1.0",
    k2: "all",
    k5: "2030-01-01-00-00",
    k6: "2030-01-05-00-00",
    k7: "2030-01-10-00-00",
    k8: "2030-01-15-00-00",
  });
  rules.features.set("merge_recharge_event", { online: "all", test: "all", version: "1.0.0" });
  return rules;
}
test("normal recharge periods require authoritative admission and merge facts, honor precedence and preserve inclusive ends", async () => {
  const rules = await fixture(),
    server = { payTotalTime: 1n };
  for (const payTotalTime of [0n, now + 1n])
    expect(normalRechargePeriod(rules, { payTotalTime }, now)).toBeUndefined();
  expect(normalRechargePeriod(rules, server, now)?.type).toBe(1);
  expect(normalRechargePeriod(rules, server, now + 3n * day)?.type).toBe(1);
  expect(normalRechargePeriod(rules, server, now + 3n * day + 1n)).toBeUndefined();
  expect(normalRechargePeriod(rules, server, now + 8n * day)?.type).toBe(3);
  expect(normalRechargeMergeStart(rules, { ...server, lastMergeMillis: 0n }, now)).toBeUndefined();
  expect(
    normalRechargeMergeStart(rules, { ...server, lastMergeMillis: now + 1n }, now),
  ).toBeUndefined();
  const begin = normalRechargeMergeStart(rules, { ...server, lastMergeMillis: now - day }, now)!;
  expect(begin).toBe(now + 3n * day);
  const merged = { ...server, lastMergeMillis: now - day, mergeTiredRushBeginTime: begin };
  expect(normalRechargePeriod(rules, merged, now)?.type).toBe(1);
  expect(normalRechargePeriod(rules, merged, begin)?.type).toBe(4);
  expect(normalRechargePeriod(rules, merged, begin + 5n * day)?.type).toBe(4);
  expect(normalRechargePeriod(rules, merged, begin + 5n * day + 1n)?.type).toBe(3);
  rules.configuration.payControl!.set("69022", { k1: "2.1.0", k2: "close" });
  expect(normalRechargePeriod(rules, merged, begin)).toBeUndefined();
});
test("maintained heap levels are ordered, bounded and use Source float cents only for Mycard", async () => {
  const rules = await fixture();
  expect(normalRechargeThresholds(rules, 1)).toHaveLength(17);
  expect(normalRechargeThresholds(rules, 3)).toHaveLength(6);
  expect(normalRechargeThresholds(rules, 4)).toHaveLength(12);
  expect(normalRechargeNode("0.53", 2)).toBe(52n);
  expect(normalRechargeNode("1700", 1)).toBe(1700n);
  rules.advanced.normalRechargeThresholds!.set("invalid", {
    type: "1",
    level: "19",
    Node: "20000000",
    Gift: "239139",
  });
  expect(() => normalRechargeThresholds(rules, 1)).toThrow();
});
test("normal operators use saved realm facts and the trusted paid producer remains unavailable through native player commands", async () => {
  const rules = await fixture();
  rules.advanced.activityPages = new Map([["20", { id: "20", Type: "20" }]]);
  const snapshot = {
    profile: { uid: "owner", serverId: 1 },
    server: { payTotalTime: 1n },
    buildings: [],
    country: "",
    groupBuys: [],
  };
  expect(
    activityOperators(rules, snapshot, { kingdomId: 1, version: "12.06.0", now: Number(now) }),
  ).toEqual([{ id: 20, endTime: (now + 3n * day) / 1000n }]);
  expect(
    activityOperators(
      rules,
      { ...snapshot, server: { payTotalTime: 0n } },
      { kingdomId: 1, version: "12.06.0", now: Number(now) },
    ),
  ).toEqual([]);
  const game = new GameService({} as GameStore, rules, { kingdomId: 1 }, () => Number(now), {
    cityProgression: async () => {
      throw new Error("Trusted payment reached through native route");
    },
  });
  for (const command of ["normal.recharge.paid", "normal.recharge.init"])
    await expect(game.execute("owner", command, { _cok_: sfs.string("opaque") })).rejects.toThrow(
      "102192",
    );
});
