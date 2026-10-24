import { expect, test } from "bun:test";
import type { GameStore, GameServices } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { Game } from "@opencok/controllers/game";
import { decode, encode, fields, sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { Rules } from "@opencok/rules/game";
import { Cache } from "@opencok/storage/session";
import { readNormalRankingRealm } from "../../../packages/repositories/src/ranking-realm.ts";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";

const boards = [
  [0, "global_kill_ranking", 150],
  [1, "global_power_rank", 150],
  [2, "global_train_rank", 150],
  [3, "global_attack_wins_ranking", 150],
  [4, "global_defence_wins_ranking", 29],
  [5, "global_power_rank", 150],
  [6, "global_honor_point_rank", 150],
  [11, "global_military_point_rank", 150],
] as const;

function fixture() {
  let profile: Row | undefined = { uid: "self", serverId: 2, banFlag: 0, banTime: 0n };
  let normal = true;
  let response: unknown = ['{"uid":"a","power":9007199254740993,"rank":1}', '{"uid":"a","rank":2}'];
  const reads: string[] = [];
  const commands: unknown[][] = [];
  const cache = new Cache({ redisUrl: "unused", timeoutMs: 1, kingdomId: 2 });
  cache.command = async (...args) => {
    commands.push(args);
    if (response instanceof Error) throw response;
    return response;
  };
  const store = {
    async normalRankingRealm() {
      reads.push("realm");
      return normal;
    },
    async getProfileById() {
      reads.push("owner");
      return profile;
    },
  };
  const services: GameServices = {
    globalCelebrityRanking: (rankType) => cache.globalCelebrityRanking(rankType),
  };
  const config = { kingdomId: 2 };
  const game = new Game(
    store as unknown as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    config,
    () => 1000,
    services,
  );
  return {
    reads,
    commands,
    services,
    config,
    normal: (value: boolean) => {
      normal = value;
    },
    response: (value: unknown) => {
      response = value;
    },
    profile: (value: Row | undefined) => {
      profile = value;
    },
    run: (params: Fields = { rankType: sfs.int(0) }) =>
      game.execute("self", "global.celebrities.rank", params),
  };
}

test("global celebrity rankings preserve category aliases, inclusive bounds, row order and exact wire values", async () => {
  const f = fixture();
  for (const [rankType, prefix, end] of boards) {
    const result = await f.run({
      rankType: sfs.int(rankType),
      _cok_: sfs.string("request"),
      serverId: sfs.int(1),
    });
    const body = decode(encode(result.body));
    const rows = (body.rankMap!.value as Value[]).map(fields);
    expect(rows).toEqual([
      { uid: sfs.string("a"), power: sfs.long(9007199254740993n), rank: sfs.int(1) },
      { uid: sfs.string("a"), rank: sfs.int(2) },
    ]);
    expect(Object.keys(rows[0]!)).toEqual(["uid", "power", "rank"]);
    expect(body._cok_).toEqual(sfs.string("request"));
    expect(result.pushes).toEqual([]);
    expect(f.commands.at(-1)).toEqual(["LRANGE", `${prefix}_2`, "0", String(end)]);
  }
  expect(f.reads).toEqual(boards.flatMap(() => ["realm", "owner"]));
});

test("global celebrity realm gates run before selector decoding and unsupported categories skip cache", async () => {
  const f = fixture();
  f.normal(false);
  expect((await f.run({ rankType: sfs.string("ignored") })).body).toEqual({
    success: sfs.bool(true),
  });
  expect(f.reads).toEqual(["realm"]);
  f.config.kingdomId = 1000000;
  expect((await f.run({})).body).toEqual({ success: sfs.bool(true) });
  expect(f.reads).toEqual(["realm"]);
  f.config.kingdomId = 2;
  f.normal(true);
  expect((await f.run({ rankType: sfs.int(7) })).body).toEqual({ success: sfs.bool(true) });
  expect(f.reads).toEqual(["realm", "realm", "owner"]);
  expect(f.commands).toEqual([]);
});

test("global celebrity rankings reject invalid selectors, owners, missing providers and reached failures", async () => {
  const f = fixture();
  for (const params of [{} as Fields, { rankType: sfs.string("1") }, { rankType: sfs.short(1) }])
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
  f.profile({ uid: "self", serverId: 2 });
  f.response([]);
  expect((await f.run()).body.rankMap).toEqual(sfs.array());
  f.response(new Error("Synthetic Redis outage"));
  await expect(f.run()).rejects.toThrow();
  delete f.services.globalCelebrityRanking;
  await expect(f.run()).rejects.toMatchObject({ code: "102192" });
});

test("global celebrity rankings reject malformed, over-limit and unencodable boards without truncation", async () => {
  const f = fixture();
  for (const response of [
    null,
    [1],
    ["\ud800"],
    ["[]"],
    ["{"],
    Array(152).fill("{}"),
    ['{"text":"' + "a".repeat(32768) + '"}'],
    Array(151).fill(" ".repeat(28000) + "{}"),
  ]) {
    f.response(response);
    await expect(f.run()).rejects.toThrow();
  }
  f.response(Array(31).fill("{}"));
  await expect(f.run({ rankType: sfs.int(4) })).rejects.toThrow();
  for (const [rankType, length] of [
    [4, 30],
    [0, 151],
  ] as const) {
    f.response(Array(length).fill("{}"));
    expect(
      ((await f.run({ rankType: sfs.int(rankType) })).body.rankMap!.value as Value[]).length,
    ).toBe(length);
  }
});

test("global ranking metadata distinguishes SQLSTATE fallback from malformed rows and transport failure", async () => {
  let rows: unknown[] = [[2, 0]];
  let failure: Error | undefined;
  const client = {
    async query() {
      if (failure) throw failure;
      return { rows };
    },
  };
  const db = drizzle(client as unknown as NodePgClient) as Parameters<
    typeof readNormalRankingRealm
  >[0];
  for (const type of [0, 1, 6, 23]) {
    rows = [[2, type]];
    expect(await readNormalRankingRealm(db, 2)).toBe(true);
  }
  rows = [[2, 2]];
  expect(await readNormalRankingRealm(db, 2)).toBe(false);
  rows = [];
  expect(await readNormalRankingRealm(db, 2)).toBe(false);
  for (const row of [
    [3, 0],
    [2, null],
    [2, 1.5],
  ]) {
    rows = [row];
    await expect(readNormalRankingRealm(db, 2)).rejects.toThrow();
  }
  failure = Object.assign(new Error("Synthetic SQL error"), { code: "42P01" });
  expect(await readNormalRankingRealm(db, 2)).toBe(false);
  failure = new Error("Synthetic transport failure");
  await expect(readNormalRankingRealm(db, 2)).rejects.toThrow();
});
