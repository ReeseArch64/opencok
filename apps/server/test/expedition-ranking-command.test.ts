import { expect, test } from "bun:test";
import type { GameServices, GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { Game } from "@opencok/controllers/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";

const now = 1792756800000;
const unused = async (): Promise<never> => {
  throw new Error("Unexpected dependency call");
};
function fixture() {
  let clocks = 0;
  const calls: unknown[] = [];
  const owner: { profile: Row | undefined } = {
    profile: { uid: "self", serverId: 2, banFlag: 0, banTime: 0n },
  };
  const db: GameStore = {
    profile: async (uid) => {
      calls.push(uid);
      return owner.profile;
    },
    accounts: unused,
    city: unused,
    world: unused,
    configuration: unused,
    power: unused,
    playerSummaries: unused,
    publicProfile: unused,
    playerRanking: unused,
    mailStatus: unused,
    allianceRanking: unused,
  };
  const services: GameServices = {
    expeditionRanking: async (limit) => {
      calls.push(limit);
      return [
        {
          uid: "self",
          score: 12.9,
          info: '{"name":"Self","pic":"portrait","picVer":2,"abbr":"A","serverId":2,"power":100}',
        },
      ];
    },
  };
  const rules = new Rules(
    new Map(),
    new Map(),
    new Map(),
    undefined,
    new Map([["ranking", { k2: "3" }]]),
    undefined,
    undefined,
    undefined,
    2,
  );
  const game = new Game(
    db,
    rules,
    { kingdomId: 2 },
    () => {
      clocks++;
      return now;
    },
    services,
  );
  return { owner, db, services, rules, game, calls, clocks: () => clocks };
}

test("expedition command authenticates the local owner and preserves correlation without accepting client realm or score overrides", async () => {
  const { game, calls, clocks } = fixture();
  const result = await game.execute("self", "expedition.rank", {
    uid: sfs.string("forged"),
    serverId: sfs.int(9),
    limit: sfs.int(999),
    score: sfs.int(999),
    _cok_: sfs.string("request"),
    cmdBaseTime: sfs.long(99),
  });
  expect(calls).toEqual(["self", 3]);
  expect(clocks()).toBe(1);
  expect(result.pushes).toEqual([]);
  expect(decode(encode(result.body))).toEqual({
    selfRanking: sfs.int(1),
    serverRanking: sfs.array([
      sfs.object({
        uid: sfs.string("self"),
        score: sfs.int(12),
        rank: sfs.int(1),
        name: sfs.string("Self"),
        pic: sfs.string("portrait"),
        picVer: sfs.int(2),
        abbr: sfs.string("A"),
        serverId: sfs.int(2),
        power: sfs.int(100),
      }),
    ]),
    _cok_: sfs.string("request"),
    cmdBaseTime: sfs.long(99),
  });
});

test("expedition rejects unauthorized owners, missing providers and malformed dependency state", async () => {
  const profiles: (Row | undefined)[] = [
    undefined,
    { uid: "self", serverId: 2, banFlag: 1 },
    { uid: "self", serverId: 2, banTime: BigInt(now + 1) },
    { uid: "other", serverId: 2 },
    { uid: "self", serverId: 1 },
  ];
  for (const profile of profiles) {
    const { owner, game, calls } = fixture();
    owner.profile = profile;
    await expect(game.execute("self", "expedition.rank", {})).rejects.toThrow();
    expect(calls).toEqual(["self"]);
  }
  const noProvider = fixture();
  delete noProvider.services.expeditionRanking;
  await expect(noProvider.game.execute("self", "expedition.rank", {})).rejects.toThrow("102192");
  const wrongRealm = fixture();
  await expect(
    new Game(
      wrongRealm.db,
      wrongRealm.rules,
      { kingdomId: 1 },
      () => now,
      wrongRealm.services,
    ).execute("self", "expedition.rank", {}),
  ).rejects.toThrow();
  expect(wrongRealm.calls).toEqual([]);
  const invalidLimit = fixture();
  invalidLimit.rules.items.get("ranking")!.k2 = "0";
  await expect(invalidLimit.game.execute("self", "expedition.rank", {})).rejects.toThrow();
  expect(invalidLimit.calls).toEqual(["self"]);
  const failure = fixture();
  failure.services.expeditionRanking = async () => {
    throw new Error("Synthetic cache failure");
  };
  await expect(failure.game.execute("self", "expedition.rank", {})).rejects.toThrow(
    "Synthetic cache failure",
  );
  const absent = fixture();
  absent.services.expeditionRanking = async () => undefined;
  expect(
    (await absent.game.execute("self", "expedition.rank", { _cok_: sfs.int(3) })).body,
  ).toEqual({ success: sfs.bool(true), _cok_: sfs.int(3) });
});

test("empty expedition results receive the legacy success acknowledgment with or without correlation", async () => {
  for (const entries of [undefined, []]) {
    const { game, services } = fixture();
    services.expeditionRanking = async () => entries;
    const requests: Fields[] = [
      {},
      { _cok_: sfs.string("request") },
      { cmdBaseTime: sfs.long(123) },
      { _cok_: sfs.string("request"), cmdBaseTime: sfs.long(123) },
    ];
    for (const params of requests) {
      const result = await game.execute("self", "expedition.rank", params);
      expect(decode(encode(result.body))).toEqual({ success: sfs.bool(true), ...params });
      expect(result.pushes).toEqual([]);
    }
  }
});
