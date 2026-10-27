import { expect, test } from "bun:test";
import type { Row } from "@opencok/contracts/rows";
import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-point-detail";
import { restoredResourceGenerals } from "@opencok/hero/services/world-resource-generals";
import { legacyIntegerOrder, legacyObjectOrder } from "@opencok/messages/legacy-object-order";
import { Rules } from "@opencok/rules/game";
import { equippedGeneralBuildingEffect } from "@opencok/hero/rules/new-general-equipment";
import vectors from "./fixtures/general-concurrent-order-vectors.json";
import slots from "./fixtures/general-equipment-order-vectors.json";

function general(id = 7, values: Row = {}): Row {
  return {
    uid: "owner",
    id,
    state: 2,
    star: 1,
    buildingUuid: "castle",
    baseSkill: null,
    talent: null,
    opTime: null,
    refinement: null,
    ...values,
  };
}
function fixture() {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.power.equipment = new Map([["1", { site: "0", para1: "78", num1: "2" }]]);
  const snapshot: WorldResourceOwnerSnapshot["newGenerals"] = {
    moved: false,
    generals: [general()],
    statuses: [],
    equipment: [{ uuid: "piece", generalId: 7, itemId: 1, extraProperty: "78,3" }],
    offices: [],
  };
  const restore = () => restoredResourceGenerals(snapshot, rules);
  const effects = () =>
    equippedGeneralBuildingEffect(
      () => ({
        orderedGenerals: restore(),
        building: {
          buildingUuid: "castle",
          buildingUuids: new Set(["castle"]),
          mainBuildingLevel: 30,
          playerLevel: 20,
          prestigeLevel: 0,
          offices: [],
        },
      }),
      rules,
      { now: 1000, kingdomId: 1, version: "12.6.0" },
      78,
      () => 0,
      () => 1000n,
    );
  return { rules, snapshot, restore, effects };
}

test("fresh general Integer ConcurrentHashMap traversal matches 116 independent Java 8 collision and resize vectors", () => {
  expect(vectors).toHaveLength(116);
  const f = fixture();
  f.snapshot.equipment = [];
  for (const { keys, order } of vectors) {
    expect(legacyIntegerOrder(keys)).toEqual(order);
    f.snapshot.generals = keys.map((key, index) => general(key, { star: index }));
    const restored = f.restore();
    expect(restored.map((entry) => entry.id)).toEqual(order);
    for (const entry of restored) {expect(entry.star).toBe(keys.lastIndexOf(entry.id));}
  }
  for (const key of [NaN, Infinity, 0.5, 2147483648, -2147483649])
    {expect(() => legacyIntegerOrder([key])).toThrow();}
  expect(() => legacyIntegerOrder(Array(4097).fill(1))).toThrow();
});

test("general traversal preserves Float cancellation independently of SQL insertion order", () => {
  const f = fixture();
  f.snapshot.generals = [general(3), general(2), general(1)];
  f.snapshot.equipment = [];
  f.rules.power.statuses = new Map([
    ["1", { effect: "78;10000000000" }],
    ["2", { effect: "78;-10000000000" }],
    ["3", { effect: "78;1" }],
  ]);
  f.snapshot.statuses = [3, 2, 1].map((id) => ({
    newGeneralId: id,
    stateId: id,
    startTime: 0n,
    endTime: 1000n,
  }));
  expect(f.restore().map((entry) => entry.id)).toEqual([1, 2, 3]);
  expect(f.effects()).toBe(1);
});

test("equipment replacement preserves duplicate-key collision treeification in 20 independent Java 8 String map vectors", () => {
  expect(slots).toHaveLength(20);
  const f = fixture();
  for (const { keys, order } of slots) {
    expect(legacyObjectOrder(keys)).toEqual(order);
    f.rules.power.equipment = new Map(keys.map((site, index) => [String(index + 1), { site }]));
    f.snapshot.equipment = keys.map((_, index) => ({
      generalId: 7,
      itemId: index + 1,
      extraProperty: null,
    }));
    expect(f.restore()[0]!.orderedEquipment.map((item) => item.itemId)).toEqual(
      order.map((site) => keys.lastIndexOf(site) + 1),
    );
  }
});

test("equipment slots keep the last loaded piece and traverse String concurrent-map order without mutating rows", () => {
  const f = fixture();
  f.rules.power.equipment = new Map([
    ["1", { site: "1", para1: "78", num1: "10000000000" }],
    ["2", { site: "2", para1: "78", num1: "-10000000000" }],
    ["3", { site: "3", para1: "78", num1: "1" }],
    ["4", { site: "1", para1: "78", num1: "10000000000" }],
  ]);
  f.snapshot.equipment = [3, 2, 1, 4].map((itemId) => ({
    uuid: String(itemId),
    generalId: 7,
    itemId,
    extraProperty: null,
    on: 0,
  }));
  const before = structuredClone(f.snapshot);
  expect(f.restore()[0]!.orderedEquipment.map((item) => item.itemId)).toEqual([4, 2, 3]);
  expect(f.effects()).toBe(1);
  expect(f.snapshot).toEqual(before);
  f.rules.power.equipment.get("4")!.site = "01";
  expect(f.restore()[0]!.orderedEquipment).toHaveLength(4);
  f.rules.power.equipment.get("4")!.site = "";
  expect(f.restore()[0]!.orderedEquipment).toHaveLength(4);
});

test("orphan and nonpositive general equipment references are ignored without catalog lookup or repair", () => {
  const f = fixture();
  f.snapshot.statuses = [{ newGeneralId: 999, stateId: 3 }];
  f.snapshot.equipment = [
    ...f.snapshot.equipment,
    ...[999, 0, -1].map((generalId) => ({ generalId, itemId: 999 })),
  ];
  const before = structuredClone(f.snapshot);
  expect(f.restore()[0]!.statuses).toEqual([]);
  expect(f.effects()).toBe(5);
  expect(f.snapshot).toEqual(before);
});

test("state four rejects equipment binding after catalog lookup but before requiring a slot", () => {
  const f = fixture();
  f.snapshot.generals = [general(7, { state: 4 })];
  expect(f.restore()[0]!.orderedEquipment).toEqual([]);
  f.rules.power.equipment!.set("1", {});
  expect(f.restore()[0]!.orderedEquipment).toEqual([]);
  f.rules.power.equipment!.clear();
  expect(() => f.restore()).toThrow("Missing general equipment binding rule");
  expect(f.effects()).toBe(0);
  f.rules.power.equipment!.set("1", {});
  f.snapshot.generals = [general()];
  expect(() => f.restore()).toThrow("Missing or oversized general equipment site");
  f.rules.power.equipment!.set("1", { site: "" });
  expect(f.effects()).toBe(3);
});

test("transferred owners skip all status and equipment restoration but still restore every general", () => {
  const f = fixture();
  f.snapshot.moved = true;
  f.snapshot.statuses = Array(4097).fill({});
  f.snapshot.equipment = Array(4097).fill({});
  f.rules.power.equipment = undefined;
  const restored = f.restore();
  expect(restored).toHaveLength(1);
  expect(restored[0]!.statuses).toEqual([]);
  expect(restored[0]!.orderedEquipment).toEqual([]);
  f.snapshot.generals = [general(7, { opTime: "1;9223372036854775808" })];
  expect(() => f.restore()).toThrow();
  expect(f.effects()).toBe(0);
});

test("saved level content is restored even for ineligible or overwritten generals and fails the whole module", () => {
  const f = fixture();
  const invalid: Row[] = [{ talent: "1;bad" }, { opTime: "1;bad" }, { baseSkill: "1;bad" }];
  for (const values of invalid) {
    f.snapshot.generals = [general(8, { state: 1, ...values }), general()];
    expect(() => f.restore()).toThrow();
    expect(f.effects()).toBe(0);
    f.snapshot.generals = [general(7, values), general()];
    expect(() => f.restore()).toThrow();
  }
  f.snapshot.generals = [general(8, { state: 1, refinement: "bad" }), general()];
  expect(f.effects()).toBe(5);
});

test("status associations retain exact nullable Long values and final duplicate status selection", () => {
  const f = fixture();
  f.rules.power.statuses = new Map([["10", { effect: "78;7" }]]);
  f.snapshot.statuses = [
    { newGeneralId: 7, stateId: 10, startTime: 9007199254740993n, endTime: 9223372036854775807n },
    { newGeneralId: 7, stateId: 10, startTime: null, endTime: 1000n },
  ];
  expect(f.restore()[0]!.statuses).toEqual([
    { stateId: 10, startTime: 9007199254740993n, endTime: 9223372036854775807n },
    { stateId: 10, startTime: null, endTime: 1000n },
  ]);
  expect(f.effects()).toBe(12);
  f.snapshot.statuses = [...f.snapshot.statuses].reverse();
  expect(f.effects()).toBe(5);
});

test("general primitive defaults, byte width and stored bounds reject incompatible state without wrapping", () => {
  const f = fixture();
  f.snapshot.generals = [general(7, { state: null, star: null, buildingUuid: null })];
  expect(f.restore()[0]).toMatchObject({ id: 7, state: 0, star: 0, buildingUuid: null });
  for (const state of [-128, 127]) {
    f.snapshot.generals = [general(7, { state })];
    expect(f.restore()[0]!.state).toBe(state);
  }
  const invalid: Row[] = [
    { state: 128 },
    { state: -129 },
    { state: "2" },
    { id: 2147483648 },
    { star: 0.5 },
    { buildingUuid: "x".repeat(97) },
    { baseSkill: "x".repeat(257) },
    { talent: "x".repeat(5001) },
    { opTime: "x".repeat(201) },
    { refinement: "x".repeat(301) },
  ];
  for (const values of invalid) {
    f.snapshot.generals = [general(7, values)];
    expect(() => f.restore()).toThrow();
  }
  f.snapshot.generals = Array(4097).fill(general());
  expect(() => f.restore()).toThrow();
  f.snapshot.generals = [general()];
  f.snapshot.statuses = Array(4097).fill({ newGeneralId: 999 });
  expect(() => f.restore()).toThrow();
  f.snapshot.statuses = [{ newGeneralId: 7, stateId: 1, startTime: 1, endTime: null }];
  expect(() => f.restore()).toThrow();
  f.snapshot.statuses = [];
  f.snapshot.equipment = Array(4097).fill({ generalId: 999 });
  expect(() => f.restore()).toThrow();
  f.snapshot.equipment = [{ generalId: 7, itemId: 1, extraProperty: "x".repeat(256) }];
  expect(() => f.restore()).toThrow();
});
