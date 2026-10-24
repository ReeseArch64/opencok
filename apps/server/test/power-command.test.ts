import { expect, test } from "bun:test";
import type { GameStore } from "@opencok/contracts/game";
import type { PowerState } from "@opencok/contracts/power";
import type { Row } from "@opencok/contracts/rows";
import { Game } from "@opencok/controllers/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const now = 1792756800000;
const unused = async (): Promise<never> => {
  throw new Error("Unexpected dependency call");
};
function fixture() {
  const state: PowerState = {
    profile: { uid: "synthetic", level: 5, banTime: 0n, banFlag: 0, deviceId: "private-synthetic" },
    statistics: { battlesWin: 3, questPower: 7, armyKill: 9007199254740993n },
    armies: [{ armyId: "107001", free: 3, train: 99 }],
    generals: [],
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
    upload: { updateTime: 9007199254740993n, banTime: 9007199254740995n, banCount: 2 },
  };
  const rules = new Rules(
    new Map(),
    new Map([["100105", { id: "100105", power: "100" }]]),
    new Map(),
  );
  rules.arms.set("107001", { id: "107001", power: "1.5" });
  rules.items.set("hero", { id: "hero", k7: "60" });
  const calls: { uid: string; now: number }[] = [];
  const db: GameStore = {
    profile: unused,
    accounts: unused,
    playerSummaries: unused,
    configuration: unused,
    city: unused,
    world: unused,
    power: async (uid, time) => {
      calls.push({ uid, now: time });
      return state;
    },
  };
  let clockCalls = 0;
  const game = new Game(db, rules, { kingdomId: 1 }, () => now + clockCalls++);
  return { game, db, rules, state, calls, clockCalls: () => clockCalls };
}

test("get.power.info uses one authenticated snapshot and returns legacy widths with correlation", async () => {
  const { game, state, calls, clockCalls } = fixture();
  const before = structuredClone(state);
  const result = await game.execute("synthetic", "get.power.info", {
    uid: sfs.string("other-player"),
    now: sfs.long(0),
    _cok_: sfs.string("power-correlation"),
    cmdBaseTime: sfs.long(9007199254740997n),
  });
  expect(result.pushes).toEqual([]);
  expect(decode(encode(result.body))).toEqual({
    battleWin: sfs.int(3),
    battleLose: sfs.int(0),
    attackWin: sfs.int(0),
    attackLose: sfs.int(0),
    defenseWin: sfs.int(0),
    detectNum: sfs.int(0),
    armyDead: sfs.int(0),
    armyCure: sfs.int(0),
    cityDes: sfs.int(0),
    armyKill: sfs.long(9007199254740993n),
    playerPower: sfs.int(100),
    heroPower: sfs.int(0),
    buildingPower: sfs.int(0),
    sciencePower: sfs.int(0),
    civilizationSciencePower: sfs.int(0),
    questpower: sfs.int(7),
    equipPower: sfs.int(0),
    knight_title: sfs.int(0),
    sagatower_science: sfs.int(0),
    armyPower: sfs.long(4),
    fortPower: sfs.long(0),
    petDragonPower: sfs.long(0),
    prinessPower: sfs.long(0),
    nextUpdateTime: sfs.long(9007199254800993n),
    banTime: sfs.long(9007199254740995n),
    banCount: sfs.int(2),
    _cok_: sfs.string("power-correlation"),
    cmdBaseTime: sfs.long(9007199254740997n),
  });
  expect(calls).toEqual([{ uid: "synthetic", now }]);
  expect(clockCalls()).toBe(1);
  expect(state).toEqual(before);
});

test("power requests reject missing, banned and mismatched snapshot owners", async () => {
  const profiles: (Row | undefined)[] = [
    undefined,
    { uid: "other", level: 5 },
    { uid: "synthetic", banFlag: 1 },
    { uid: "synthetic", banTime: BigInt(now + 1) },
  ];
  for (const profile of profiles) {
    const { game, state } = fixture();
    state.profile = profile;
    await expect(game.execute("synthetic", "get.power.info", {})).rejects.toThrow();
  }
  const { game, state } = fixture();
  state.profile!.banTime = BigInt(now);
  expect((await game.execute("synthetic", "get.power.info", {})).body.playerPower).toEqual(
    sfs.int(100),
  );
});

test("command failure preserves state and never substitutes missing catalogs or unresolved dragon effects", async () => {
  const { game, rules, state } = fixture();
  for (const id of ["dragon_new", "dragon_levelup", "dragon_science"])
    rules.features.set(id, { id, version: "99.0.0", online: "1" });
  state.dragons = [{ itemId: 6001, dragonState: 3, lv: 2 }];
  await expect(
    game.execute("synthetic", "get.power.info", { dragonAttackPercent: sfs.int(0) }),
  ).rejects.toThrow("102192");
  expect(state.dragons).toEqual([{ itemId: 6001, dragonState: 3, lv: 2 }]);
  rules.features.delete("dragon_science");
  rules.items.set("dragon_new", { id: "dragon_new", k10: "10", k11: "2", k12: "3" });
  rules.power.dragonBases = new Map([["6001", { id: "6001", initFight: "120" }]]);
  rules.power.dragonLevels = new Map([
    ["5001", { id: "5001", base_id: "6001", level: "2", attack: "100" }],
  ]);
  expect((await game.execute("synthetic", "get.power.info", {})).body.petDragonPower).toEqual(
    sfs.long(420),
  );
  rules.roles.clear();
  await expect(game.execute("synthetic", "get.power.info", {})).rejects.toThrow("102192");
});

test("storage failures propagate without returning a partial power result", async () => {
  const { game, db } = fixture();
  db.power = async () => {
    throw new Error("Synthetic storage failure");
  };
  await expect(game.execute("synthetic", "get.power.info", {})).rejects.toThrow(
    "Synthetic storage failure",
  );
});

function enableDragon(input: ReturnType<typeof fixture>) {
  const { state, rules } = input;
  for (const id of ["dragon_new", "dragon_levelup", "dragon_science"])
    rules.features.set(id, { id, version: "99.0.0", online: "1" });
  state.dragons = [{ itemId: 6001, dragonState: 3, lv: 2, useFlag: 0 }];
  rules.items.set("dragon_new", { id: "dragon_new", k10: "10", k11: "2", k12: "3" });
  rules.power.dragonBases = new Map([["6001", { id: "6001", initFight: "120" }]]);
  rules.power.dragonLevels = new Map([
    ["5001", { id: "5001", base_id: "6001", level: "2", attack: "100" }],
  ]);
}

test("science-enabled dragon power resolves server effects and ignores client modifier overrides", async () => {
  const f = fixture();
  enableDragon(f);
  let reads = 0;
  f.game.services.worldPowerEffects = async () => {
    reads++;
    return new Map([["487", `{"value":"20","endTime":${now + 1}}`]]);
  };
  f.game.services.emperorVersion = unused;
  const before = structuredClone(f.state);
  const result = await f.game.execute("synthetic", "get.power.info", {
    dragonAttackPercent: sfs.int(9999),
    now: sfs.long(0),
    uid: sfs.string("other"),
  });
  expect(decode(encode(result.body)).petDragonPower).toEqual(sfs.long(552));
  expect(result.pushes).toEqual([]);
  expect(reads).toBe(1);
  expect(f.clockCalls()).toBe(1);
  expect(f.calls).toEqual([{ uid: "synthetic", now }]);
  expect(f.state).toEqual(before);
});

test("saved personal throne rewards require explicit emperor state before returning dragon power", async () => {
  const f = fixture();
  enableDragon(f);
  f.state.throneRewards = [{ version: 7, rewardId: 1001 }];
  f.rules.power.monarchTitles = new Map([["1001", { id: "1001", effect: "487", num: "10" }]]);
  f.game.services.worldPowerEffects = async () => new Map();
  await expect(f.game.execute("synthetic", "get.power.info", {})).rejects.toThrow("102192");
  f.game.services.emperorVersion = async () => null;
  expect((await f.game.execute("synthetic", "get.power.info", {})).body.petDragonPower).toEqual(
    sfs.long(420),
  );
  f.game.services.emperorVersion = async () => 7;
  expect((await f.game.execute("synthetic", "get.power.info", {})).body.petDragonPower).toEqual(
    sfs.long(483),
  );
});

test("world effect failures reject dependent dragon queries and unused services are never called", async () => {
  const f = fixture();
  f.game.services.worldPowerEffects = unused;
  f.game.services.emperorVersion = unused;
  expect((await f.game.execute("synthetic", "get.power.info", {})).body.petDragonPower).toEqual(
    sfs.long(0),
  );
  enableDragon(f);
  await expect(f.game.execute("synthetic", "get.power.info", {})).rejects.toThrow(
    "Unexpected dependency call",
  );
  f.game.services.worldPowerEffects = async () => new Map([["487", '{"value":20}']]);
  await expect(f.game.execute("synthetic", "get.power.info", {})).rejects.toThrow("102192");
  f.rules.features.delete("dragon_science");
  f.game.services.worldPowerEffects = unused;
  expect((await f.game.execute("synthetic", "get.power.info", {})).body.petDragonPower).toEqual(
    sfs.long(420),
  );
});
