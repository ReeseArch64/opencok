import { expect, test } from "bun:test";
import type { GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import type { PlayerRankingQuery, PlayerRankingSnapshot } from "@opencok/contracts/ranking";
import { Game } from "@opencok/controllers/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const now = 1792756800000;
const unused = async (): Promise<never> => {
  throw new Error("Unexpected dependency call");
};
function fixture() {
  const calls: { uid: string; query: PlayerRankingQuery }[] = [];
  let clockReads = 0;
  const state: PlayerRankingSnapshot = {
    profile: { uid: "self", serverId: 1, banFlag: 0, banTime: 0n, level: 4 },
    candidates: [
      {
        uid: "self",
        profileUid: "self",
        name: "Self",
        power: 2147483648n,
        armyKill: 9n,
        level: 4,
        exp: 10,
        banTime: 0n,
        pic: "",
        picVer: 0,
        picfraId: 0,
        allianceId: "",
      },
    ],
    fallbackRank: 1n,
  };
  const db: GameStore = {
    profile: unused,
    accounts: unused,
    publicProfile: unused,
    power: unused,
    playerSummaries: unused,
    configuration: unused,
    city: unused,
    world: unused,
    allianceRanking: unused,
    playerRanking: async (uid, query) => {
      calls.push({ uid, query });
      return state;
    },
  };
  const rules = new Rules(
    new Map(),
    new Map(),
    new Map(),
    undefined,
    new Map([["ranking", { k2: "2" }]]),
  );
  const game = new Game(db, rules, { kingdomId: 1 }, () => {
    clockReads++;
    return now;
  });
  return { state, db, rules, game, calls, clockReads: () => clockReads };
}

test("all three ranking commands use authenticated identity, one clock and shared response correlation", async () => {
  for (const [command, kind, metric] of [
    ["server.rank", "power", { power: sfs.long(2147483648n) }],
    ["kill.rank", "kills", { armyKill: sfs.int(9) }],
    ["level.rank", "level", { level: sfs.int(4), exp: sfs.int(10), banTime: sfs.int(0) }],
  ] as const) {
    const { game, calls, clockReads } = fixture();
    const params = {
      uid: sfs.string("forged"),
      offset: sfs.int(999),
      limit: sfs.int(999),
      _cok_: sfs.string("correlation"),
      cmdBaseTime: sfs.long(12345),
    };
    const result = await game.execute("self", command, params);
    expect(calls).toEqual([{ uid: "self", query: { kind, limit: 2, now, hideGm: false } }]);
    expect(clockReads()).toBe(1);
    expect(result.pushes).toEqual([]);
    expect(decode(encode(result.body))).toEqual({
      selfRanking: sfs.int(1),
      serverRanking: sfs.array([
        sfs.object({
          uid: sfs.string("self"),
          name: sfs.string("Self"),
          pic: sfs.string(""),
          picVer: sfs.int(0),
          picfraId: sfs.int(0),
          ...metric,
        }),
      ]),
      _cok_: params._cok_,
      cmdBaseTime: params.cmdBaseTime,
    });
  }
});

test("ranking authentication and required provider failures never produce a successful partial board", async () => {
  const profiles: (Row | undefined)[] = [
    undefined,
    { uid: "self", serverId: 1, banFlag: 1 },
    { uid: "self", serverId: 1, banTime: BigInt(now + 1) },
    { uid: "other", serverId: 1 },
    { uid: "self", serverId: 2 },
  ];
  for (const profile of profiles) {
    const { game, state } = fixture();
    state.profile = profile;
    await expect(game.execute("self", "server.rank", {})).rejects.toThrow();
  }
  const failure = fixture();
  failure.db.playerRanking = async () => {
    throw new Error("Synthetic provider failure");
  };
  await expect(failure.game.execute("self", "level.rank", {})).rejects.toThrow(
    "Synthetic provider failure",
  );
  const malformed = fixture();
  malformed.rules.items.get("ranking")!.k2 = "0";
  await expect(malformed.game.execute("self", "kill.rank", {})).rejects.toThrow("102192");
  expect(malformed.calls).toEqual([]);
});
