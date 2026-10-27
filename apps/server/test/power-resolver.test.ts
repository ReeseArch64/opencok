import { resourceOrdinaryLoadEffects } from "@opencok/rules/world-resource-effects";
import { resourceRawArmyLoad } from "@opencok/rules/world-resource-detail";
import { expect, test } from "bun:test";
import type { PowerSnapshot } from "@opencok/contracts/power";
import type { GeneralSkill } from "@opencok/hero/contracts/generals";
import { Rules } from "@opencok/rules/game";
import { dragonAttackEffect, playerGameEffect } from "@opencok/rules/power-resolver";
import { newGeneralEquipmentEffects } from "@opencok/hero/rules/new-general-equipment";

const context = { now: Date.UTC(2026, 9, 23, 12), kingdomId: 1, version: "12.06.0" };
function fixture(effect: Parameters<typeof playerGameEffect>[6] = 487) {
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
    throneRewards: [],
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
    { payControl: new Map() },
    {
      sciences: new Map(),
      sagaSciences: new Map(),
      sagaScienceBases: new Map(),
      foreignSciences: new Map(),
      foreignScienceBases: new Map(),
      civilizationSciences: new Map(),
      monarchTitles: new Map(),
      vip: new Map(),
      statuses: new Map(),
      generalSkills: new Map(),
      allianceSciences: new Map(),
      offices: new Map(),
      equipment: new Map(),
      activityEvents: new Map(),
      heroes: new Map(),
      luckyEffects: new Map(),
      activityPanels: new Map(),
      dragonSkills: new Map(),
      militarySkills: new Map(),
      prestigeLevels: new Map(),
      civilizationFeatures: new Map(),
      miracleBuffs: new Map(),
    },
  );
  const abilities: GeneralSkill[][] = [];
  const world = new Map<number, number>();
  const resolve = (version?: number | null) =>
    effect === 487
      ? dragonAttackEffect(state, rules, context, abilities, world, version)
      : playerGameEffect(state, rules, context, abilities, world, version, effect);
  return { state, rules, abilities, world, resolve };
}

test("general equipment consumes current owner equipment modifiers without feeding general pieces into player worn effects", () => {
  const f = fixture(78);
  f.rules.items.set("effect", { k1: "214;10|207;20|218;50" });
  f.state.equipment = [{ itemId: 9001, on: 1 }];
  f.rules.power.equipment!.set("9001", { para1: "214", num1: "5" });
  f.rules.power.equipment!.set("9002", { site: "0", color: "2", para1: "78", num1: "2" });
  const before = structuredClone(f.state);
  const effects = newGeneralEquipmentEffects(
    1,
    [{ itemId: 9002, extraProperty: "78,3" }],
    f.rules,
    (id) => playerGameEffect(f.state, f.rules, context, f.abilities, f.world, null, id),
  );
  expect(effects.get(78)).toBe(10.3125);
  expect(f.state).toEqual(before);
  f.rules.arms.set("troop", { load: "100" });
  expect(
    resourceRawArmyLoad(
      {
        cachedLoad: 0,
        residentOwner: true,
        soldiers: [{ armsId: "troop", total: 1, dead: 0, loadEffect: 0 }],
        effects: {
          worldLoad: 0,
          worldLoadAdd: 0,
          general: 0,
          newGeneral: effects.get(78)!,
          expedition: 0,
        },
      },
      f.rules,
    ),
  ).toBe(110);
});

for (const effect of [
  37, 78, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 487, 895, 2196,
] as const)
  test(`effect ${effect} combines every ordinary-realm source and the global equipment multiplier`, () => {
    const { state, rules, abilities, world, resolve } = fixture(effect);
    for (const id of [
      "dragon_new",
      "dragon_levelup",
      "wr_switch",
      "civilization",
      "miracle_buff",
      "luckyday_server",
    ])
      rules.features.set(id, { id, version: "12.06.0", online: "1" });
    state.profile = { allianceId: "alliance", civilizationType: 1, pf: "synthetic" };
    rules.items.set("effect", { id: "effect", k1: `${effect};2` });
    state.sciences = [{ itemId: 1000, level: 1 }];
    rules.power.sciences!.set("1001", { id: "1001", para1: `${effect}`, para2: "3" });
    state.sagaSciences = [{ itemid: 2000, level: 1 }];
    rules.power.sagaScienceBases!.set("2000", { id: "2000", hide: "0" });
    rules.power.sagaSciences!.set("102001", { id: "102001", effect: `${effect}`, value: "5" });
    state.foreignSciences = [{ itemid: 3000, level: 1 }];
    rules.power.foreignScienceBases!.set("3000", { id: "3000", hide: "0" });
    rules.power.foreignSciences!.set("103001", { id: "103001", effect: `${effect}`, value: "7" });
    state.civilizationSciences = [{ baseItemID: 4000, level: 1 }];
    rules.power.civilizationSciences!.set("4001", {
      id: "4001",
      para1: `${effect}`,
      para2: "1100",
    });
    state.throneRewards = [{ version: 7, rewardId: 1001 }];
    rules.power.monarchTitles!.set("1001", { id: "1001", effect: `${effect}`, num: "13" });
    state.vip = { score: 0, sLevel: 0, vipEndTime: BigInt(context.now + 1) };
    rules.power.vip!.set("1", { id: "1", point: "0", effect: `${effect};17` });
    state.states = [{ stateId: 5000, endTime: BigInt(context.now + 1) }];
    rules.power.statuses!.set("5000", { id: "5000", effect: `${effect};19` });
    abilities.push([{ id: "5001", points: 1 }]);
    rules.power.generalSkills!.set("5001", {
      id: "5001",
      type: "0",
      para1: `${effect}`,
      base: "23",
      add: "0",
    });
    state.allianceSciences = [{ scienceId: 6000, level: 1 }];
    rules.power.allianceSciences!.set("6001", { id: "6001", para1: `${effect}`, para2: "29" });
    state.office = { positionId: "216002", serverId: 1 };
    rules.power.offices!.set("216002", { id: "216002", para1: `${effect}`, para2: "31" });
    state.territoryTrees = [
      { allianceId: "alliance", pointId: 10, type: 42, stat: 3, level: 0, activeSkin: "default" },
    ];
    rules.items.set("life_treeavatar", { id: "life_treeavatar", k2: "default" });
    rules.configuration.payControl!.set("69014", { id: "69014", k1: "5002" });
    rules.power.statuses!.set("5002", { id: "5002", effect: `${effect};37` });
    state.equipment = [{ itemId: 9001, on: 1 }];
    rules.power.equipment!.set("9001", { id: "9001", para1: `${effect}`, num1: "41" });
    world.set(effect, 43);
    if (effect !== 218) world.set(218, 100);
    state.heroes = [{ heroid: 7001, level: 1 }];
    rules.power.heroes!.set("7001", { id: "7001", para1: `${effect};47` });
    rules.power.activityEvents!.set("9005005", {
      id: "9005005",
      k1: "2020-01-01-00-00",
      k2: "2030-01-01-00-00",
    });
    state.luckyDay = { status: 1, time: BigInt(context.now + 1), lucky_id: 1, effectId: "8001" };
    state.powerServer = { lastMergeMillis: 0n };
    rules.configuration.payControl!.set("69028", {
      id: "69028",
      k1: "12.06.0",
      k2: "all",
      k3: "all",
      k4: "1",
    });
    rules.power.activityPanels!.set("57091", {
      id: "57091",
      function_on: "1",
      start: "2020-01-01-00-00",
      end: "2030-01-01-00-00",
    });
    rules.power.luckyEffects!.set("8001", { id: "8001", effect: `${effect};53` });
    state.dragons = [{ itemId: 6001, dragonState: 3, useFlag: 1, lv: 1 }];
    state.dragonSkills = [
      { ownerId: 6001, index1: 1, skillId: "8002", level: 1, strengthenLevel: 0 },
    ];
    rules.power.dragonSkills!.set("8002", {
      id: "8002",
      type: "1",
      unlock_lv: "1",
      init_Lv: "1",
      base: `${effect};59`,
      base_add: "0",
    });
    state.military = { skill: "5003" };
    rules.power.militarySkills!.set("5003", { id: "5003", group: "1", level: "1", status: "5004" });
    rules.power.statuses!.set("5004", { id: "5004", effect: `${effect};61` });
    state.prestige = [{ civilizationType: 1, prestigeValue: 1n }];
    rules.power.prestigeLevels!.set("1", {
      id: "1",
      reputation_point: "0;100",
      reputation_level: "1",
    });
    rules.power.civilizationFeatures!.set("1", {
      id: "1",
      type: "1",
      reputation_level: "1",
      effect: `${effect};67`,
    });
    state.miracle = { level: 1 };
    rules.power.miracleBuffs!.set("1", { id: "1", order: "1", para: `${effect},71` });
    const before = structuredClone(state);
    expect(resolve(7)).toBe(effect === 218 ? 639 : 680);
    expect(resolve(null)).toBe(effect === 218 ? 626 : 667);
    expect(() => resolve()).toThrow();
    expect(state).toEqual(before);
  });

test("equipment reconstruction uses earlier worn items and excludes research loaded after equipment", () => {
  const { state, rules, resolve } = fixture();
  rules.items.set("effect", { id: "effect", k1: "207;100" });
  state.equipment = [
    { itemId: 9001, on: 1 },
    { itemId: 9002, on: 1 },
  ];
  rules.power.equipment!.set("9001", {
    id: "9001",
    site: "1",
    color: "1",
    para1: "207",
    num1: "50",
  });
  rules.power.equipment!.set("9002", {
    id: "9002",
    site: "0",
    color: "1",
    para1: "487",
    num1: "10",
  });
  state.civilizationSciences = [{ baseItemID: 4000, level: 1 }];
  rules.power.civilizationSciences!.set("4001", { id: "4001", para1: "218", para2: "10000" });
  expect(resolve()).toBe(50);
  state.equipment = [...state.equipment].reverse();
  expect(resolve()).toBe(40);
});

test("base effects are added after other effects and dragon contributions retain double precision", () => {
  const { state, rules, resolve } = fixture();
  rules.items.set("effect", { id: "effect", k1: "487;16777216" });
  state.vip = { score: 0, sLevel: 0, vipEndTime: BigInt(context.now + 1) };
  rules.power.vip!.set("1", { id: "1", point: "0", effect: "487;1" });
  state.states = [{ stateId: 5000, endTime: BigInt(context.now + 1) }];
  rules.power.statuses!.set("5000", { id: "5000", effect: "487;1" });
  expect(resolve()).toBe(16777218);
  state.states = [];
  rules.items.clear();
  rules.power.vip!.get("1")!.effect = "487;-100000000";
  for (const id of ["dragon_new", "dragon_levelup"])
    rules.features.set(id, { id, version: "12.06.0", online: "1" });
  state.dragons = [{ itemId: 6001, dragonState: 3, useFlag: 1, lv: 1 }];
  state.dragonSkills = [{ ownerId: 6001, index1: 1, skillId: "8002", level: 1 }];
  rules.power.dragonSkills!.set("8002", {
    id: "8002",
    type: "1",
    unlock_lv: "1",
    init_Lv: "1",
    base: "487;100000001",
    base_add: "0",
  });
  expect(resolve()).toBe(1);
});

test("empty effects resolve to zero while malformed equipment selections remain errors", () => {
  const { state, resolve } = fixture();
  expect(resolve()).toBe(0);
  state.profile.decomposeSuitEffect = 1;
  expect(() => resolve()).toThrow();
});

test("decomposed-set bonuses enter both equipment attributes and the final global multiplier", () => {
  const { state, rules, resolve } = fixture();
  state.profile.decomposeSuitEffect = "1;0;0";
  state.equipment = [{ itemId: 9001, on: 1 }];
  rules.power.equipment!.set("9001", { id: "9001", para1: "487", num1: "10" });
  rules.power.equipmentSets = new Map([
    ["1", { id: "1", suit_para1: "487|218", suit_num1: "5|999" }],
  ]);
  expect(resolve()).toBe(15.749999046325684);
});

test("resource ordinary load combines current effects 78 and 2196 with general-only effect 133", () => {
  const f = fixture(78);
  f.rules.items.set("effect", { k1: "78;2|2196;3|133;400" });
  f.rules.power.generalSkills!.set("load", {
    type: "0",
    para1: "78|2196|133",
    base: "5|7|11",
    add: "0|0|0",
  });
  f.abilities.push([{ id: "load", points: 1 }]);
  f.world.set(78, 13);
  f.world.set(2196, 17);
  f.world.set(133, 5000);
  const before = structuredClone(f.state);
  const effects = resourceOrdinaryLoadEffects(
    f.state,
    f.rules,
    context,
    f.abilities,
    f.world,
    undefined,
  );
  expect(effects).toEqual({ worldLoad: 20, worldLoadAdd: 27, general: 11 });
  expect(f.state).toEqual(before);
  f.rules.arms.set("troop", { load: "1" });
  expect(
    resourceRawArmyLoad(
      {
        cachedLoad: 0,
        residentOwner: true,
        soldiers: [{ armsId: "troop", total: 100, dead: 0, loadEffect: 0 }],
        effects: { ...effects, newGeneral: 30, expedition: 40 },
      },
      f.rules,
    ),
  ).toBe(228);
});

test("resource general load preserves per-general accumulation and propagates missing required catalogs", () => {
  const f = fixture(78);
  f.rules.power.generalSkills!.set("large", {
    type: "0",
    para1: "133",
    base: "16777216",
    add: "0",
  });
  f.rules.power.generalSkills!.set("small", { type: "0", para1: "133", base: "1", add: "0" });
  f.rules.power.generalSkills!.set("negative", {
    type: "0",
    para1: "133",
    base: "-16777216",
    add: "0",
  });
  f.abilities.push(
    [
      { id: "large", points: 1 },
      { id: "small", points: 1 },
    ],
    [{ id: "negative", points: 1 }],
  );
  const resolve = () =>
    resourceOrdinaryLoadEffects(f.state, f.rules, context, f.abilities, f.world, undefined);
  expect(resolve()).toEqual({ worldLoad: 0, worldLoadAdd: 0, general: 0 });
  f.rules.power.generalSkills!.delete("negative");
  expect(resolve).toThrow();
});
