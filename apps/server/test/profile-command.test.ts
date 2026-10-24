import { expect, test } from "bun:test";
import type { GameServices, GameStore } from "@opencok/contracts/game";
import type { PublicProfileState, RoutedPublicProfile } from "@opencok/contracts/profile";
import type { Row } from "@opencok/contracts/rows";
import { Game } from "@opencok/controllers/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, fields, sfs, type Value } from "@opencok/messages/sfs";

const now = 1792756800000;
const unused = async (): Promise<never> => {
  throw new Error("Unexpected dependency call");
};
function fixture(remote = false) {
  const kingdomId = remote ? 2 : 1;
  const state: PublicProfileState = {
    profile: {
      uid: "2001",
      name: "Target",
      level: 5,
      exp: 12,
      serverId: kingdomId,
      allianceId: "alliance-a",
      email: "private",
      banFlag: 1,
    },
    statistics: { power: 9007199254740993n, armyKill: 9007199254740995n },
    vip: undefined,
    lord: { medal: "medal-a" },
    mixed: { showMedal: 1, showEquip: 0 },
    military: undefined,
    office: { positionId: "216002", serverId: kingdomId },
    flowers: { flowerVal: 80, eggVal: 10 },
    taverns: [{ level: 2 }],
    generals: [
      { uuid: "a", generalId: "1001", level: 5, status: 1, plusSkillPoint: 3, ability: null },
    ],
    skills: [],
    equipment: [{ uuid: "equip-a", itemId: 5001, on: 1, strengthLevel: 3 }],
    honors: [{ id: "medal-a", level: 2 }],
    completedAchievements: 2,
    alliance: {
      alliance: { uid: "alliance-a", giftlevel: 1200, maxMember: 50 },
      leader: { uid: "leader", name: "Leader" },
      totals: { member: "2", fightpower: "9007199254740993" },
      sciences: [],
      video: undefined,
      withEffects: false,
    },
  };
  const rules = new Rules(
    new Map(),
    new Map([["100105", { player_exp: "600" }]]),
    new Map(),
    undefined,
    new Map([["hero_up", { k1: "1", k2: "1" }]]),
    undefined,
    undefined,
    new Map([["equipment_strengthen", { version: "1", online: "1" }]]),
    1,
    undefined,
    undefined,
    { generals: new Map([["1001", { attack: "2", defence: "3" }]]) },
    {
      achievementCount: 4,
      servers: new Map([
        ["1", { name: "One" }],
        ["2", { name: "Two" }],
      ]),
    },
  );
  let observer: Row | undefined = {
    uid: "1001",
    allianceId: "alliance-a",
    banFlag: 0,
    banTime: 0n,
  };
  const calls: unknown[][] = [];
  const route: RoutedPublicProfile = { state, kingdomId };
  const db: GameStore = {
    profile: async (uid) => {
      calls.push(["observer", uid]);
      return observer;
    },
    mailSave: unused,
    mailStatus: unused,
    allianceRanking: unused,
    playerRanking: unused,
    publicProfile: async (uid, allianceId) => {
      calls.push(["target", uid, allianceId]);
      return route;
    },
    accounts: unused,
    city: unused,
    world: unused,
    playerSummaries: unused,
    power: unused,
    configuration: unused,
  };
  const services: GameServices = {
    playerUpdateTimes: async (id, uids) => {
      calls.push(["markers", id, ...uids]);
      return new Map([["2001", "9007199254740997"]]);
    },
  };
  let clockCalls = 0;
  const game = new Game(
    db,
    rules,
    { kingdomId: 1 },
    () => {
      clockCalls++;
      return now;
    },
    services,
  );
  return {
    state,
    route,
    db,
    rules,
    services,
    game,
    calls,
    clockCalls: () => clockCalls,
    observer: (value: Row | undefined) => {
      observer = value;
    },
  };
}

test("get.user.info composes all public providers using authenticated membership and one server clock", async () => {
  const { state, game, calls, clockCalls } = fixture();
  const before = structuredClone(state);
  const result = await game.execute("1001", "get.user.info", {
    uid: sfs.string("2001"),
    allianceId: sfs.string("wrong"),
    now: sfs.long(0),
    serverId: sfs.int(99),
    _cok_: sfs.string("correlation"),
    cmdBaseTime: sfs.long(9007199254740999n),
  });
  const wire = decode(encode(result.body));
  expect(wire.uid).toEqual(sfs.string("2001"));
  expect(wire.power).toEqual(sfs.long(9007199254740993n));
  expect(wire.armyKill).toEqual(sfs.long(9007199254740995n));
  expect(wire.maxExp).toEqual(sfs.int(600));
  expect(wire.skillPoint).toEqual(sfs.int(3));
  expect(wire.flowerVal).toEqual(sfs.int(70));
  expect(wire.officer).toEqual(sfs.string("216002"));
  expect(wire.serverId).toEqual(sfs.int(1));
  expect(wire.serverName).toEqual(sfs.string("One"));
  expect(wire.lastUpdateTime).toEqual(sfs.string("9007199254740997"));
  expect(fields((wire.userGenerals!.value as Value[])[0]).att).toEqual(sfs.int(12));
  expect(fields(fields(wire.alliance).alliance).fightpower).toEqual(sfs.double(9007199254740992));
  expect(wire._cok_).toEqual(sfs.string("correlation"));
  expect(wire.cmdBaseTime).toEqual(sfs.long(9007199254740999n));
  expect(wire).not.toHaveProperty("email");
  expect(wire).not.toHaveProperty("banFlag");
  expect(result.pushes).toEqual([]);
  expect(calls).toEqual([
    ["observer", "1001"],
    ["target", "2001", "alliance-a"],
    ["markers", 1, "2001"],
  ]);
  expect(clockCalls()).toBe(1);
  expect(state).toEqual(before);
});

test("remote full profiles use routed identity and marker namespace with legacy remote aggregate types", async () => {
  const { game, calls } = fixture(true);
  const result = await game.execute("1001", "get.user.info", { uid: sfs.string("2001") });
  expect(result.body.serverId).toEqual(sfs.int(2));
  expect(result.body.serverName).toEqual(sfs.string("Two"));
  expect(fields(fields(result.body.alliance).alliance).fightpower).toEqual(
    sfs.long(9007199254740993n),
  );
  expect(fields((result.body.equip!.value as Value[])[0]).strength_level).toEqual(sfs.int(3));
  expect(calls.at(-1)).toEqual(["markers", 2, "2001"]);
});

test("missing and banned observers or malformed targets cannot reach the target repository", async () => {
  for (const observer of [
    undefined,
    { uid: "wrong" },
    { uid: "1001", banFlag: 1 },
    { uid: "1001", banTime: BigInt(now + 1) },
  ] as (Row | undefined)[]) {
    const f = fixture();
    f.observer(observer);
    await expect(
      f.game.execute("1001", "get.user.info", { uid: sfs.string("2001") }),
    ).rejects.toThrow();
    expect(f.calls).toEqual([["observer", "1001"]]);
  }
  for (const uid of [
    undefined,
    sfs.null(),
    sfs.int(2001),
    sfs.string(" "),
    sfs.string("2001@mod"),
    sfs.string("a"),
    sfs.string("1".repeat(41)),
  ]) {
    const f = fixture();
    await expect(f.game.execute("1001", "get.user.info", uid ? { uid } : {})).rejects.toThrow();
    expect(f.calls).toEqual([["observer", "1001"]]);
  }
});

test("unknown targets, conflicting routes and incomplete providers never return partial profiles", async () => {
  for (const change of [
    (f: ReturnType<typeof fixture>) => {
      f.db.publicProfile = async () => undefined;
    },
    (f: ReturnType<typeof fixture>) => {
      f.state.profile!.uid = "other";
    },
    (f: ReturnType<typeof fixture>) => {
      f.route.kingdomId = 2;
    },
    (f: ReturnType<typeof fixture>) => {
      f.state.generals = [];
    },
    (f: ReturnType<typeof fixture>) => {
      f.state.alliance!.withEffects = true;
    },
    (f: ReturnType<typeof fixture>) => {
      f.state.alliance = undefined;
    },
    (f: ReturnType<typeof fixture>) => {
      f.rules.roles.clear();
    },
  ]) {
    const f = fixture();
    change(f);
    await expect(
      f.game.execute("1001", "get.user.info", { uid: sfs.string("2001") }),
    ).rejects.toThrow();
    expect(f.calls.some((call) => call[0] === "markers")).toBe(false);
  }
});

test("missing update markers use an empty string and cache failures propagate without state writes", async () => {
  const f = fixture();
  f.services.playerUpdateTimes = async () => new Map();
  expect(
    (await f.game.execute("1001", "get.user.info", { uid: sfs.string("2001") })).body
      .lastUpdateTime,
  ).toEqual(sfs.string(""));
  f.services.playerUpdateTimes = async () => {
    throw new Error("Synthetic cache failure");
  };
  const before = structuredClone(f.state);
  await expect(
    f.game.execute("1001", "get.user.info", { uid: sfs.string("2001") }),
  ).rejects.toThrow("Synthetic cache failure");
  expect(f.state).toEqual(before);
});
