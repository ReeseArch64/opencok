import { expect, test } from "bun:test";
import type { PowerSnapshot } from "@opencok/contracts/power";
import { storedPowerEffects } from "@opencok/rules/power-effects";
import { Rules } from "@opencok/rules/game";

const now = 1792756800000;
function fixture() {
  const state: PowerSnapshot = {
    profile: {},
    statistics: undefined,
    generals: [],
    armies: [],
    walls: [],
    buildings: [],
    sciences: [],
    civilizationSciences: [],
    sagaSciences: [],
    equipment: [],
    heroes: [],
    dragons: [],
    knight: undefined,
    items: [],
    states: [],
    vip: undefined,
    allianceSciences: [],
    prestige: [],
    military: undefined,
    miracle: undefined,
  };
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
    {},
    {
      sciences: new Map(),
      statuses: new Map(),
    },
  );
  return { state, rules };
}

test("power effects combine initial and completed research values in Java float order", () => {
  const { state, rules } = fixture();
  rules.items.set("effect", { id: "effect", k1: "487;16777216|999;50" });
  state.sciences = [
    { itemId: "1000", level: 1 },
    { itemId: "2000", level: 1 },
    { itemId: "3000", level: 0 },
  ];
  rules.power.sciences!.set("1001", { id: "1001", para1: "487", para2: "1" });
  rules.power.sciences!.set("2001", { id: "2001", para1: "999|487", para2: "1" });
  rules.power.sciences!.set("3000", { id: "3000", para1: "487", para2: "100" });
  expect(storedPowerEffects(state, rules, now)).toEqual({ initialAndScience: 16777216, status: 0 });
  rules.items.set("effect", { id: "effect", k1: "487;5|487;2" });
  expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(9);
  expect(state.sciences[2]?.level).toBe(0);
});

test("army/trap unlock research and unrelated effects do not contribute to dragon attack", () => {
  const { state, rules } = fixture();
  for (const [index, para1] of ["army", "trap", "999", ""].entries()) {
    const id = String(1000 + index);
    rules.power.sciences!.set(id, { id, para1, para2: "999" });
    state.sciences = [{ itemId: String(999 + index), level: 1 }];
    expect(storedPowerEffects(state, rules, now).initialAndScience).toBe(0);
  }
});

test("live statuses use configured or persisted random effects and ignore expired entries", () => {
  const { state, rules } = fixture();
  rules.power.statuses!.set("510001", { id: "510001", effect: "487;5|999;200|487;2", random: "0" });
  rules.power.statuses!.set("510002", { id: "510002", effect: "999;50", random: "1" });
  rules.power.statuses!.set("510003", { id: "510003" });
  state.states = [
    { stateId: 510001, endTime: BigInt(now + 1), ranEffValue: 300 },
    { stateId: 510002, endTime: BigInt(now + 1), ranEffId: 487, ranEffValue: 25 },
    { stateId: 510002, endTime: BigInt(now + 1), ranEffId: -1, ranEffValue: 999 },
    { stateId: 510003, endTime: BigInt(now + 1), ranEffId: 487, ranEffValue: 999 },
    { stateId: 999999, endTime: BigInt(now), ranEffId: 487, ranEffValue: 999 },
  ];
  const before = structuredClone(state);
  expect(storedPowerEffects(state, rules, now)).toEqual({ initialAndScience: 0, status: 32 });
  expect(state).toEqual(before);
});

test("throne status overrides and integer overflow match the legacy status accumulator", () => {
  const { state, rules } = fixture();
  rules.power.statuses!.set("510152", { id: "510152", effect: "487;1" });
  state.states = [
    { stateId: 510152, endTime: BigInt(now + 1), ranEffValue: 2147483647 },
    { stateId: 510152, endTime: BigInt(now + 1), ranEffValue: 1 },
  ];
  expect(storedPowerEffects(state, rules, now).status).toBe(-2147483648);
});

test("missing or malformed active effect rules cannot become an implicit zero bonus", () => {
  const { state, rules } = fixture();
  state.sciences = [{ itemId: "1000", level: 1 }];
  expect(() => storedPowerEffects(state, rules, now)).toThrow("102192");
  rules.power.sciences!.set("1001", { id: "1001", para1: "487", para2: "1.5" });
  expect(() => storedPowerEffects(state, rules, now)).toThrow("102192");
  state.sciences = [];
  state.states = [{ stateId: 510001, endTime: BigInt(now + 1) }];
  expect(() => storedPowerEffects(state, rules, now)).toThrow("102192");
  rules.power.statuses!.set("510001", { id: "510001", effect: "487;2147483648" });
  expect(() => storedPowerEffects(state, rules, now)).toThrow("102192");
});
