import { expect, test } from "bun:test";
import { resourceArmyLoad, resourceRawArmyLoad } from "@opencok/rules/world-resource-detail";
import { Rules } from "@opencok/rules/game";
import type {
  WorldResourceArmy,
  WorldResourceLoadEffects,
} from "@opencok/contracts/world-resource-detail";
import vectors from "./fixtures/world-resource-load-vectors.json";

const rules = () => new Rules(new Map(), new Map(), new Map());
const army = (patch: Partial<WorldResourceArmy> = {}): WorldResourceArmy => ({
  cachedLoad: 0,
  residentOwner: false,
  soldiers: [{ armsId: "troop", total: 10, dead: 2, loadEffect: 0 }],
  ...patch,
});
const effects = (patch: Partial<WorldResourceLoadEffects> = {}): WorldResourceLoadEffects => ({
  worldLoad: 0,
  worldLoadAdd: 0,
  general: 0,
  newGeneral: 0,
  expedition: 0,
  ...patch,
});
function float(bits: number): number {
  const bytes = Buffer.alloc(4);
  bytes.writeInt32BE(bits);
  return bytes.readFloatBE();
}

test("raw resource troop load matches 2400 independent Java 8 arithmetic vectors", () => {
  expect(vectors).toHaveLength(2400);
  const catalog = rules();
  for (const [total, dead, load, saved, rawEffects, expected] of vectors as [
    number,
    number,
    number,
    number,
    number[],
    number,
  ][]) {
    catalog.arms.set("troop", { load: String(load) });
    const [worldLoad, worldLoadAdd, general, newGeneral, expedition] = rawEffects.map(float);
    const state = army({
      residentOwner: true,
      soldiers: [{ armsId: "troop", total, dead, loadEffect: saved }],
      effects: {
        worldLoad: worldLoad!,
        worldLoadAdd: worldLoadAdd!,
        general: general!,
        newGeneral: newGeneral!,
        expedition: expedition!,
      },
    });
    const before = structuredClone(state);
    expect(resourceRawArmyLoad(state, catalog)).toBe(expected);
    expect(state).toEqual(before);
  }
});

test("positive cached load is used only when the owner is not resident and skips troop dependencies", () => {
  const catalog = rules();
  const cached = army({ cachedLoad: 123 });
  Object.defineProperty(cached, "soldiers", {
    get() {
      throw new Error("Unused troops");
    },
  });
  Object.defineProperty(cached, "effects", {
    get() {
      throw new Error("Unused effects");
    },
  });
  expect(resourceRawArmyLoad(cached, catalog)).toBe(123);
  catalog.arms.set("troop", { load: "10" });
  expect(
    resourceRawArmyLoad(
      army({ cachedLoad: 123, residentOwner: true, effects: effects() }),
      catalog,
    ),
  ).toBe(80);
  for (const cachedLoad of [0, -1, -2147483648])
    {expect(resourceRawArmyLoad(army({ cachedLoad }), catalog)).toBe(80);}
  expect(resourceRawArmyLoad(army({ effects: effects({ worldLoad: 100 }) }), catalog)).toBe(160);
  expect(() => resourceRawArmyLoad(army({ residentOwner: true }), catalog)).toThrow("102192");
});

test("troop calculation retains dead-count wrapping, negative contributions, duplicates and total overflow", () => {
  const catalog = rules();
  catalog.arms.set("troop", { load: "1" });
  expect(
    resourceRawArmyLoad(
      army({ soldiers: [{ armsId: "troop", total: -2147483648, dead: 1, loadEffect: 0 }] }),
      catalog,
    ),
  ).toBe(2147483647);
  expect(
    resourceRawArmyLoad(
      army({ soldiers: [{ armsId: "troop", total: 1, dead: 10, loadEffect: 0 }] }),
      catalog,
    ),
  ).toBe(-9);
  const state = army({
    soldiers: Array.from({ length: 3 }, () => ({
      armsId: "troop",
      total: 2147483647,
      dead: 0,
      loadEffect: 0,
    })),
  });
  expect(resourceRawArmyLoad(state, catalog)).toBe(2147483645);
  state.soldiers = [{ armsId: "troop", total: 100, dead: 0, loadEffect: -200 }];
  expect(resourceRawArmyLoad(state, catalog)).toBe(20);
});

test("all five owner modifiers are added in Java float order before the saved troop effect", () => {
  const catalog = rules();
  catalog.arms.set("troop", { load: "1" });
  const state = army({
    residentOwner: true,
    soldiers: [{ armsId: "troop", total: 100, dead: 0, loadEffect: 10 }],
    effects: effects({ worldLoad: 1, worldLoadAdd: 2, general: 3, newGeneral: 4, expedition: 5 }),
  });
  expect(resourceRawArmyLoad(state, catalog)).toBe(125);
  state.effects = effects({ worldLoad: 16777216, worldLoadAdd: 1, general: -16777216 });
  expect(resourceRawArmyLoad(state, catalog)).toBe(110);
  state.effects = effects({ worldLoad: NaN });
  expect(resourceRawArmyLoad(state, catalog)).toBe(0);
  state.effects = effects({ worldLoad: Infinity });
  expect(resourceRawArmyLoad(state, catalog)).toBe(2147483647);
  state.effects = effects({ worldLoad: -Infinity });
  expect(resourceRawArmyLoad(state, catalog)).toBe(20);
});

test("catalog load absence skips a troop while malformed or missing required records reject", () => {
  const catalog = rules();
  catalog.arms.set("troop", {});
  expect(
    resourceRawArmyLoad(
      army({
        residentOwner: true,
        soldiers: [{ armsId: "troop", total: NaN, dead: NaN, loadEffect: NaN }],
      }),
      catalog,
    ),
  ).toBe(0);
  catalog.arms.delete("troop");
  expect(() => resourceRawArmyLoad(army(), catalog)).toThrow("102192");
  for (const load of ["", " 1", "1 ", "1.0", "2147483648", "-2147483649"]) {
    catalog.arms.set("troop", { load });
    expect(() => resourceRawArmyLoad(army(), catalog)).toThrow("102192");
  }
  for (const load of ["+10", "١٠", "１０"]) {
    catalog.arms.set("troop", { load });
    expect(resourceRawArmyLoad(army(), catalog)).toBe(80);
  }
  expect(resourceRawArmyLoad(army({ residentOwner: true, soldiers: [] }), catalog)).toBe(0);
});

test("raw load composes with resource weights and plunder without changing the source snapshot", () => {
  const catalog = rules();
  catalog.arms.set("troop", { load: "10" });
  catalog.items.set("resources_weight", { k2: "3" });
  const state = army({ effects: effects({ worldLoad: 100 }) });
  const before = structuredClone(state);
  const rawArmyLoad = resourceRawArmyLoad(state, catalog);
  expect(rawArmyLoad).toBe(160);
  expect(
    resourceArmyLoad(
      { rawArmyLoad, pointType: 3, pointItem: "1", plunder: [{ value: 7 }] },
      catalog,
    ),
  ).toBe(46);
  expect(
    resourceArmyLoad(
      { rawArmyLoad, pointType: 18, pointItem: "1", plunder: [{ value: 7 }] },
      catalog,
    ),
  ).toBe(53);
  expect(state).toEqual(before);
});

test("raw army restoration bounds input widths and troop counts without coercion", () => {
  const catalog = rules();
  catalog.arms.set("troop", { load: "1" });
  for (const value of [NaN, Infinity, 0.5, 2147483648, -2147483649]) {
    expect(() => resourceRawArmyLoad(army({ cachedLoad: value }), catalog)).toThrow();
    for (const key of ["total", "dead", "loadEffect"])
      {expect(() =>
        resourceRawArmyLoad(
          army({ soldiers: [{ armsId: "troop", total: 1, dead: 0, loadEffect: 0, [key]: value }] }),
          catalog,
        ),
      ).toThrow();}
  }
  expect(() =>
    resourceRawArmyLoad(army({ residentOwner: 1 as unknown as boolean }), catalog),
  ).toThrow();
  expect(() =>
    resourceRawArmyLoad(army({ effects: effects({ worldLoad: 0.1 }) }), catalog),
  ).toThrow();
  for (const armsId of ["a".repeat(256), "\0", "\ud800"])
    {expect(() =>
      resourceRawArmyLoad(
        army({ soldiers: [{ armsId, total: 1, dead: 0, loadEffect: 0 }] }),
        catalog,
      ),
    ).toThrow();}
  const soldiers = Array.from({ length: 4096 }, () => ({
    armsId: "troop",
    total: 1,
    dead: 0,
    loadEffect: 0,
  }));
  expect(resourceRawArmyLoad(army({ soldiers }), catalog)).toBe(4096);
  expect(() =>
    resourceRawArmyLoad(army({ soldiers: [...soldiers, soldiers[0]!] }), catalog),
  ).toThrow();
});
