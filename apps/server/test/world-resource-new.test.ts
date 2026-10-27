import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
  parseWorldResourceNewClock,
  worldResourceNewFootprint,
  worldResourceNewSettings,
  worldResourceNewSlots,
} from "@opencok/rules/world-resource-new";

test("shared resources retain the dormant Source calendar and native footprint without enabling the event", async () => {
  const rules = await loadRules();
  expect(worldResourceNewSlots(rules, () => 0)).toBe(5);
  expect(worldResourceNewSettings(rules, BigInt(Date.UTC(2030, 0, 1)))).toMatchObject({
    open: false,
    quota: 0,
    amount: 1000,
    lifetime: 14400000n,
  });
  expect(worldResourceNewFootprint(7, 5)).toEqual([7, 6, 2, 1]);
  for (const point of [0, 1, 5, 6, 11, 26]) expect(worldResourceNewFootprint(point, 5)).toEqual([]);
  const item = rules.items.get("on_event2")!;
  rules.items.set("on_event2", { ...item, k9: "2030-01-01-00-00", k10: "2030-01-02-00-00" });
  expect(worldResourceNewSettings(rules, BigInt(Date.UTC(2030, 0, 1)))!.open).toBe(true);
  expect(worldResourceNewSettings(rules, BigInt(Date.UTC(2030, 0, 2)))!.open).toBe(true);
  expect(worldResourceNewSettings(rules, BigInt(Date.UTC(2030, 0, 2)) + 1n)!.open).toBe(false);
});

test("shared resource slot draws preserve Source count-as-weight and independent cumulative draws", async () => {
  const rules = await loadRules(),
    item = rules.items.get("on_event2")!;
  rules.items.set("on_event2", { ...item, k12: "5;10;15" });
  for (const [sequence, expected] of [
    [[0], 5],
    [[29, 0], 10],
    [[29, 29, 29], 15],
  ] as const) {
    let index = 0;
    expect(
      worldResourceNewSlots(rules, (maximum) => {
        expect(maximum).toBe(30);
        return sequence[index++]!;
      }),
    ).toBe(expected);
    expect(index).toBe(sequence.length);
  }
  rules.items.delete("on_event3");
  expect(
    worldResourceNewSlots(rules, () => {
      throw new Error("Unexpected draw");
    }),
  ).toBe(0);
});

test("shared resource cursors reject malformed, unversioned and out-of-realm bounds before recovery", () => {
  expect(
    parseWorldResourceNewClock('{"version":1,"areaCursor":1,"nextRefreshAt":"0"}', 577),
  ).toEqual({ version: 1, areaCursor: 1, nextRefreshAt: "0" });
  for (const value of [
    "null",
    "[]",
    "{}",
    '{"version":2,"areaCursor":1,"nextRefreshAt":"0"}',
    '{"version":1,"areaCursor":578,"nextRefreshAt":"0"}',
    '{"version":1,"areaCursor":1,"nextRefreshAt":"9007199254740992"}',
    '{"version":1,"areaCursor":1,"nextRefreshAt":"0","extra":0}',
  ])
    expect(() => parseWorldResourceNewClock(value, 577)).toThrow();
});
