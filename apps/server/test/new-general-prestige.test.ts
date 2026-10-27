import { expect, test } from "bun:test";
import { Rules } from "@opencok/rules/game";
import { newGeneralPrestigeLevel } from "@opencok/hero/rules/new-general-prestige";

function fixture() {
  const rules = new Rules(new Map(), new Map(), new Map());
  const rows = [{ civilizationType: 2, prestigeValue: 100n }];
  const level = (type = 2) => newGeneralPrestigeLevel(type, rows, rules);
  return { rules, rows, level };
}

test("official prestige uses the selected civilization without a feature gate and defaults absent records or catalogs to zero", () => {
  const f = fixture();
  expect(f.level()).toBe(0);
  f.rules.power.prestigeLevelRecords = [{ reputation_point: "100", reputation_level: "7" }];
  expect(f.level()).toBe(7);
  expect(f.level(1)).toBe(0);
  f.rows[0]!.civilizationType = 0;
  expect(f.level(0)).toBe(7);
  expect(
    newGeneralPrestigeLevel(null, [{ civilizationType: null, prestigeValue: 100n }], f.rules),
  ).toBe(7);
  f.rows.length = 0;
  f.rules.power.prestigeLevelRecords = [{ reputation_point: "bad" }];
  expect(f.level()).toBe(0);
});

test("prestige thresholds preserve negative single boundaries and half-open Long intervals", () => {
  const f = fixture();
  const cases: [string, bigint, number][] = [
    ["0", -1n, 7],
    ["0", 0n, 0],
    ["0", 1n, 0],
    ["-10", -11n, 7],
    ["-10", -10n, 0],
    ["-10", -9n, 0],
    ["10", 9n, 0],
    ["10", 10n, 7],
    ["10", 11n, 7],
    ["-10;10", -10n, 7],
    ["-10;10", 9n, 7],
    ["-10;10", 10n, 0],
    ["9007199254740993;9223372036854775807", 9007199254740992n, 0],
    ["9007199254740993;9223372036854775807", 9007199254740993n, 7],
    ["9007199254740993;9223372036854775807", 9223372036854775807n, 0],
    ["9223372036854775807", 9223372036854775807n, 7],
    ["-9223372036854775808", -9223372036854775808n, 0],
    ["10;0", 5n, 0],
    ["1;2;3", 2n, 0],
    ["", 0n, 0],
    ["\u2000", 0n, 0],
  ];
  for (const [range, value, expected] of cases) {
    f.rules.power.prestigeLevelRecords = [{ reputation_point: range, reputation_level: "7" }];
    f.rows[0]!.prestigeValue = value;
    expect(f.level()).toBe(expected);
  }
  f.rules.power.prestigeLevelRecords = [
    { reputation_point: ";;０;;２００", reputation_level: "+７" },
  ];
  expect(newGeneralPrestigeLevel(2, [{ civilizationType: 2, prestigeValue: null }], f.rules)).toBe(
    7,
  );
});

test("prestige keeps the first matching catalog record including duplicate IDs and the first saved civilization", () => {
  const f = fixture();
  f.rules.power.prestigeLevels = new Map([
    ["same", { reputation_point: "1", reputation_level: "9" }],
  ]);
  expect(f.level()).toBe(9);
  f.rules.power.prestigeLevelRecords = [
    { id: "same", reputation_point: "1", reputation_level: "3" },
    { id: "same", reputation_point: "1", reputation_level: "9" },
    { id: "last", reputation_point: "bad" },
  ];
  expect(f.level()).toBe(3);
  f.rows.unshift({ civilizationType: 2, prestigeValue: 0n });
  f.rules.power.prestigeLevelRecords = [
    { reputation_point: "0;1", reputation_level: "2" },
    { reputation_point: "1", reputation_level: "3" },
  ];
  expect(f.level()).toBe(2);
  f.rules.power.prestigeLevelRecords = [];
  expect(f.level()).toBe(0);
});

test("prestige parses all range members but only parses a level after its range matches", () => {
  const f = fixture();
  f.rules.power.prestigeLevelRecords = [
    { reputation_point: "200", reputation_level: "bad" },
    { reputation_point: "100", reputation_level: "5" },
  ];
  expect(f.level()).toBe(5);
  for (const range of [
    "100;",
    "100;200;bad",
    " 100",
    "9223372036854775808",
    "-9223372036854775809",
  ]) {
    f.rules.power.prestigeLevelRecords = [{ reputation_point: range, reputation_level: "5" }];
    expect(() => f.level()).toThrow();
  }
  for (const level of [undefined, "bad", "2147483648"]) {
    f.rules.power.prestigeLevelRecords = [
      { reputation_point: "100", ...(level === undefined ? {} : { reputation_level: level }) },
    ];
    expect(() => f.level()).toThrow();
  }
});

test("saved prestige width and collection limits reject invalid state without conversion or mutation", () => {
  const f = fixture();
  const before = structuredClone(f.rows);
  f.rules.power.prestigeLevelRecords = [{ reputation_point: "100", reputation_level: "7" }];
  expect(f.level()).toBe(7);
  expect(f.rows).toEqual(before);
  f.rows[0]!.prestigeValue = 9223372036854775808n;
  expect(() => f.level()).toThrow();
  expect(() => newGeneralPrestigeLevel(2147483648, [], f.rules)).toThrow();
  expect(() => newGeneralPrestigeLevel(2, Array(4097).fill(before[0]), f.rules)).toThrow();
});
