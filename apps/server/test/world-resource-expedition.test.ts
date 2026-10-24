import { expect, test } from "bun:test";
import type { Row } from "@opencok/contracts/rows";
import type { GameServices } from "@opencok/contracts/game";
import { Cache } from "@opencok/storage/session";
import { Rules } from "@opencok/rules/game";
import { resourceMergeServer } from "@opencok/rules/world-resource-effects";
import { readResourceExpeditionLoadEffect } from "@opencok/controllers/world-resource-expedition";

class StageCache extends Cache {
  calls: string[][] = [];
  response: unknown = null;
  fail = false;
  constructor() {
    super({ kingdomId: 1, redisUrl: "redis://unused.invalid", timeoutMs: 1000 });
  }
  override async command(command: string, ...args: string[]) {
    this.calls.push([command, ...args]);
    if (this.fail) throw new Error("Synthetic stage failure");
    return this.response;
  }
}

function fixture() {
  const rules = new Rules(new Map(), new Map(), new Map());
  for (const key of ["tech_newEffect", "17_wk"])
    rules.features.set(key, { version: "99.0.0", online: "2", test: "3" });
  rules.items.set("merge_server", { k5: "1;4" });
  const profile: Row = { serverId: 2, crossFightSrcServerId: -1 };
  const cache = new StageCache();
  cache.response = '{"serverId":2,"status":"COLLECT_STATE"}';
  const services: Pick<GameServices, "expeditionStage"> = {
    expeditionStage: (realm) => cache.expeditionStage(realm),
  };
  const state = { effects: 0, failEffect: false, value: 0.1 };
  const resolve = () =>
    readResourceExpeditionLoadEffect(
      profile,
      rules,
      { kingdomId: 2, now: 1000, version: "0.0.0" },
      services,
      (effect) => {
        expect(effect).toBe(895);
        state.effects++;
        if (state.failEffect) throw new Error("Synthetic effect failure");
        return state.value;
      },
    );
  return { rules, profile, cache, services, state, resolve };
}

test("expedition stage reads the existing realm pairing record and preserves every saved stage without inferring dates", async () => {
  const cache = new StageCache();
  const stages = [
    "WAITING_STATE",
    "MATCHING_STATE",
    "PREPARING_STATE",
    "COLLECT_STATE",
    "KILL_MONSTER_STATE",
    "BUILDING_STATE",
    "SCIENCE_STATE",
    "TRAIN_ARMY_STATE",
    "FIGHTING_STATE",
  ];
  for (const [stage, status] of stages.entries()) {
    cache.response = JSON.stringify({
      serverId: 2,
      status,
      matchServerId: -1,
      startTime: 9999999999999,
      endTime: -1,
    });
    expect(await cache.expeditionStage(2)).toBe(stage);
  }
  expect(cache.calls).toEqual(Array(9).fill(["GET", "opencok:global:expedition-match:2"]));
  cache.response = '{"serverId":1,"status":"COLLECT_STATE"}';
  expect(await cache.expeditionStage()).toBe(3);
  expect(cache.calls.at(-1)).toEqual(["GET", "opencok:global:expedition-match:1"]);
});

test("absent stage data stays unavailable while invalid identities, statuses and oversized payloads reject", async () => {
  const cache = new StageCache();
  expect(await cache.expeditionStage(2)).toBeUndefined();
  cache.response = '{"serverId":2,"matchServerId":3}';
  expect(await cache.expeditionStage(2)).toBeUndefined();
  for (const response of [
    "null",
    "[]",
    "{}",
    "invalid",
    3,
    "x".repeat(65536),
    '{"serverId":1,"status":"COLLECT_STATE"}',
    '{"serverId":"2","status":"COLLECT_STATE"}',
    ...[null, 3, "3", "collect_state", "COLLECT_STATE ", "toString", "__proto__"].map((status) =>
      JSON.stringify({ serverId: 2, status }),
    ),
  ]) {
    cache.response = response;
    await expect(cache.expeditionStage(2)).rejects.toThrow();
  }
  cache.calls.length = 0;
  for (const realm of [0, -1, NaN, 1.5, 2147483648])
    await expect(cache.expeditionStage(realm)).rejects.toThrow();
  expect(cache.calls).toEqual([]);
});

test("merge configuration parses all Java integer members and preserves whole-separator and blank semantics", () => {
  const rules = fixture().rules;
  for (const k5 of ["2", ";;1;;+２;4", "1;2;2;4"]) {
    rules.items.set("merge_server", { k5 });
    expect(resourceMergeServer(rules, 2)).toBe(true);
  }
  for (const k5 of [undefined, "", "\u2000", "1;4", "-2;0"]) {
    rules.items.set("merge_server", k5 === undefined ? {} : { k5 });
    expect(resourceMergeServer(rules, 2)).toBe(false);
  }
  for (const k5 of ["2;bad", "2;", " 2", "2147483648", "-2147483649"]) {
    rules.items.set("merge_server", { k5 });
    expect(() => resourceMergeServer(rules, 2)).toThrow();
  }
  rules.items.clear();
  expect(() => resourceMergeServer(rules, 2)).toThrow();
});

test("stage and owner-origin gates resolve through the cache adapter before effect 895", async () => {
  const f = fixture();
  expect(await f.resolve()).toBe(Math.fround(0.1));
  expect(f.cache.calls).toEqual([["GET", "opencok:global:expedition-match:2"]]);
  expect(f.state.effects).toBe(1);
  f.profile.serverId = 99;
  f.profile.crossFightSrcServerId = 2;
  expect(await f.resolve()).toBe(Math.fround(0.1));
  f.profile.serverId = 2;
  for (const origin of [0, -2, 99, null]) {
    f.profile.crossFightSrcServerId = origin;
    expect(await f.resolve()).toBe(0);
  }
  f.profile.crossFightSrcServerId = -1;
  f.profile.serverId = null;
  expect(await f.resolve()).toBe(0);
  expect(f.state.effects).toBe(2);
});

test("closed features, configured merges and replacement mode skip stage reads including their failures", async () => {
  for (const key of ["tech_newEffect", "17_wk"]) {
    const f = fixture();
    f.rules.features.delete(key);
    f.rules.items.clear();
    f.cache.fail = true;
    expect(await f.resolve()).toBe(0);
    expect(f.cache.calls).toEqual([]);
  }
  const f = fixture();
  f.rules.items.set("merge_server", { k5: "2" });
  expect(await f.resolve()).toBe(0);
  f.rules.items.set("merge_server", {});
  f.rules.features.set("wk_switch_new", { version: "99.0.0", online: "2" });
  expect(await f.resolve()).toBe(0);
  expect(f.cache.calls).toEqual([]);
  expect(f.state.effects).toBe(0);
});

test("unknown or noncollection stages skip malformed owner fields and effect resolution", async () => {
  const f = fixture();
  f.profile.crossFightSrcServerId = "bad";
  for (const response of [null, '{"serverId":2}', '{"serverId":2,"status":"FIGHTING_STATE"}']) {
    f.cache.response = response;
    expect(await f.resolve()).toBe(0);
  }
  expect(f.state.effects).toBe(0);
  f.cache.response = '{"serverId":2,"status":"COLLECT_STATE"}';
  expect(await f.resolve()).toBe(0);
  expect(f.state.effects).toBe(0);
});

test("failed cache, malformed merge data and effect errors stay within the expedition zero fallback", async () => {
  const f = fixture();
  f.cache.fail = true;
  expect(await f.resolve()).toBe(0);
  f.cache.fail = false;
  f.cache.response = "invalid";
  expect(await f.resolve()).toBe(0);
  f.rules.items.set("merge_server", { k5: "2;bad" });
  f.cache.calls.length = 0;
  expect(await f.resolve()).toBe(0);
  expect(f.cache.calls).toEqual([]);
  f.rules.items.set("merge_server", {});
  f.cache.response = '{"serverId":2,"status":"COLLECT_STATE"}';
  f.state.failEffect = true;
  expect(await f.resolve()).toBe(0);
  f.state.failEffect = false;
  for (const value of [-2.5, NaN, Infinity]) {
    f.state.value = value;
    expect(await f.resolve()).toBe(value);
  }
  delete f.services.expeditionStage;
  expect(await f.resolve()).toBe(0);
});
