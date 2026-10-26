import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
  monsterExchangeConfig,
  monsterExchangeHeader,
  readMonsterExchangeHeader,
  readMonsterExchangeOffers,
  monsterExchangeOffersText,
  selectMonsterExchangeOffers,
  monsterExchangeClaims,
  monsterExchangeBoundary,
  monsterExchangeLegacyMatches,
} from "@opencok/rules/monster-exchange";
test("seven complete token panels retain their native reward quantities, colors, clocks and legacy signatures", async () => {
  const rules = await loadRules(),
    configs = [];
  for (const panel of rules.power.activityPanels!.values()) {
    if (panel.exchange !== "1") continue;
    try {
      configs.push(monsterExchangeConfig(panel));
    } catch {}
  }
  expect(configs).toHaveLength(7);
  for (const config of configs) {
    const offers = selectMonsterExchangeOffers(config, () => 0);
    expect(offers).toHaveLength(config.gears.length);
    expect(readMonsterExchangeOffers(monsterExchangeOffersText(offers))).toEqual(offers);
    expect(readMonsterExchangeHeader(monsterExchangeHeader(config))).toEqual({
      token: config.token,
      interval: config.interval,
    });
  }
  const source = configs.find((config) => config.id === "57171")!;
  expect(
    configs
      .filter((config) =>
        monsterExchangeLegacyMatches(
          selectMonsterExchangeOffers(source, () => 0),
          config,
        ),
      )
      .map((config) => config.id),
  ).toEqual(["57171", "57180"]);
  for (const id of ["57096", "57150", "57201"])
    expect(() => monsterExchangeConfig(rules.power.activityPanels!.get(id)!)).toThrow();
});
test("weighted token offers preserve every configured boundary and reject invalid random draws", async () => {
  const rules = await loadRules(),
    config = monsterExchangeConfig(rules.power.activityPanels!.get("57209")!);
  let boundary = 0;
  for (const choice of config.gears[0]!) {
    let calls = 0;
    expect(selectMonsterExchangeOffers(config, () => (calls++ === 0 ? boundary : 0))[0]).toEqual({
      reward: choice.reward,
      count: choice.count,
      color: choice.color,
    });
    boundary += choice.weight;
  }
  expect(() => selectMonsterExchangeOffers(config, (maximum) => maximum)).toThrow();
});
test("token offer and claim parsers preserve legacy optional color and ordered claims while rejecting invalid state", () => {
  expect(readMonsterExchangeOffers("247012;6|249682;1250;1")).toEqual([
    { reward: "247012", count: 6, color: 0 },
    { reward: "249682", count: 1250, color: 1 },
  ]);
  expect(monsterExchangeClaims("3,1,5", 5)).toEqual([3, 1, 5]);
  for (const raw of ["1,1", "0", "6", "1,", "-1"])
    expect(() => monsterExchangeClaims(raw, 5)).toThrow();
  for (const raw of ["", "247012;0", "x;1", "247012;1;0;1"])
    expect(() => readMonsterExchangeOffers(raw)).toThrow();
  expect(() => readMonsterExchangeHeader("monster-exchange:v1:211658:0")).toThrow();
});
test("token clock alignment skips long outages directly and retains the native ten-second manual refresh grace", () => {
  const checkpoint = 1000000n,
    interval = 60000n;
  expect(monsterExchangeBoundary(checkpoint, interval, checkpoint + 20001n * interval + 999n)).toBe(
    checkpoint + 20001n * interval,
  );
  expect(
    monsterExchangeBoundary(checkpoint, interval, checkpoint + interval - 10000n, 10000n),
  ).toBe(checkpoint + interval - 10000n);
  expect(() =>
    monsterExchangeBoundary(checkpoint, interval, checkpoint + interval - 10001n, 10000n),
  ).toThrow();
  expect(() => monsterExchangeBoundary(checkpoint, 0n, checkpoint)).toThrow();
});
