import { expect, test } from "bun:test";
import type { GameServices, GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { Game } from "@opencok/controllers/game";
import { decode, encode, fields, sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { Rules } from "@opencok/rules/game";
import { dragonRankingRanges } from "@opencok/rules/dragon-ranking";
import { Cache } from "@opencok/storage/session";

const team = (teamId: string, values: Record<string, unknown> = {}) =>
  JSON.stringify({
    teamId,
    teamName: `Team ${teamId}`,
    leaderName: "Leader",
    state: 1,
    score: 25,
    kingId: 2,
    kingName: "Realm",
    fightNum: 4,
    winNum: 3,
    curmember: 10,
    maxmember: 20,
    fighting: 0,
    fightPower: "9223372036854775807",
    icon: "portrait",
    abbr: "TAG",
    ...values,
  });
const rows = (body: Fields) => (body.rank!.value as Value[]).map(fields);

function fixture() {
  let profile: Row | undefined = {
    uid: "self",
    serverId: 2,
    allianceId: " own ",
    banFlag: 0,
    banTime: 0n,
  };
  const responses: unknown[] = [];
  const commands: unknown[][] = [];
  const cache = new Cache({ redisUrl: "unused", timeoutMs: 1, kingdomId: 2 });
  cache.command = async (...args) => {
    commands.push(args);
    if (!responses.length) throw new Error("Unexpected cache call");
    const value = responses.shift();
    if (value instanceof Error) throw value;
    return value;
  };
  const services: GameServices = {
    dragonRanking: (ranges, allianceId) => cache.dragonRanking(ranges, allianceId),
  };
  const store = {
    async getProfileById() {
      return profile;
    },
  };
  const game = new Game(
    store as unknown as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 2 },
    () => 1000,
    services,
  );
  return {
    responses,
    commands,
    cache,
    services,
    profile: (value: Row | undefined) => {
      profile = value;
    },
    run: (params: Fields = {}) =>
      game.execute("self", "dragon.battle.rank", { index_limit: sfs.string("0|2"), ...params }),
  };
}

test("Dragon Battle ranges retain Java splitting, digit parsing, caps and signed overflow", () => {
  expect(dragonRankingRanges("")).toBeUndefined();
  expect(dragonRankingRanges("0|1;".repeat(35))).toBeUndefined();
  expect(dragonRankingRanges(";;;")).toEqual([]);
  expect(dragonRankingRanges("+٠|٢;5|999|ignored;-1|0;0|-1;2147483647|2;")).toEqual([
    { start: 0, end: 1 },
    { start: 5, end: 204 },
    { start: -1, end: -2 },
    { start: 0, end: -2 },
    { start: 2147483647, end: -2147483648 },
  ]);
  for (const value of ["0", "|1", "0|", "0| 1", "2147483648|1", "0|1;;1|1"])
    expect(() => dragonRankingRanges(value)).toThrow();
});

test("Dragon Battle preserves requested order, duplicates, self append and public SFS fields", async () => {
  const f = fixture();
  const first = team("a");
  const second = team("b", { fightNum: 0, winNum: 9, privateToken: "must-not-leak" });
  f.responses.push([first, second], [first], "1", second);
  const result = await f.run({
    index_limit: sfs.string("0|2;0|1"),
    allianceId: sfs.string("ignored"),
    _cok_: sfs.string("request"),
    cmdBaseTime: sfs.long(9007199254740993n),
  });
  const body = decode(encode(result.body));
  const ranking = rows(body);
  expect(ranking.map((row) => row.teamId!.value)).toEqual(["a", "b", "a", "b"]);
  expect(ranking.map((row) => row.rankNum)).toEqual([
    sfs.int(1),
    sfs.int(2),
    sfs.int(1),
    sfs.int(2),
  ]);
  expect(ranking[0]).toEqual({
    teamId: sfs.string("a"),
    allianceId: sfs.string("a"),
    name: sfs.string("Team a"),
    leader: sfs.string("Leader"),
    teamState: sfs.int(1),
    score: sfs.int(25),
    kingId: sfs.int(2),
    kingName: sfs.string("Realm"),
    wins: sfs.double(0.75),
    wins2: sfs.int(75),
    curmember: sfs.int(10),
    maxmember: sfs.int(20),
    fighting: sfs.int(0),
    fightPower: sfs.long(9223372036854775807n),
    icon: sfs.string("portrait"),
    rankNum: sfs.int(1),
    abbr: sfs.string("TAG"),
    type: sfs.int(0),
  });
  expect(ranking[1]!.wins).toEqual(sfs.int(0));
  expect(ranking[1]!.wins2).toEqual(sfs.int(0));
  expect(ranking[1]!.privateToken).toBeUndefined();
  expect(body._cok_).toEqual(sfs.string("request"));
  expect(body.cmdBaseTime).toEqual(sfs.long(9007199254740993n));
  expect(result.pushes).toEqual([]);
  expect(f.commands).toEqual([
    ["LRANGE", "dragon_battle_rank_data_key", "0", "1"],
    ["LRANGE", "dragon_battle_rank_data_key", "0", "0"],
    ["ZREVRANK", "dragon_battle_rank_key", " own "],
    ["LINDEX", "dragon_battle_rank_data_key", "1"],
  ]);
});

test("Dragon Battle rank/percentage arithmetic keeps signed boundaries and exact Long literals", async () => {
  const f = fixture();
  f.profile({ uid: "self", serverId: 2, allianceId: "" });
  f.responses.push([
    '{"teamId":"literal","fightPower":-9223372036854775808}',
    team("negative", { fightNum: 1, winNum: -2147483648 }),
    team("capped", { fightNum: 1, winNum: 2 }),
  ]);
  const ranking = rows((await f.run({ index_limit: sfs.string("2147483647|2") })).body);
  expect(ranking.map((row) => row.rankNum)).toEqual([
    sfs.int(-2147483648),
    sfs.int(-2147483647),
    sfs.int(-2147483646),
  ]);
  expect(ranking[0]!.fightPower).toEqual(sfs.long(-9223372036854775808n));
  expect(ranking[0]!.name).toEqual(sfs.string(""));
  expect(ranking[1]!.wins2).toEqual(sfs.int(-2147483648));
  expect(ranking[2]!.wins2).toEqual(sfs.int(100));
});

test("Dragon Battle empty inputs and reached read failures retain their distinct envelopes", async () => {
  const f = fixture();
  for (const input of ["", "0|1;".repeat(35)])
    expect((await f.run({ index_limit: sfs.string(input) })).body).toEqual({
      success: sfs.bool(true),
    });
  expect(f.commands).toEqual([]);
  f.responses.push(new Error("Synthetic list outage"), new Error("Synthetic rank outage"));
  expect((await f.run()).body.rank).toEqual(sfs.array());
  f.responses.push([], 3, null);
  expect((await f.run()).body.rank).toEqual(sfs.array());
  delete f.services.dragonRanking;
  await expect(f.run()).rejects.toMatchObject({ code: "102192" });
});

test("Dragon Battle rejects invalid input and unauthorized owners before reading the board", async () => {
  const f = fixture();
  for (const params of [{ index_limit: sfs.int(1) }, { index_limit: sfs.string("0|invalid") }])
    await expect(f.run(params)).rejects.toThrow();
  const profiles: (Row | undefined)[] = [
    undefined,
    { uid: "other", serverId: 2 },
    { uid: "self", serverId: 1 },
    { uid: "self", serverId: 2, banFlag: 1 },
    { uid: "self", serverId: 2, banTime: 1001n },
  ];
  for (const profile of profiles) {
    f.profile(profile);
    await expect(f.run()).rejects.toThrow();
  }
  expect(f.commands).toEqual([]);
});

test("Dragon Battle rejects malformed records, invalid self ranks and complete capacity overflows", async () => {
  const invalid: unknown[] = [
    "not a list",
    [null],
    ["\ud800"],
    ["[]"],
    ["{}"],
    ["{"],
    [team("x", { fightPower: "9223372036854775808" })],
    [team("x", { score: 2147483648 })],
    [team("x", { teamName: "a".repeat(32768) })],
    ["a".repeat(65536)],
    Array(32768).fill(team("x")),
    Array(66).fill(team("x", { teamName: "a".repeat(65000) })),
  ];
  for (const response of invalid) {
    const f = fixture();
    f.profile({ uid: "self", serverId: 2, allianceId: "" });
    f.responses.push(response);
    await expect(f.run()).rejects.toThrow();
  }
  for (const rank of [-1, "-1", "9223372036854775808", 9007199254740992, {}, true]) {
    const f = fixture();
    f.responses.push([], rank);
    await expect(f.run()).rejects.toThrow();
  }
});
