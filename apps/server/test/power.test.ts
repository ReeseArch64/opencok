import { expect, test } from "bun:test";
import type { PowerContext, PowerSnapshot } from "@opencok/contracts/power";
import { calculatePlayerPower } from "@opencok/rules/power";
import { Rules, type PowerCatalogs, type Rule } from "@opencok/rules/game";
import { playerStatistics, powerInfo } from "@opencok/dtos/power";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const now = 1792756800000;
const context = (overrides: Partial<PowerContext> = {}): PowerContext => ({
  now,
  dragonLevelUp: false,
  dragonScience: false,
  contractTitleExpiries: new Map(),
  ...overrides,
});
const catalog = (...records: Rule[]) => new Map(records.map((row) => [row.id!, row]));
function fixture() {
  const power: PowerCatalogs = {
    generals: catalog({ id: "7000", power: "12" }),
    sciences: catalog({ id: "1002", power: "40" }),
    civilizationSciences: catalog({ id: "2003", power: "30" }),
    sagaSciences: catalog({ id: "103004", power: "20" }),
    heroes: catalog({ id: "7001", power: "9007199254740993" }, { id: "7101", power: "7" }),
    equipment: catalog({ id: "9001", power: "60" }),
    titles: catalog({ id: "8001", power: "70", type: "2" }),
    dragonBases: catalog({ id: "6001", initFight: "120" }),
    dragonLevels: catalog({ id: "5001", base_id: "6001", level: "2", attack: "100" }),
  };
  const rules = new Rules(
    catalog({ id: "400001", level: "1", power: "50" }),
    catalog({ id: "100105", power: "100" }),
    new Map(),
    new Map(),
    catalog({ id: "dragon_new", k10: "10", k11: "2", k12: "3" }, { id: "hero", k7: "3600" }),
    catalog(
      { id: "107001", power: "0.75" },
      { id: "107002", power: "1.25" },
      { id: "108001", power: "2.5" },
    ),
    new Map(),
    new Map(),
    1,
    new Map(),
    {},
    power,
  );
  const state: PowerSnapshot = {
    foreignSciences: [],
    profile: { level: 5 },
    statistics: { questPower: 9, power: 1n, buildingPower: 1n },
    generals: [{ generalId: "7000", level: 3 }],
    armies: [
      { armyId: "107001", free: 5, pve: 2, defence: 1, march: 2, train: 100, finishTime: 1n },
      { armyId: "107002", free: 2 },
    ],
    walls: [{ armyId: "108001", num: 3, build: 99, finishTime: 1n }],
    buildings: [{ itemId: 400000, level: 1 }],
    sciences: [{ itemId: "1000", level: 2, cd: 1n }],
    civilizationSciences: [{ baseItemID: 2000, level: 3 }],
    sagaSciences: [{ itemid: 3000, level: 4, cdtime: 1n }],
    equipment: [
      { itemId: 9001, on: 1 },
      { itemId: 99999, on: 0 },
    ],
    heroes: [
      { heroid: 7001, level: 1 },
      { heroid: 7101, level: 100 },
    ],
    dragons: [
      { itemId: 6001, dragonState: 3, lv: 2 },
      { itemId: 9999, dragonState: 0, lv: 1 },
    ],
    dragonSkills: [],
    knight: { activity_title: 8001, contract_activity_title: -1 },
    items: [],
    states: [],
    vip: undefined,
    allianceSciences: [],
    prestige: [],
    military: undefined,
    miracle: undefined,
    office: undefined,
    kingdomFights: [],
    territoryTrees: [],
    luckyDay: undefined,
    powerServer: undefined,
  };
  return { state, rules };
}
function empty(): PowerSnapshot {
  return {
    profile: { level: 5 },
    statistics: undefined,
    generals: [],
    armies: [],
    walls: [],
    buildings: [],
    sciences: [],
    civilizationSciences: [],
    sagaSciences: [],
    foreignSciences: [],
    equipment: [],
    heroes: [],
    dragons: [],
    dragonSkills: [],
    knight: undefined,
    items: [],
    states: [],
    vip: undefined,
    allianceSciences: [],
    prestige: [],
    military: undefined,
    miracle: undefined,
    office: undefined,
    kingdomFights: [],
    territoryTrees: [],
    luckyDay: undefined,
    powerServer: undefined,
  };
}

test("power derives every component from completed state and preserves exact hero totals", () => {
  const { state, rules } = fixture();
  const before = structuredClone(state);
  const result = calculatePlayerPower(state, rules, context({ dragonLevelUp: true }));
  expect(result).toEqual({
    playerPower: 100,
    heroPower: 36,
    armyPower: 10n,
    buildingPower: 50,
    sciencePower: 40,
    civilizationSciencePower: 30,
    sagatower_science: 20,
    fortPower: 7n,
    questpower: 9,
    equipPower: 60,
    knight_title: 70,
    petDragonPower: 420n,
    prinessPower: 9007199254741000n,
    total: 9007199254741852n,
  });
  expect(state).toEqual(before);
});

test("empty optional domains do not need catalogs and missing role configuration rejects", () => {
  const rules = new Rules(new Map(), catalog({ id: "100105", power: "100" }), new Map());
  const result = calculatePlayerPower(empty(), rules, context());
  expect(result.total).toBe(100n);
  expect(result.questpower).toBe(0);
  rules.roles.clear();
  expect(() => calculatePlayerPower(empty(), rules, context())).toThrow("102192");
});

test("army and trap fractions accumulate before truncation and unfinished counts do not contribute", () => {
  const { rules } = fixture();
  const state = empty();
  state.armies = [
    { armyId: "107001", free: 1, train: 900 },
    { armyId: "107001", march: 1, train: 900 },
  ];
  state.walls = [
    { armyId: "107001", num: 1, build: 900 },
    { armyId: "107001", num: 1, build: 900 },
  ];
  const result = calculatePlayerPower(state, rules, context());
  expect(result.armyPower).toBe(1n);
  expect(result.fortPower).toBe(1n);
  expect(result.total).toBe(102n);
});

test("Java integer overflow occurs before widening the initial total and army counts", () => {
  const { rules } = fixture();
  const state = empty();
  state.statistics = { questPower: 2147483647 };
  state.armies = [{ armyId: "107002", free: 2147483647, march: 1 }];
  const result = calculatePlayerPower(state, rules, context());
  expect(result.armyPower).toBe(-2684354560n);
  expect(result.total).toBe(-4831838109n);
  state.armies = [];
  state.generals = [{ generalId: "7000", level: 2147483647 }];
  expect(calculatePlayerPower(state, rules, context()).heroPower).toBe(-12);
});

test("floating troop overflow saturates at Java long bounds and integer total wraps", () => {
  const { rules } = fixture();
  rules.arms.set("huge", { id: "huge", power: "1e30" });
  const state = empty();
  state.armies = [{ armyId: "huge", free: 1 }];
  expect(calculatePlayerPower(state, rules, context()).armyPower).toBe(9223372036854775807n);
  expect(calculatePlayerPower(state, rules, context()).total).toBe(-9223372036854775709n);
  state.armies = [{ armyId: "huge", free: -1 }];
  expect(calculatePlayerPower(state, rules, context()).armyPower).toBe(-9223372036854775808n);
});

test("building star progress uses the current power tier without completing its next step", () => {
  const { rules } = fixture();
  rules.buildings.set("400030", {
    id: "400030",
    level: "30",
    power: "50",
    star_power: "0;60|10;70|20;80",
  });
  const state = empty();
  state.buildings = [{ itemId: 400000, level: 30, star: 0, progress: 10 }];
  expect(calculatePlayerPower(state, rules, context()).buildingPower).toBe(70);
});

test("contract titles take precedence only before expiry and fall back to eligible normal titles", () => {
  const { rules } = fixture();
  rules.power.titles!.set("8002", { id: "8002", power: "90", type: "3" });
  const state = empty();
  state.knight = { activity_title: 8001, contract_activity_title: 8002 };
  const at = (deadline: bigint) =>
    calculatePlayerPower(
      state,
      rules,
      context({ contractTitleExpiries: new Map([["8002", deadline]]) }),
    ).knight_title;
  expect(at(BigInt(now + 1))).toBe(90);
  expect(at(BigInt(now))).toBe(70);
  expect(at(BigInt(now - 1))).toBe(70);
  expect(calculatePlayerPower(state, rules, context()).knight_title).toBe(70);
  expect(state.knight.contract_activity_title).toBe(8002);
});

test("ordinary titles require every unexpired talisman without consuming or resetting state", () => {
  const { rules } = fixture();
  rules.power.titles!.set("8001", { id: "8001", power: "70", type: "1", activate_array: "a;b" });
  const state = empty();
  state.knight = { activity_title: 8001 };
  state.items = [
    { itemId: "a", count: 1, vanishTime: 0n },
    { itemId: "b", count: 1, vanishTime: BigInt(now) },
  ];
  expect(calculatePlayerPower(state, rules, context()).knight_title).toBe(0);
  state.items = [
    { itemId: "a", count: 1 },
    { itemId: "b", count: 1, vanishTime: BigInt(now + 1) },
  ];
  expect(calculatePlayerPower(state, rules, context()).knight_title).toBe(70);
  expect(state.items.map((row) => row.count)).toEqual([1, 1]);
  expect(state.knight.activity_title).toBe(8001);
});

test("dragon power honors gates, mature state and required effective attack modifiers", () => {
  const { state, rules } = fixture();
  expect(calculatePlayerPower(state, rules, context()).petDragonPower).toBe(0n);
  expect(() =>
    calculatePlayerPower(state, rules, context({ dragonLevelUp: true, dragonScience: true })),
  ).toThrow("102192");
  const power = (percent: number) =>
    calculatePlayerPower(
      state,
      rules,
      context({ dragonLevelUp: true, dragonScience: true, dragonAttackPercent: percent }),
    ).petDragonPower;
  expect(power(0)).toBe(420n);
  expect(power(50)).toBe(795n);
  expect(power(-50)).toBe(420n);
  expect(() => power(NaN)).toThrow("102192");
  state.dragons = [{ itemId: 99999, dragonState: 1 }];
  expect(
    calculatePlayerPower(state, rules, context({ dragonLevelUp: true, dragonScience: true }))
      .petDragonPower,
  ).toBe(0n);
});

test("a live domain cannot silently substitute missing or malformed rule values", () => {
  for (const key of [
    "generals",
    "sciences",
    "civilizationSciences",
    "sagaSciences",
    "heroes",
    "equipment",
    "titles",
    "dragonBases",
    "dragonLevels",
  ] as const) {
    const { state, rules } = fixture();
    rules.power[key]!.clear();
    expect(() => calculatePlayerPower(state, rules, context({ dragonLevelUp: true }))).toThrow(
      "102192",
    );
  }
  for (const value of ["NaN", "Infinity", "invalid", "1e9999"]) {
    const { state, rules } = fixture();
    rules.arms.set("107001", { id: "107001", power: value });
    expect(() => calculatePlayerPower(state, rules, context())).toThrow("102192");
  }
  const { state, rules } = fixture();
  rules.roles.set("100105", { id: "100105", power: "2147483648" });
  expect(() => calculatePlayerPower(state, rules, context())).toThrow("102192");
});

test("dragon attack retains Java float rounding before the double power formula", () => {
  const { state, rules } = fixture();
  rules.items.set("dragon_new", { id: "dragon_new", k10: "1", k11: "1", k12: "1" });
  rules.power.dragonBases!.set("6001", { id: "6001", initFight: "0" });
  rules.power.dragonLevels!.set("5001", {
    id: "5001",
    base_id: "6001",
    level: "2",
    attack: "16777217",
  });
  expect(calculatePlayerPower(state, rules, context({ dragonLevelUp: true })).petDragonPower).toBe(
    16777216n,
  );
});

test("dragon catalogs require a unique base/level mapping and complete formula parameters", () => {
  const { state, rules } = fixture();
  rules.power.dragonLevels!.set("duplicate", {
    id: "duplicate",
    base_id: "6001",
    level: "2",
    attack: "100",
  });
  expect(() => calculatePlayerPower(state, rules, context({ dragonLevelUp: true }))).toThrow(
    "102192",
  );
  rules.power.dragonLevels!.delete("duplicate");
  rules.items.set("dragon_new", { id: "dragon_new", k10: "10", k11: "2" });
  expect(() => calculatePlayerPower(state, rules, context({ dragonLevelUp: true }))).toThrow(
    "102192",
  );
});

test("login-only positive power assignments keep blank titles and wrapped dragon totals at zero", () => {
  const { state, rules } = fixture();
  rules.power.titles!.set("8001", { id: "8001", type: "2", power: " " });
  rules.items.set("dragon_new", { id: "dragon_new", k10: "1", k11: "1", k12: "1e30" });
  state.dragons = [
    { itemId: 6001, dragonState: 3, lv: 2 },
    { itemId: 6001, dragonState: 3, lv: 2 },
  ];
  const result = calculatePlayerPower(state, rules, context({ dragonLevelUp: true }));
  expect(result.knight_title).toBe(0);
  expect(result.petDragonPower).toBe(0n);
});

test("power DTO preserves battle aliases, field widths and avatar cooldown arithmetic", () => {
  const { state, rules } = fixture();
  const power = calculatePlayerPower(state, rules, context({ dragonLevelUp: true }));
  const statistics = {
    battlesWin: 1,
    battlesLose: 2,
    attacksWin: 3,
    attacksLose: 4,
    defensesWin: 5,
    detectNum: 6,
    armyKill: 9007199254740993n,
    armyDead: 7,
    armyCure: 8,
    cityDestroyed: 9,
    uid: "private",
    power: 1n,
    questPower: 9,
  };
  const wire = decode(
    encode(
      powerInfo(
        statistics,
        power,
        {
          updateTime: 9007199254740993n,
          banTime: 9007199254740995n,
          banCount: 4,
        },
        rules,
      ),
    ),
  );
  expect(wire).toEqual({
    battleWin: sfs.int(1),
    battleLose: sfs.int(2),
    attackWin: sfs.int(3),
    attackLose: sfs.int(4),
    defenseWin: sfs.int(5),
    detectNum: sfs.int(6),
    armyKill: sfs.long(9007199254740993n),
    armyDead: sfs.int(7),
    armyCure: sfs.int(8),
    cityDes: sfs.int(9),
    playerPower: sfs.int(100),
    heroPower: sfs.int(36),
    armyPower: sfs.long(10),
    buildingPower: sfs.int(50),
    sciencePower: sfs.int(40),
    civilizationSciencePower: sfs.int(30),
    fortPower: sfs.long(7),
    questpower: sfs.int(9),
    equipPower: sfs.int(60),
    knight_title: sfs.int(70),
    petDragonPower: sfs.long(420),
    sagatower_science: sfs.int(20),
    prinessPower: sfs.long(9007199254741000n),
    nextUpdateTime: sfs.long(9007199258340993n),
    banTime: sfs.long(9007199254740995n),
    banCount: sfs.int(4),
  });
});

test("absent statistics and avatar records have defaults without requiring an interval rule", () => {
  const { rules } = fixture();
  rules.items.delete("hero");
  const wire = powerInfo(
    undefined,
    calculatePlayerPower(empty(), rules, context()),
    undefined,
    rules,
  );
  expect(wire.nextUpdateTime).toEqual(sfs.long(0));
  expect(wire.banCount).toEqual(sfs.int(0));
  expect(wire.armyKill).toEqual(sfs.long(0));
  expect(() =>
    powerInfo(
      undefined,
      calculatePlayerPower(empty(), rules, context()),
      { updateTime: 1n },
      rules,
    ),
  ).toThrow("102192");
  expect(() => playerStatistics({ armyKill: 9223372036854775808n })).toThrow("102192");
  expect(() => playerStatistics({ armyKill: Number.MAX_SAFE_INTEGER + 1 })).toThrow("102192");
  expect(() => playerStatistics({ battlesWin: "1.5" })).toThrow("102192");
});

test("avatar deadline wraps as signed long without narrowing millisecond values to Number", () => {
  const { rules } = fixture();
  rules.items.set("hero", { id: "hero", k7: "1" });
  const wire = powerInfo(
    undefined,
    calculatePlayerPower(empty(), rules, context()),
    { updateTime: 9223372036854775807n },
    rules,
  );
  expect(wire.nextUpdateTime).toEqual(sfs.long(-9223372036854774809n));
});

test("hero power uses the same duplicate-family selection as hero effects without rewriting rows", () => {
  const { state, rules } = fixture();
  state.heroes = [
    { heroid: 7000, level: 1, exp: 999 },
    { heroid: 7001, level: 2, exp: 0 },
    { heroid: 7101, level: 1, exp: 0 },
  ];
  const before = structuredClone(state.heroes);
  expect(calculatePlayerPower(state, rules, context()).prinessPower).toBe(9007199254741000n);
  expect(state.heroes).toEqual(before);
});
