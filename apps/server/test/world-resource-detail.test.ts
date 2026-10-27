import { expect, test } from "bun:test";
import {
  resourceLongFloat,
  resourceRemaining,
  resourceArmyLoad,
  resourceCollected,
  resourceOwnerDetail,
  resourceGroupDetail,
} from "@opencok/rules/world-resource-detail";
import { worldResourceOwner, worldResourceGroup } from "@opencok/mappings/world-resource-detail";
import type {
  WorldResourceCollection,
  WorldResourceMarch,
} from "@opencok/contracts/world-resource-detail";
import { Rules } from "@opencok/rules/game";
import { sfs, Type, encode, decode } from "@opencok/messages/sfs";
import oracle from "./fixtures/world-resource-detail.json";

function bits(value: number): number {
  const bytes = Buffer.alloc(4);
  bytes.writeFloatBE(value);
  return bytes.readInt32BE();
}
function float(value: number): number {
  const bytes = Buffer.alloc(4);
  bytes.writeInt32BE(value);
  return bytes.readFloatBE();
}
function doubleBits(value: number): string {
  const bytes = Buffer.alloc(8);
  bytes.writeDoubleBE(value);
  return bytes.readBigUInt64BE().toString(16);
}
const march = (patch: Partial<WorldResourceMarch> = {}): WorldResourceMarch => ({
  collectSpd: 1,
  marchArrivalTime: 1000n,
  armyLoad: 100,
  maxCollectTime: 999n,
  collectedBeforeSpd: 3,
  changeCollectSpdTime: 9007199254740993n,
  occupyResourceEndTime: 9223372036854775807n,
  ...patch,
});
const rules = () => {
  const value = new Rules(new Map(), new Map(), new Map());
  value.items.set("resources_weight", { k1: "1", k2: "2", k3: "3", k4: "4", k5: "5", k6: "6" });
  return value;
};

test("direct long-to-float rounding matches 1809 Java cases including double-rounding counterexamples", () => {
  expect(oracle.longFloat).toHaveLength(1809);
  let naiveDifferences = 0;
  for (const [raw, expected] of oracle.longFloat as [string, number][]) {
    expect(bits(resourceLongFloat(BigInt(raw)))).toBe(expected);
    if (bits(Math.fround(Number(BigInt(raw)))) !== expected) {naiveDifferences++;}
  }
  expect(naiveDifferences).toBeGreaterThan(0);
  for (const value of [-9223372036854775809n, 9223372036854775808n])
    {expect(() => resourceLongFloat(value)).toThrow();}
});

test("remaining quantity and elapsed collection match 2129 frozen Java arithmetic cases", () => {
  expect(oracle.remaining).toHaveLength(81);
  expect(oracle.collections).toHaveLength(2048);
  for (const [initial, cost, expected] of oracle.remaining as number[][])
    {expect(resourceRemaining(initial!, cost!)).toBe(expected!);}
  for (const [type, remaining, load, rate, now, arrival, expected] of oracle.collections as [
    number,
    number,
    number,
    number,
    string,
    string,
    number,
  ][]) {
    expect(
      resourceCollected(
        type,
        remaining,
        { armyLoad: load, collectSpd: float(rate), marchArrivalTime: BigInt(arrival) },
        BigInt(now),
      ),
    ).toBe(expected);
  }
});

test("owner resource quantity matches 384 Java cases with truncation before float multiplication", () => {
  expect(oracle.owners).toHaveLength(384);
  for (const [type, remaining, load, rate, maximum, expected] of oracle.owners as [
    number,
    number,
    number,
    number,
    string,
    number,
  ][]) {
    const input = march({
      armyLoad: load,
      collectSpd: float(rate),
      maxCollectTime: BigInt(maximum),
    });
    const result = resourceOwnerDetail(type, remaining, input);
    expect(result.quantity).toBe(expected);
    expect(bits(result.speed)).toBe(rate);
    expect(result.remaining).toBe(remaining);
    expect(result.startTime).toBe(1000n);
    const projected = worldResourceOwner(result);
    expect(projected.q).toEqual(sfs.int(expected));
    expect(projected.spd!.type).toBe(Type.Float);
    expect(decode(encode(projected))).toEqual(projected);
  }
});

test("new-resource aggregation matches 128 Java cases with per-march clocks and float/int accumulation", () => {
  type Vector = [number, [number, string, number][], string[], [number, number, string] | null];
  expect(oracle.groups).toHaveLength(128);
  for (const [remaining, rows, clocks, expected] of oracle.groups as Vector[]) {
    const input = rows.map(([rate, arrival, load]) => ({
      collectSpd: float(rate),
      marchArrivalTime: BigInt(arrival),
      armyLoad: load,
    }));
    let read = 0;
    const detail = resourceGroupDetail(remaining, input, () => BigInt(clocks[read++]!));
    expect(read).toBe(clocks.length);
    if (expected === null) {expect(detail).toBeUndefined();}
    else {
      expect(bits(detail!.speed)).toBe(expected[0]);
      expect(detail!.remaining).toBe(expected[1]);
      expect(doubleBits(detail!.sampledAt)).toBe(expected[2]);
      const wire = worldResourceGroup(detail);
      expect(wire.spd!.type).toBe(Type.Float);
      expect(wire.sdt!.type).toBe(Type.Double);
      expect(decode(encode(wire))).toEqual(wire);
    }
  }
});

test("resource capacity uses numeric resource weights then a single plunder value, with Java division and wrapping", () => {
  const r = rules();
  const load = (
    pointItem: string | null,
    pointType = 3,
    rawArmyLoad = 100,
    plunder: { value?: number }[] = [{ value: 7 }],
  ) => resourceArmyLoad({ rawArmyLoad, pointItem, pointType, plunder }, r);
  for (const [item, expected] of [
    ["0", 93],
    ["1", 43],
    ["2", 26],
    ["3", 18],
    ["4", 13],
    ["5", 9],
    ["6", 93],
    ["null", 93],
    [null, 93],
    ["", 93],
    [" 1", 93],
    ["+1", 93],
    ["-1", 93],
    ["1.0", 93],
    ["١", 43],
    ["００２", 26],
    ["\u2003", 93],
  ] as [string | null, number][])
    {expect(load(item)).toBe(expected);}
  expect(load("1", 18)).toBe(50);
  expect(load("1", 19)).toBe(50);
  expect(load("1", 37)).toBe(43);
  expect(load("1", 3, 100, [])).toBe(50);
  expect(load("1", 3, 100, [{}])).toBe(50);
  expect(load("1", 3, 100, [{ value: 7 }, { value: 9 }])).toBe(50);
  expect(load("1", 3, -101, [])).toBe(-50);
  expect(load(null, 3, -2147483648, [{ value: 1 }])).toBe(2147483647);
  r.items.set("resources_weight", { k2: "-1" });
  expect(load("1", 3, -2147483648, [])).toBe(-2147483648);
  expect(load("1", 3, 101, [])).toBe(-101);
  for (const weight of ["0", "bad", "2147483648"]) {
    r.items.set("resources_weight", { k2: weight });
    expect(() => load("1")).toThrow();
    expect(load("6")).toBe(93);
  }
  r.items.delete("resources_weight");
  expect(() => load("1")).toThrow();
  expect(() => load("2147483648")).toThrow();
  expect(load("not a resource")).toBe(93);
});

test("ordinary and territory collection retain their distinct caps and the one-unit remainder rule", () => {
  const input = march({ collectSpd: 2, marchArrivalTime: 1000n, armyLoad: 5 });
  expect(resourceCollected(3, 6, input, 100000n)).toBe(6);
  expect(resourceCollected(3, 7, input, 100000n)).toBe(5);
  expect(resourceCollected(18, 1, input, 100000n)).toBe(5);
  expect(resourceCollected(37, 1, input, 100000n)).toBe(198);
  expect(resourceCollected(19, 1, input, 100000n)).toBe(1);
  expect(resourceCollected(37, 1, input, 999n)).toBe(0);
  expect(resourceCollected(3, -1, input, 100000n)).toBe(-1);
  expect(
    resourceOwnerDetail(37, 99, march({ maxCollectTime: 999n, collectSpd: 100 })).quantity,
  ).toBe(0);
  expect(
    resourceOwnerDetail(37, 99, march({ maxCollectTime: 1001n, collectSpd: 100 })).quantity,
  ).toBe(100);
  expect(
    resourceOwnerDetail(37, 99, march({ maxCollectTime: -999n, collectSpd: 100 })).quantity,
  ).toBe(0);
});

test("aggregate overrides change speed/quantity/timestamp types without losing owner march fields", () => {
  const owned = worldResourceOwner(
    resourceOwnerDetail(37, 100, march({ maxCollectTime: 10000n, collectSpd: 2 })),
  );
  expect(owned.sdt).toEqual(sfs.long(1000));
  const times = [2000n, 3000n, 9007199254740993n];
  let reads = 0;
  const aggregate = resourceGroupDetail(
    100,
    [march({ collectSpd: 2 }), march({ collectSpd: 3 })],
    () => times[reads++]!,
  );
  const combined = { ...owned, ...worldResourceGroup(aggregate) };
  expect(combined).toEqual({
    q: sfs.int(20),
    spd: { type: Type.Float, value: 5 },
    sdt: sfs.double(9007199254740992),
    tq: sfs.int(92),
    collected: sfs.int(3),
    changeCollectSpdTime: sfs.long(9007199254740993n),
    occupyEndTime: sfs.long(9223372036854775807n),
  });
  expect(reads).toBe(3);
  expect(decode(encode(combined))).toEqual(combined);
  expect(worldResourceGroup(undefined)).toEqual({});
  const before = structuredClone(owned);
  expect({
    ...owned,
    ...worldResourceGroup(
      resourceGroupDetail(100, [], () => {
        throw new Error("Clock should not be sampled");
      }),
    ),
  }).toEqual(before);
});

test("finite float inputs can overflow aggregation as in Java while malformed inputs reject", () => {
  const maximum = float(2139095039);
  const detail = resourceGroupDetail(
    0,
    [march({ collectSpd: maximum }), march({ collectSpd: maximum })],
    () => 1000n,
  )!;
  expect(detail.speed).toBe(Infinity);
  expect(decode(encode(worldResourceGroup(detail)))).toEqual(worldResourceGroup(detail));
  for (const rate of [NaN, Infinity, -Infinity, 1e100])
    {expect(() => resourceCollected(3, 100, march({ collectSpd: rate }), 1000n)).toThrow();}
  for (const patch of [
    { armyLoad: 1.5 },
    { marchArrivalTime: 9223372036854775808n },
  ] as Partial<WorldResourceCollection>[])
    {expect(() => resourceCollected(3, 100, march(patch), 1000n)).toThrow();}
  expect(() => resourceRemaining(2147483648, 0)).toThrow();
  expect(() => resourceOwnerDetail(3, 100, march({ collectedBeforeSpd: 2147483648 }))).toThrow();
  expect(() =>
    resourceOwnerDetail(3, 100, march({ maxCollectTime: 9223372036854775808n })),
  ).toThrow();
  expect(() => resourceGroupDetail(0, Array(32768).fill(march()), () => 0n)).toThrow();
  for (const item of ["\0", "\ud800", "1".repeat(256)])
    {expect(() =>
      resourceArmyLoad({ rawArmyLoad: 1, pointType: 3, pointItem: item, plunder: [] }, rules()),
    ).toThrow();}
  const inputs = [march({ collectSpd: 0.1 }), march({ collectSpd: 0.2 })];
  const before = structuredClone(inputs);
  resourceGroupDetail(100, inputs, () => 10000n);
  expect(inputs).toEqual(before);
});
