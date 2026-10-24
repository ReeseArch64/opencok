import { expect, test } from "bun:test";
import { Rules } from "@opencok/rules/game";
import { luckyDayEffects } from "@opencok/rules/power-lucky-day";

const context = { now: Date.UTC(2026, 9, 23, 12), kingdomId: 1, version: "12.06.0" };
const profile = { pf: "synthetic-market" };
const lucky = { status: 1, time: BigInt(context.now + 600000), lucky_id: 1, effectId: "8001" };
const server = { lastMergeMillis: 0n };

function fixture() {
  const rules = new Rules(
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
    { payControl: new Map() },
    { activityPanels: new Map(), mergeActivities: new Map(), luckyEffects: new Map() },
  );
  rules.features.set("luckyday_server", {
    id: "luckyday_server",
    version: "99.0.0",
    online: "1",
    test: "1",
  });
  rules.configuration.payControl!.set("69028", {
    id: "69028",
    k1: "12.06.0",
    k2: "1;3-5",
    k3: "all",
    k4: "1",
    k72: "1",
    k107: "1",
  });
  rules.power.activityPanels!.set("57091", {
    id: "57091",
    function_on: "1",
    start: "2026-10-23-12-00",
    end: "2026-10-23-12-05",
  });
  rules.power.luckyEffects!.set("8001", { id: "8001", effect: "487;10|218;-2|487;15" });
  return rules;
}

test("lucky-day projections retain persisted effects and last duplicate values without rerolling", () => {
  const rules = fixture();
  const before = structuredClone(lucky);
  expect(luckyDayEffects(profile, lucky, server, rules, context)).toEqual(
    new Map([
      [487, 15],
      [218, -2],
    ]),
  );
  expect(luckyDayEffects(profile, lucky, server, rules, context)).toEqual(
    new Map([
      [487, 15],
      [218, -2],
    ]),
  );
  expect(lucky).toEqual(before);
});

test("lucky-day event selectors preserve Unicode ranges and repeated hyphens separately from function-on gates", () => {
  const rules = fixture();
  const control = rules.configuration.payControl!.get("69028")!;
  for (const selector of ["--١--٢--", "1;bad", "3-2147483648;1"]) {
    control.k2 = selector;
    expect(luckyDayEffects(profile, lucky, server, rules, context).get(487)).toBe(15);
  }
  control.k2 = "3-2147483648";
  expect(luckyDayEffects(profile, lucky, server, rules, context).size).toBe(0);
  for (const selector of ["bad;1", "1-2-3"]) {
    control.k2 = selector;
    expect(() => luckyDayEffects(profile, lucky, server, rules, context)).toThrow();
  }
  expect(
    luckyDayEffects(profile, lucky, server, rules, { ...context, testServer: true }).get(487),
  ).toBe(15);
  rules.features.get("luckyday_server")!.online = "close";
  expect(luckyDayEffects(profile, lucky, server, rules, context).size).toBe(0);
});

test("lucky-day eligibility combines server availability, player version, realm, platform and both test switches", () => {
  const rules = fixture();
  const control = rules.configuration.payControl!.get("69028")!;
  for (const [key, value] of [
    ["k1", "13.0.0"],
    ["k2", "2"],
    ["k3", "other"],
    ["k4", "0"],
  ]) {
    const old = control[key!]!;
    control[key!] = value!;
    expect(luckyDayEffects(profile, lucky, server, rules, context).size).toBe(0);
    control[key!] = old;
  }
  control.k3 = "other;synthetic-market;";
  expect(luckyDayEffects(profile, lucky, server, rules, context).get(487)).toBe(15);
  control.k3 = "synthetic";
  expect(luckyDayEffects(profile, lucky, server, rules, context).size).toBe(0);
  control.k3 = "all";
  control.k2 = "close";
  expect(
    luckyDayEffects(profile, lucky, server, rules, { ...context, testServer: true }).get(487),
  ).toBe(15);
  for (const key of ["k72", "k107"]) {
    control[key] = "0";
    expect(
      luckyDayEffects(profile, lucky, server, rules, { ...context, testServer: true }).size,
    ).toBe(0);
    control[key] = "1";
  }
  rules.features.clear();
  expect(
    luckyDayEffects(profile, lucky, server, rules, { ...context, testServer: true }).size,
  ).toBe(0);
});

test("ordinary activity windows include both endpoints and honor the configured UTC offset", () => {
  const rules = fixture();
  for (const [offset, open] of [
    [-1, false],
    [0, true],
    [300000, true],
    [300001, false],
  ] as const)
    expect(
      luckyDayEffects(profile, lucky, server, rules, { ...context, now: context.now + offset! })
        .size > 0,
    ).toBe(open);
  const panel = rules.power.activityPanels!.get("57091")!;
  panel.start = "2026-10-23-09-00";
  panel.end = "2026-10-23-09-05";
  expect(
    luckyDayEffects(profile, lucky, server, rules, { ...context, utcOffsetMinutes: -180 }).get(487),
  ).toBe(15);
  panel.start = "2026-02-30-09-00";
  expect(luckyDayEffects(profile, lucky, server, rules, context).size).toBe(0);
  panel.function_on = "0";
  expect(luckyDayEffects(profile, lucky, server, rules, context).size).toBe(0);
});

test("merge schedules use minute offsets with an exclusive end and bypass the ordinary panel switch", () => {
  const rules = fixture();
  rules.power.activityPanels!.get("57091")!.function_on = "0";
  rules.power.mergeActivities!.set("1", { id: "1", activityId: "other", merge_start: "invalid" });
  rules.power.mergeActivities!.set("2", {
    id: "2",
    activityId: "57091",
    merge_start: "10",
    merge_end: "20",
  });
  for (const [elapsed, open] of [
    [599999, false],
    [600000, true],
    [1199999, true],
    [1200000, false],
  ] as const) {
    const merged = { lastMergeMillis: BigInt(context.now - elapsed!) };
    expect(luckyDayEffects(profile, lucky, merged, rules, context).size > 0).toBe(open);
  }
  expect(luckyDayEffects(profile, lucky, server, rules, context).size).toBe(0);
  rules.power.activityPanels!.get("57091")!.function_on = "1";
  expect(
    luckyDayEffects(
      profile,
      lucky,
      { lastMergeMillis: BigInt(context.now + 1) },
      rules,
      context,
    ).get(487),
  ).toBe(15);
});

test("absent, inactive and expired records contribute nothing and preserve exact long deadlines", () => {
  const rules = fixture();
  for (const row of [
    undefined,
    { ...lucky, status: 0 },
    { ...lucky, lucky_id: 0 },
    { ...lucky, time: BigInt(context.now) },
  ])
    expect(luckyDayEffects(profile, row, undefined, rules, context).size).toBe(0);
  expect(
    luckyDayEffects(profile, { ...lucky, time: 9007199254740993n }, server, rules, context).get(
      487,
    ),
  ).toBe(15);
  expect(() =>
    luckyDayEffects(profile, { ...lucky, time: "9223372036854775808" }, server, rules, context),
  ).toThrow();
});

test("active dependency gaps and malformed effect vectors fail rather than inventing zero bonuses", () => {
  const rules = fixture();
  expect(() => luckyDayEffects(profile, lucky, undefined, rules, context)).toThrow();
  expect(() => luckyDayEffects(profile, lucky, { lastMergeMillis: 1n }, rules, context)).toThrow();
  rules.power.luckyEffects!.clear();
  expect(() => luckyDayEffects(profile, lucky, server, rules, context)).toThrow();
  for (const effect of ["487", "487;1.5", "487;2147483648", "invalid;1"]) {
    rules.power.luckyEffects!.set("8001", { id: "8001", effect });
    expect(() => luckyDayEffects(profile, lucky, server, rules, context)).toThrow();
  }
  rules.power.luckyEffects!.set("8001", { id: "8001", effect: "" });
  expect(luckyDayEffects(profile, lucky, server, rules, context).size).toBe(0);
  rules.power.luckyEffects!.set("8001", { id: "8001", effect: "|487;;8;ignored|218;-2|" });
  expect(luckyDayEffects(profile, lucky, server, rules, context)).toEqual(
    new Map([
      [487, 8],
      [218, -2],
    ]),
  );
});

test("lucky-day player versions retain direct Java comparison before realm and event state", () => {
  const rules = fixture();
  const control = rules.configuration.payControl!.get("69028")!;
  for (const version of ["13", ".12..6.0.1", "１２.６.０"])
    expect(luckyDayEffects(profile, lucky, server, rules, { ...context, version }).get(487)).toBe(
      15,
    );
  for (const version of ["", "\u2000", "12.6", "13.bad"])
    expect(() => luckyDayEffects(profile, lucky, server, rules, { ...context, version })).toThrow();
  control.k2 = "bad";
  expect(luckyDayEffects(profile, lucky, server, rules, { ...context, version: "11" }).size).toBe(
    0,
  );
  delete control.k1;
  expect(() => luckyDayEffects(profile, lucky, server, rules, context)).toThrow();
  rules.features.get("luckyday_server")!.online = "close";
  expect(luckyDayEffects(profile, lucky, server, rules, context).size).toBe(0);
});

test("lucky-day panel dates normalize fields and retain independent minus-one parse fallbacks", () => {
  const rules = fixture();
  const panel = rules.power.activityPanels!.get("57091")!;
  panel.start = "2026-9-53-12-00suffix";
  expect(luckyDayEffects(profile, lucky, server, rules, context).get(487)).toBe(15);
  panel.start = "bad";
  expect(luckyDayEffects(profile, lucky, server, rules, context).get(487)).toBe(15);
  panel.end = "bad";
  expect(luckyDayEffects(profile, lucky, server, rules, context).size).toBe(0);
  expect(luckyDayEffects(profile, lucky, server, rules, { ...context, now: -1 }).get(487)).toBe(15);
  expect(luckyDayEffects(profile, lucky, server, rules, { ...context, now: 0 }).size).toBe(0);
  delete panel.start;
  expect(luckyDayEffects(profile, lucky, server, rules, { ...context, now: -1 }).size).toBe(0);
});
