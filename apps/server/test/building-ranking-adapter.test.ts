import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { readPlayerRanking } from "@opencok/repositories/ranking";
import type { PlayerRankingQuery } from "@opencok/contracts/ranking";

const query: PlayerRankingQuery = { kind: "building", limit: 2, hideGm: false, now: 1792756800000 };
function database(
  options: {
    inWindow?: boolean;
    emptyBoard?: boolean;
    missingCastle?: boolean;
    duplicateCastles?: boolean;
    noStats?: boolean;
    duplicateOffsets?: boolean;
    missingCount?: boolean;
    fail?: string;
  } = {},
) {
  const queries: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (statement: { text: string }, params: unknown[] = []) => {
      const text = statement.text;
      queries.push({ text, params });
      const fail = (phase: string) => {
        if (options.fail === phase) throw new Error(`Synthetic ${phase} failure`);
      };
      if (text.startsWith('select "uid", "level", "serverId"'))
        return { rows: [["self", 20, 1, "0", 0]] };
      if (text.includes('left join "opencok_kingdom"."alliance"')) {
        fail("board");
        return {
          rows: options.emptyBoard
            ? []
            : [
                [
                  "castle",
                  options.inWindow ? "self" : "other",
                  "123",
                  30,
                  1,
                  "Name",
                  "portrait",
                  2,
                  3,
                  "missing",
                  "0",
                  null,
                  null,
                  null,
                  "9007199254740993",
                ],
              ],
        };
      }
      if (text.includes('"castle_peers"')) {
        fail("offset");
        return { rows: options.noStats ? [] : options.duplicateOffsets ? [["4"], ["5"]] : [["4"]] };
      }
      if (text.startsWith("select (count(*) + 1)::text")) {
        fail("count");
        return { rows: options.missingCount ? [] : [["2147483648"]] };
      }
      if (text.startsWith('select "uuid", "level"')) {
        fail("castle");
        return {
          rows: options.missingCastle
            ? []
            : options.duplicateCastles
              ? [
                  ["first", 10],
                  ["second", 20],
                ]
              : [["own", 20]],
        };
      }
      return { rows: [] };
    },
  };
  return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}

test("castle candidates order stars before time and fallback peers intentionally omit stars and profile exclusions", async () => {
  const { db, queries } = database();
  const state = await readPlayerRanking(db, "self", query);
  expect(state.fallbackRank).toBe(2147483652n);
  expect(state.candidates[0]).toEqual({
    uuid: "castle",
    uid: "other",
    updateTime: 123n,
    level: 30,
    star: 1,
    name: "Name",
    pic: "portrait",
    picVer: 2,
    picfraId: 3,
    allianceId: "missing",
    banTime: 0n,
    alliancename: null,
    abbr: null,
    icon: null,
    buildingPower: 9007199254740993n,
  });
  expect(queries).toHaveLength(7);
  expect(queries[0]?.text).toBe("begin isolation level repeatable read read only");
  expect(queries.at(-1)?.text).toBe("commit");
  const board = queries[2]!;
  expect(board.params).toEqual([400000, 0, 4]);
  expect(board.text).toContain(
    'order by "opencok_kingdom"."user_building"."level" desc, "opencok_kingdom"."user_building"."star" desc nulls last, "opencok_kingdom"."user_building"."updateTime" asc nulls first, "opencok_kingdom"."playerinfo"."buildingPower" desc nulls last',
  );
  expect(board.text).toContain('"user_building"."uuid" collate "C" asc');
  expect(board.text).not.toMatch(/"banTime"\s*[<=>]|gmFlag/);
  expect(queries[3]?.params).toEqual(["self", 400000, 2]);
  expect(queries[4]?.params).toEqual([400000, 20]);
  expect(queries[4]?.text).not.toMatch(/playerinfo|userprofile|star|updateTime/);
  const peers = queries[5]!;
  expect(peers.params).toEqual([400000, 20, "self", 2]);
  expect(peers.text).toContain("row_number() over (order by ");
  expect(peers.text).toContain('"updateTime" asc nulls first');
  expect(peers.text).toContain('"buildingPower" desc nulls last');
  expect(peers.text).not.toMatch(/userprofile|alliance|star|banTime|crossFight/);
  for (const entry of queries)
    expect(entry.text).not.toMatch(/\b(insert|update|delete)\b|select \*|email|"gold"/);
});

test("cached-window self positions avoid fallback and missing castles or statistics retain legacy defaults", async () => {
  const cached = database({ inWindow: true });
  await readPlayerRanking(cached.db, "self", query);
  expect(cached.queries).toHaveLength(4);
  const missing = database({ missingCastle: true });
  expect((await readPlayerRanking(missing.db, "self", query)).fallbackRank).toBe(1n);
  expect(missing.queries).toHaveLength(5);
  const noStats = database({ noStats: true, emptyBoard: true });
  const state = await readPlayerRanking(noStats.db, "self", query);
  expect(state.fallbackRank).toBe(2147483648n);
  expect(state.candidates).toEqual([]);
});

test("ambiguous castles, missing counts and provider errors roll back instead of guessing a position", async () => {
  for (const options of [
    { duplicateCastles: true },
    { duplicateOffsets: true },
    { missingCount: true },
    ...["board", "castle", "count", "offset"].map((fail) => ({ fail })),
  ]) {
    const { db, queries } = database(options);
    await expect(readPlayerRanking(db, "self", query)).rejects.toThrow();
    expect(queries.at(-1)?.text).toBe("rollback");
    expect(queries.some((entry) => entry.text === "commit")).toBe(false);
  }
});
