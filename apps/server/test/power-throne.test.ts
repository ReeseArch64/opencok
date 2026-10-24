import { expect, test } from "bun:test";
import { Cache } from "@opencok/storage/session";
import { Rules } from "@opencok/rules/game";
import { personalThroneEffect } from "@opencok/rules/power-throne";

class ThroneCache extends Cache {
  response: unknown = null;
  calls: string[][] = [];
  constructor(kingdomId = 2) {
    super({ kingdomId, redisUrl: "redis://unused.invalid", timeoutMs: 1000 });
  }
  override async command(command: string, ...args: string[]) {
    this.calls.push([command, ...args]);
    return this.response;
  }
}

function fixture() {
  return new Rules(
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    1,
    new Map(),
    {},
    {
      monarchTitles: new Map([
        ["1001", { id: "1001", effect: "487|218|487", num: "1.5|10|2.5" }],
        ["1002", { id: "1002", effect: "487", num: "-1.25" }],
      ]),
    },
  );
}

test("emperor cache distinguishes absent state, explicit no-emperor state and an exact version", async () => {
  const cache = new ThroneCache();
  expect(await cache.emperorVersion()).toBeUndefined();
  cache.response = "none";
  expect(await cache.emperorVersion()).toBeNull();
  for (const version of [0, 7, -1, 2147483647, -2147483648]) {
    cache.response = String(version);
    expect(await cache.emperorVersion()).toBe(version);
  }
  expect(
    cache.calls.every(
      (call) =>
        JSON.stringify(call) === JSON.stringify(["GET", "opencok:kingdom:2:emperor-version"]),
    ),
  ).toBe(true);
  const other = new ThroneCache(1);
  await other.emperorVersion();
  expect(other.calls).toEqual([["GET", "opencok:kingdom:1:emperor-version"]]);
});

test("explicit destination realm routes emperor reads without changing the local realm default", async () => {
  const cache = new ThroneCache(1);
  cache.response = "7";
  expect(await cache.emperorVersion(2)).toBe(7);
  expect(await cache.emperorVersion()).toBe(7);
  expect(cache.calls).toEqual([
    ["GET", "opencok:kingdom:2:emperor-version"],
    ["GET", "opencok:kingdom:1:emperor-version"],
  ]);
  for (const kingdomId of [0, -1, NaN, 1.5])
    await expect(cache.emperorVersion(kingdomId)).rejects.toThrow();
  expect(cache.calls).toHaveLength(2);
});

test("malformed or cross-realm emperor inputs reject before returning a fabricated version", async () => {
  const cache = new ThroneCache();
  for (const response of [1, "", "01", "-0", " 1", "1.5", "2147483648", "-2147483649", {}, []]) {
    cache.response = response;
    await expect(cache.emperorVersion()).rejects.toThrow();
  }
  for (const id of [0, -1, 1.5, Number.NaN]) {
    const invalid = new ThroneCache(id);
    await expect(invalid.emperorVersion()).rejects.toThrow();
    expect(invalid.calls).toEqual([]);
  }
});

test("personal throne bonuses select the emperor version and add every matching reward in order", () => {
  const rules = fixture();
  const rows = [
    { version: 6, rewardId: 9999 },
    { version: 7, rewardId: 1001 },
    { version: 7, rewardId: 1002 },
  ];
  const before = structuredClone(rows);
  expect(personalThroneEffect(rows, 7, rules, 487, 5)).toBe(7.75);
  expect(personalThroneEffect(rows, 7, rules, 218, 5)).toBe(15);
  expect(personalThroneEffect(rows, 8, rules, 487, 5)).toBe(5);
  expect(personalThroneEffect(rows, null, rules, 487, 5)).toBe(5);
  expect(personalThroneEffect([], undefined, rules, 487, 5)).toBe(5);
  expect(rows).toEqual(before);
});

test("throne pairs stop at the shorter vector and round each contribution as a float", () => {
  const rules = fixture();
  const rule = { id: "1001", effect: "487||487|218", num: "1||1" };
  rules.power.monarchTitles!.set("1001", rule);
  const rows = [{ version: 7, rewardId: 1001 }];
  expect(personalThroneEffect(rows, 7, rules, 487, 16777216)).toBe(16777216);
  rule.effect = "487";
  rule.num = "0.1|invalid-unused";
  expect(personalThroneEffect(rows, 7, rules, 487, 0)).toBe(Math.fround(0.1));
});

test("unknown emperor state, missing titles and malformed active values fail explicitly", () => {
  const rules = fixture();
  const rows = [{ version: 7, rewardId: 1001 }];
  expect(() => personalThroneEffect(rows, undefined, rules, 487, 0)).toThrow();
  expect(() => personalThroneEffect(rows, Number.NaN, rules, 487, 0)).toThrow();
  expect(() => personalThroneEffect(Array(4097).fill(rows[0]), 7, rules, 487, 0)).toThrow();
  rules.power.monarchTitles!.clear();
  expect(() => personalThroneEffect(rows, 7, rules, 487, 0)).toThrow();
  rules.power.monarchTitles!.set("1001", { id: "1001", effect: "218|487", num: "Infinity|1" });
  expect(() => personalThroneEffect(rows, 7, rules, 487, 0)).toThrow();
});
