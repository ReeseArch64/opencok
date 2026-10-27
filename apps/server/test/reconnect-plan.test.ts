import { importBuildingDefinition } from "@opencok/resources/buildings/import";
import { expect, test } from "bun:test";
import type { ReconnectProgressState } from "@opencok/contracts/reconnect";
import { planReconnectProgress } from "@opencok/services/reconnect-progress";
import { Rules } from "@opencok/rules/game";
import { fields, sfs } from "@opencok/messages/sfs";

function fixture() {
  const profile = {
    uid: "1001",
    serverId: 1,
    level: 1,
    pf: "market_global",
    appVersion: "12.06.0",
    civilizationType: 0,
  };
  const state: ReconnectProgressState = {
    profile,
    resource: { uid: "1001", food: 1000n, foodbind: 0n, lastUpdateTime: 0n },
    armies: [],
    generals: [],
    skills: [],
    buildings: [],
    equipment: [],
    queues: [],
    tasks: [],
    playerInfo: undefined,
    registrationPlatform: null,
    civilizationCastle: undefined,
    glory: undefined,
    weakness: [],
    walls: [],
    knight: undefined,
    items: [],
    newGenerals: { moved: false, generals: [], statuses: [], equipment: [], offices: [] },
    marches: {
      rows: [],
      teams: [],
      points: [],
      profiles: [],
      alliances: [],
      states: [],
      offices: [],
      dragons: [],
      skills: [],
      miracles: [],
      territories: [],
    },
    mine: { itemId: 100, level: 1, exp: 0, miner: 0, mineTime: 0n, call: 0 },
    effects: {
      profile,
      generals: [],
      sciences: [],
      civilizationSciences: [],
      sagaSciences: [],
      foreignSciences: [],
      equipment: [],
      heroes: [],
      dragons: [],
      dragonSkills: [],
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
    },
  };
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.reconnect.quests = [];
  rules.reconnect.treasures = new Map([["100", { id: "100", lv: "1", exp: "10", helper: "2" }]]);
  rules.items.set("on_trumpet", { k2: "all" });
  const context = { kingdomId: 1, version: "12.06.0", now: 1000 };
  const services = { worldPowerEffects: async () => new Map<string, string>() };
  const environment = {
    specialServer: false,
    cn1: null,
    random: () => 0,
    stem: () => "a".repeat(32),
  };
  return {
    state,
    rules,
    context,
    services,
    environment,
    run: () => planReconnectProgress(state, rules, context, services, environment),
  };
}

test("complete reconnect planner emits each owner section and leaves its immutable input unchanged", async () => {
  const { state, run } = fixture();
  const before = structuredClone(state);
  const result = await run();
  expect(Object.keys(result.result.body).sort()).toEqual(
    [
      "army",
      "worldMarch",
      "userGenerals",
      "resource",
      "queue",
      "task",
      "ckfTask",
      "taskCompleteNum",
      "mine",
      "gold",
      "dmmGold",
      "dmmPaidGold",
      "dmmPaidSpecialGold",
      "freeGold",
      "paidGold",
      "paidSpecialGold",
    ].sort(),
  );
  expect(fields(result.result.body.resource).food).toEqual(sfs.long(1000));
  expect(result.write.resource.lastUpdateTime).toBe(1000n);
  expect(result.result.pushes).toEqual([]);
  expect(state).toEqual(before);
});

test("upkeep respects expired and future bonuses without settling the same checkpoint twice", async () => {
  const { state, rules, run } = fixture();
  state.armies = [{ uid: "1001", armyId: "100001", free: 1, level: 1 }];
  rules.arms.set("100001", { upkeep: "86400000", new_arms: "0" });
  rules.power.statuses = new Map([["1", { effect: "64;50" }]]);
  state.effects.states = [{ stateId: 1, startTime: 0n, endTime: 500n }];
  const first = await run();
  expect(first.write.resource.food).toBe(250n);
  state.effects.states = [{ stateId: 1, startTime: 500n, endTime: 2000n }];
  expect((await run()).write.resource.food).toBe(250n);
  state.effects.states = [{ stateId: 1, startTime: 2000n, endTime: 3000n }];
  expect((await run()).write.resource.food).toBe(0n);
  state.resource.lastUpdateTime = 1000n;
  expect((await run()).write.resource.food).toBe(1000n);
});

test("starvation projects final armies, accounts for weakness and deaths, and creates one localized notification", async () => {
  const { state, rules, context, run } = fixture();
  context.now = 2100;
  state.resource.food = 100n;
  state.armies = [
    { uid: "1001", armyId: "100001", free: 10, defence: 0, pve: 0, march: 0, level: 1 },
  ];
  rules.arms.set("100001", { upkeep: "86400000", new_arms: "1", arm: "1" });
  for (const key of ["p6_all", "p6_security_resources", "p6_weak"])
    rules.features.set(key, { version: "1.0.0", online: "all" });
  rules.items.set("week_info", { k1: "1", k2: "500" });
  rules.buildings.set(
    Number("439001"),
    importBuildingDefinition({ level: "1", unlock_type: "1" }, Number("439001")),
  );
  rules.buildings.set(
    Number("441001"),
    importBuildingDefinition({ level: "1", para1: "4" }, Number("441001")),
  );
  state.buildings = [
    { uuid: "templar", itemId: 439000, level: 1, unlockFlag: 1 },
    { uuid: "hospital", itemId: 441000, level: 1 },
  ];
  rules.mail.set("12083", { title: "loss", message: "losses" });
  const result = await run();
  expect(result.write.resource.starvingMillis).toBe(2090n);
  expect(result.write.armies).toEqual([{ armyId: "100001", free: 2, defence: 0 }]);
  expect(result.write.troopChanges).toEqual([
    {
      armyId: "100001",
      freeBefore: 10,
      freeAfter: 2,
      defenceBefore: 0,
      defenceAfter: 0,
      weakened: 4,
      dead: 4,
    },
  ]);
  expect(result.write.weaknessTime).toBe(90n);
  expect(result.write.mail).toHaveLength(1);
  expect(result.result.pushes.map((push) => push.command)).toEqual([
    "army.info",
    "push.weakness.receive",
    "push.mail",
  ]);
});

test("repair notifications and invalid serialization are planned before any write can commit", async () => {
  const { state, rules, run } = fixture();
  state.generals = [
    {
      uuid: "general",
      generalId: "1001",
      level: 1,
      status: 0,
      abilityIndex: 0,
      ability: Buffer.from('[{"id":"50000","602700":1,"601300":1}]'),
    },
  ];
  rules.power.generals = new Map([["1001", { attack: "1", defence: "1" }]]);
  rules.items.set("hero_up", { k1: "0", k2: "0" });
  const result = await run();
  expect(result.write.generalResets).toEqual(["general"]);
  expect(result.write.mail[0]!.itemIdFlag).toBe(0);
  expect(result.result.pushes[0]!.body.itemIdFlag).toEqual(sfs.int(0));
  state.mine = undefined;
  await expect(run()).rejects.toThrow("Incomplete reconnect context");
});

test("user.lv ignores target input, preserves correlation, and returns only a committed owner result", async () => {
  const { GameService: Game } = await import("@opencok/services/game");
  const { state, rules, context, services } = fixture();
  let committed = false;
  const game = new Game(
    {} as import("@opencok/contracts/game").GameStore,
    rules,
    { kingdomId: 1 },
    () => context.now,
    {
      ...services,
      reconnect: async (uid, now, plan) => {
        expect(uid).toBe("1001");
        expect(now).toBe(context.now);
        const planned = await plan(state);
        expect(planned.write.resource.lastUpdateTime).toBe(1000n);
        committed = true;
        return planned.result;
      },
    },
  );
  const result = await game.execute("1001", "user.lv", {
    uid: sfs.string("foreign"),
    _cok_: sfs.long(9007199254740993n),
    cmdBaseTime: sfs.long(100),
  });
  expect(committed).toBe(true);
  expect(result.body._cok_).toEqual(sfs.long(9007199254740993n));
  expect(result.body.cmdBaseTime).toEqual(sfs.long(100));
  game.services.reconnect = async () => {
    throw new Error("Commit failed");
  };
  await expect(game.execute("1001", "user.lv", {})).rejects.toThrow("Commit failed");
});

test("login with an existing march and non-building queue reaches the full reconnect snapshot", async () => {
  const { GameService: Game } = await import("@opencok/services/game");
  const { state, rules, context, services } = fixture();
  state.world = { worldId: 0 };
  rules.roles.set("100101", { id: "100101", player_exp: "100" });
  state.queues = [{ uuid: "queue", type: 12, itemId: "one;two", para: 1 }];
  state.marches.rows = [
    {
      uuid: "march",
      ownerUid: "1001",
      ownerId: 1,
      targetId: 2,
      type: 0,
      state: 0,
      worldId: 0,
      armyInfo: null,
    },
  ];
  state.marches.profiles = [{ uid: "1001", serverId: 1, crossFightSrcServerId: -1 }];
  const store = {
    getPowerByPlayerId: async () => {
      const { emptyPowerState } = await import("./fixtures/power-state");
      return emptyPowerState(state.profile);
    },
    getCityByPlayerId: async () => ({
      ...state,
      hasMarches: true,
      lord: undefined,
      world: { worldId: 0 },
    }),
  } as unknown as import("@opencok/contracts/game").GameStore;
  const game = new Game(store, rules, { kingdomId: 1 }, () => context.now, {
    ...services,
    cityProgression: async (_owner, command) => ({
      body: {},
      pushes:
        command === "campaign.init"
          ? [
              {
                command: "push.server.action",
                body: { type: sfs.int(12), params: sfs.object({ reward_list: sfs.array([]) }) },
              },
            ]
          : [],
    }),
    expeditionActivity: async (owner) => {
      expect(owner).toBe("1001");
      return { activity: sfs.array([sfs.object({ id: sfs.string("57155") })]) };
    },
    reconnect: async (_uid, _now, plan) => (await plan(state)).result,
  });
  const initialized = await game.initialize("1001", { _cok_: sfs.int(7) });
  expect(initialized.body.activity!.value).toHaveLength(1);
  expect(
    fields((initialized.body.activity!.value as import("@opencok/messages/sfs").Value[])[0]).id,
  ).toEqual(sfs.string("57155"));
  expect(fields(initialized.body.world).m).toEqual(initialized.body.worldMarch!);
  expect(fields(initialized.body.user).level).toEqual(sfs.int(1));
  expect(initialized.body._cok_).toEqual(sfs.int(7));
  expect(initialized.body.queue!.value).toHaveLength(1);
  expect(
    initialized.pushes.find((push) => push.command === "push.server.action")?.body.type,
  ).toEqual(sfs.int(12));
});

test("an oversized correlated response fails inside the transaction planner", async () => {
  const { GameService: Game } = await import("@opencok/services/game");
  const { state, rules, context, services } = fixture();
  let committed = false;
  const game = new Game(
    {} as import("@opencok/contracts/game").GameStore,
    rules,
    { kingdomId: 1 },
    () => context.now,
    {
      ...services,
      reconnect: async (_uid, _now, plan) => {
        const result = await plan(state);
        committed = true;
        return result.result;
      },
    },
  );
  await expect(
    game.execute("1001", "user.lv", {
      _cok_: sfs.array(Array.from({ length: 20 }, () => sfs.string("x".repeat(60000)))),
    }),
  ).rejects.toThrow();
  expect(committed).toBe(false);
});

test("mobile task completion refreshes tutorial production once and a persisted retry cannot repeat it", async () => {
  const { state, rules, run } = fixture();
  state.registrationPlatform = "facebook";
  state.buildings = [{ uuid: "farm", itemId: 415000, level: 1, pos: 17, refreshTime: 1000n }];
  rules.buildings.set(
    Number("415001"),
    importBuildingDefinition({ level: "1", para1: "3600000", para2: "1000" }, Number("415001")),
  );
  rules.reconnect.quests = [
    { id: "2102501", type1: "1", type2: "34", para1: "1", para2: "1", accept1: "1", accept2: "" },
  ];
  const first = await run();
  expect(first.write.tasks.inserts).toHaveLength(1);
  expect(first.write.tasks.updates).toHaveLength(1);
  expect(first.write.buildingRefreshes).toEqual([{ uuid: "farm", refreshTime: 700n }]);
  expect(first.result.pushes.map((push) => push.command)).toEqual([
    "push.task.new",
    "push.task.complete",
    "resource.time.refresh",
  ]);
  state.resource = { ...state.resource, ...first.write.resource };
  state.tasks = first.write.tasks.inserts.map((row) => ({
    id: row.id,
    num: row.num,
    state: row.state,
    type: row.type,
  }));
  state.buildings = [{ ...state.buildings[0]!, refreshTime: 700n }];
  const retry = await run();
  expect(retry.write.tasks).toMatchObject({ inserts: [], updates: [] });
  expect(retry.write.buildingRefreshes).toEqual([]);
  expect(retry.result.pushes).toEqual([]);
  expect(retry.write.resource.food).toBe(first.write.resource.food);
});
