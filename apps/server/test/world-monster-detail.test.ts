import { expect, test } from "bun:test";
import {
  worldMonsterMaximum,
  worldMonsterHealth,
  worldExplorationDetail,
} from "@opencok/rules/world-monster-detail";
import {
  worldMonsterHealth as healthFields,
  worldMonsterExploration,
} from "@opencok/mappings/world-monster-detail";
import { worldPointOwnerBase } from "@opencok/rules/world-point-detail";
import { worldPointOwner } from "@opencok/mappings/world-point-detail";
import { Rules, type Rule } from "@opencok/rules/game";
import type { Row } from "@opencok/contracts/rows";
import {
  sfs,
  Type,
  encode,
  decode,
  encodeArray,
  decodeArray,
  type Value,
} from "@opencok/messages/sfs";

function rules() {
  const result = new Rules(new Map(), new Map(), new Map());
  result.world.fieldMonsters = new Map<string, Rule>([
    ["npc", { NPC: "1", Gift: "123", army: "missing" }],
    ["monster", { NPC: "0", army: "a;b" }],
    ["empty", {}],
  ]);
  result.world.armies = new Map([
    ["a", { arm: "troop1;3|troop2;4" }],
    ["b", { arm: "troop1;5" }],
  ]);
  return result;
}
const point = (patch: Row = {}): Row => ({
  id: 321,
  pointType: 6,
  pointItem: "monster",
  ownerId: "target",
  monsterCurrHP: 8,
  ...patch,
});
const march = (patch: Row = {}): Row => ({
  uuid: "march-a",
  ownerUid: "observer",
  targetId: 321,
  worldId: 0,
  state: 1,
  marchStartTime: 9007199254740993n,
  arrivalTime: 9007199254740995n,
  exploreTime: 7n,
  marchArrivalTime: 100n,
  exploreReport: null,
  ...patch,
});
const reportBytes = Buffer.from(
  "11000312000200017404000000020001760500200000000000010800036f6e65110002010106bf000000",
  "hex",
);
const report = [
  sfs.object({ t: sfs.int(2), v: sfs.long(9007199254740993n) }),
  sfs.string("one"),
  sfs.array([sfs.bool(true), { type: Type.Float, value: -0.5 }]),
];

test("monster health uses NPC Gift or summed army counts, with distinct army and arms catalogs", () => {
  const r = rules();
  r.arms.set("a", { arm: "wrong;999" });
  expect(worldMonsterMaximum(15, "npc", r)).toBe(123);
  expect(worldMonsterMaximum(9, "monster", r)).toBe(12);
  expect(worldMonsterMaximum(15, "monster", r)).toBe(12);
  for (const type of [0, 3, 6, 14, 37, 49, 50, 66])
    expect(worldMonsterMaximum(type, "missing", r)).toBe(0);
  expect(worldMonsterMaximum(15, "empty", r)).toBe(0);
  expect(worldMonsterMaximum(15, null, r)).toBe(0);
  expect(worldMonsterMaximum(15, "\u180e\u2003", r)).toBe(0);
  expect(() => worldMonsterMaximum(15, "\u00a0", r)).toThrow();
});

test("army splitting ignores empty tokens, retains repeated IDs, and sums only two-part entries", () => {
  const r = rules();
  r.world.fieldMonsters!.set("split", { army: ";a;;a;b;" });
  r.world.armies!.set("a", { arm: "|unit;;3|;unit;4;|no-count|unit;1;extra|;;|" });
  r.world.armies!.set("b", {});
  expect(worldMonsterMaximum(15, "split", r)).toBe(14);
  r.world.armies!.set("a", { arm: "unit; 3" });
  expect(() => worldMonsterMaximum(15, "split", r)).toThrow();
  r.world.armies!.set("a", { arm: "unit;٣|unit;+4|unit;-2" });
  expect(worldMonsterMaximum(15, "split", r)).toBe(10);
  r.world.fieldMonsters!.set("split", { NPC: "1 ", army: "a", Gift: "999" });
  expect(worldMonsterMaximum(15, "split", r)).toBe(5);
});

test("health preserves signed Java integer parsing and addition including negative totals", () => {
  const r = rules();
  r.world.fieldMonsters!.set("sum", { army: "a" });
  for (const [arm, expected] of [
    ["a;2147483647|b;1", -2147483648],
    ["a;-2147483648|b;-1", 2147483647],
    ["a;-5|b;2", -3],
    ["a;2147483647|b;2147483647", -2],
  ] as [string, number][]) {
    r.world.armies!.set("a", { arm });
    expect(worldMonsterMaximum(15, "sum", r)).toBe(expected);
  }
  for (const Gift of ["2147483648", "-2147483649", "", "1.5", " 1", "abc"]) {
    r.world.fieldMonsters!.set("npc", { NPC: "1", Gift });
    expect(() => worldMonsterMaximum(15, "npc", r)).toThrow();
  }
  r.world.fieldMonsters!.set("npc", { NPC: "1", Gift: "-2147483648" });
  expect(worldMonsterMaximum(15, "npc", r)).toBe(-2147483648);
});

test("missing required monster or army catalog data fails without fabricated HP", () => {
  const r = rules();
  for (const item of ["missing", "\0", "\ud800", "a".repeat(256)])
    expect(() => worldMonsterMaximum(15, item, r)).toThrow();
  r.world.fieldMonsters!.set("npc", { NPC: "1" });
  expect(() => worldMonsterMaximum(15, "npc", r)).toThrow();
  r.world.armies!.delete("b");
  expect(() => worldMonsterMaximum(15, "monster", r)).toThrow();
  r.world.armies!.set("b", { arm: "a;2147483648" });
  expect(() => worldMonsterMaximum(15, "monster", r)).toThrow();
  expect(() => worldMonsterMaximum(1.5, null, r)).toThrow();
});

test("local boss health precedes owner identity and preserves zero/default and negative current HP", () => {
  const r = rules();
  for (const current of [null, 0, -1, 2147483647]) {
    const p = point({ pointType: 15, monsterCurrHP: current });
    const fields = {
      ...worldPointOwner(worldPointOwnerBase(p, {}, false)),
      ...healthFields(worldMonsterHealth(p, false, r)),
    };
    expect(fields).toEqual({
      mchp: sfs.int(current != null && current > 0 ? current : 12),
      mmhp: sfs.int(12),
    });
    expect(decode(encode(fields))).toEqual(fields);
  }
  expect(
    healthFields(worldMonsterHealth(point({ pointType: 15, pointItem: "missing" }), true, r)),
  ).toEqual({});
  expect(healthFields(worldMonsterHealth(point({ pointType: 9 }), false, r))).toEqual({});
  expect(() =>
    worldMonsterHealth(point({ pointType: 15, monsterCurrHP: 1.5 }), false, r),
  ).toThrow();
});

test("exploration uses the first matching destination before checking occupy state", () => {
  const occupied = march({ uuid: "occupied" });
  const returning = march({ uuid: "returning", state: 2 });
  expect(worldExplorationDetail("observer", point(), [returning, occupied], false)).toBeUndefined();
  expect(worldExplorationDetail("observer", point(), [occupied, returning], false)).toEqual({
    report: null,
    startTime: 9007199254740993n,
    endTime: 9007199254741002n,
  });
  const elsewhere = march({ uuid: "elsewhere", targetId: 999 });
  expect(worldExplorationDetail("observer", point(), [elsewhere, occupied], false)).toEqual(
    worldExplorationDetail("observer", point(), [occupied], false),
  );
  expect(worldExplorationDetail("observer", point(), [elsewhere], false)).toBeUndefined();
  expect(worldExplorationDetail("observer", point(), [], false)).toBeUndefined();
  for (const state of [null, 0, 2, -1])
    expect(worldExplorationDetail("observer", point(), [march({ state })], false)).toBeUndefined();
});

test("exploration follows supplied owner-map order without introducing world or march-type filters", () => {
  const unusual = march({ worldId: 99, type: 0, targetType: 1 });
  expect(worldExplorationDetail("observer", point({ worldId: 7 }), [unusual], false)).toBeDefined();
  expect(worldExplorationDetail("observer", point(), [unusual], true)).toBeUndefined();
  for (const pointType of [0, 9, 15, 18, 37, 49])
    expect(
      worldExplorationDetail("observer", point({ pointType }), [unusual], false),
    ).toBeUndefined();
});

test("exploration time uses arrival plus exploration duration with exact signed-long wrapping", () => {
  for (const [arrivalTime, exploreTime, expected] of [
    [9223372036854775807n, 1n, -9223372036854775808n],
    [-9223372036854775808n, -1n, 9223372036854775807n],
    [9007199254740993n, 2n, 9007199254740995n],
    [null, null, 0n],
  ] as [bigint | null, bigint | null, bigint][]) {
    expect(
      worldExplorationDetail("observer", point(), [march({ arrivalTime, exploreTime })], false)!
        .endTime,
    ).toBe(expected);
  }
  const detail = worldExplorationDetail("observer", point(), [march()], false)!;
  expect(worldMonsterExploration(detail)).toEqual({
    erp: sfs.array([]),
    st: sfs.long(9007199254740993n),
    et: sfs.long(9007199254741002n),
  });
  expect(worldMonsterExploration(undefined)).toEqual({});
});

test("root SFS arrays decode an independently specified binary report without losing tags or longs", () => {
  expect(decodeArray(reportBytes)).toEqual(report);
  expect(encodeArray(report)).toEqual(reportBytes);
  expect(decodeArray(Buffer.from("110000", "hex"))).toEqual([]);
  expect(encodeArray([])).toEqual(Buffer.from("110000", "hex"));
  const detail = worldExplorationDetail(
    "observer",
    point(),
    [march({ exploreReport: reportBytes })],
    false,
  )!;
  const fields = {
    ...worldPointOwner(worldPointOwnerBase(point(), {}, false)),
    ...worldMonsterExploration(detail),
  };
  expect(fields).toEqual({
    uid: sfs.string("target"),
    erp: sfs.array(report),
    st: sfs.long(9007199254740993n),
    et: sfs.long(9007199254741002n),
  });
  expect(decode(encode(fields))).toEqual(fields);
});

test("malformed, trailing, oversized and excessively nested root array reports reject", () => {
  for (const bytes of [
    Buffer.alloc(0),
    Buffer.from("11", "hex"),
    Buffer.from("110001", "hex"),
    Buffer.from("118000", "hex"),
    Buffer.from("1100010102", "hex"),
    Buffer.from("110001080001ff", "hex"),
    Buffer.from("110001ff", "hex"),
    encode({}),
    Buffer.concat([reportBytes, Buffer.from([0])]),
    Buffer.alloc(4 * 1024 * 1024 + 1),
  ])
    expect(() => decodeArray(bytes)).toThrow();
  expect(() => encodeArray(Array(32768).fill(sfs.null()))).toThrow();
  let nested: Value = sfs.null();
  for (let i = 0; i < 34; i++) nested = sfs.array([nested]);
  expect(() => encodeArray([nested])).toThrow();
  const deep = Buffer.concat(
    [...Array(34)].map(() => Buffer.from("110001", "hex")).concat(Buffer.from([0])),
  );
  expect(() => decodeArray(deep)).toThrow();
  expect(() =>
    worldMonsterExploration({ report: Buffer.alloc(0), startTime: 0n, endTime: 0n }),
  ).toThrow();
});

test("exploration enforces owner identity and exact storage bounds without mutating report bytes", () => {
  const invalid: Row[] = [
    march({ ownerUid: "other" }),
    march({ uuid: "" }),
    march({ uuid: "a".repeat(41) }),
    march({ targetId: 1.5 }),
    march({ state: 1.5 }),
    march({ marchStartTime: 9007199254740992 }),
    march({ arrivalTime: 9223372036854775808n }),
    march({ exploreTime: -9223372036854775809n }),
    march({ exploreReport: "not bytes" }),
    march({ exploreReport: Buffer.alloc(65536) }),
  ];
  for (const row of invalid)
    expect(() => worldExplorationDetail("observer", point(), [row], false)).toThrow();
  expect(() => worldExplorationDetail("observer", point(), [march(), march()], false)).toThrow();
  expect(() =>
    worldExplorationDetail("observer", point(), Array(32768).fill(march()), false),
  ).toThrow();
  const bytes = Buffer.from(reportBytes),
    input = march({ exploreReport: bytes });
  const detail = worldExplorationDetail("observer", point(), [input], false)!;
  expect(detail.report).toEqual(bytes);
  expect(detail.report).not.toBe(bytes);
  detail.report![0] = 0;
  expect(bytes).toEqual(reportBytes);
});
