import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { readPlayerRanking } from "@opencok/repositories/ranking";
import type { PlayerRankingKind, PlayerRankingQuery } from "@opencok/contracts/ranking";

const now = 1792756800000;
function database(
  kind: PlayerRankingKind,
  options: {
    missing?: boolean;
    banned?: boolean;
    fail?: string;
    emptyCount?: boolean;
    empty?: boolean;
  } = {},
) {
  const queries: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      if (query.text.includes("count(*)")) {
        if (options.fail === "count") throw new Error("Synthetic rank count failure");
        return { rows: options.emptyCount ? [] : [["9007199254740993"]] };
      }
      if (query.text.includes("left join")) {
        if (options.fail === "candidates") throw new Error("Synthetic ranking candidate failure");
        const values =
          kind === "level" ? ["other", 20, 5] : ["other", "9007199254740993", "2147483648"];
        return {
          rows: options.empty
            ? []
            : [[...values, "other", "Synthetic", "portrait", 1, 2, "a", "0", "a", "Alliance", "A"]],
        };
      }
      if (query.text.includes('from "opencok_kingdom"."userprofile"')) {
        if (options.fail === "profile") throw new Error("Synthetic requester failure");
        return {
          rows: options.missing ? [] : [["self", 10, 1, options.banned ? String(now + 1) : "0", 0]],
        };
      }
      return { rows: [] };
    },
  };
  return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}
function query(kind: PlayerRankingKind, hideGm = true): PlayerRankingQuery {
  return { kind, hideGm, now, limit: 3 };
}

test("player boards use scoped read-only snapshots and stable explicit secondary ordering", async () => {
  for (const kind of ["power", "kills", "level"] as const) {
    const { db, queries } = database(kind);
    const snapshot = await readPlayerRanking(db, "self", query(kind));
    expect(snapshot.profile).toEqual({
      uid: "self",
      level: 10,
      serverId: 1,
      banTime: 0n,
      banFlag: 0,
    });
    expect(snapshot.fallbackRank).toBe(9007199254740993n);
    expect(snapshot.candidates[0]).toMatchObject({
      uid: "other",
      profileUid: "other",
      name: "Synthetic",
      banTime: 0n,
      allianceId: "a",
      allianceUid: "a",
      alliancename: "Alliance",
      abbr: "A",
    });
    if (kind === "level") expect(snapshot.candidates[0]).toMatchObject({ level: 20, exp: 5 });
    else
      expect(snapshot.candidates[0]).toMatchObject({
        power: 9007199254740993n,
        armyKill: 2147483648n,
      });
    expect(queries).toHaveLength(5);
    expect(queries[0]?.text).toBe("begin isolation level repeatable read read only");
    expect(queries.at(-1)?.text).toBe("commit");
    expect(queries[1]?.params).toEqual(["self", 1]);
    const board = queries[2]!;
    expect(board.text).toContain('left join "opencok_kingdom"."alliance"');
    for (const statement of queries)
      expect(statement.text).not.toMatch(
        /\b(insert|update|delete)\b|select \*|deviceId|email|passmd5|"gold"/,
      );
    if (kind === "level") {
      expect(board.params).toEqual([0, 9]);
      expect(board.text).toContain(
        'order by "opencok_kingdom"."userprofile"."level" desc, "opencok_kingdom"."userprofile"."exp" desc, "opencok_kingdom"."userprofile"."name" collate "C" asc, "opencok_kingdom"."userprofile"."uid" collate "C" asc',
      );
      expect(queries[3]?.params).toEqual([10]);
      expect(queries[3]?.text).toContain('where "opencok_kingdom"."userprofile"."level" > $1');
    } else {
      expect(board.text).toContain('"opencok_kingdom"."playerinfo"."uid" collate "C" asc');
      expect(queries[3]?.params).toEqual(["self", 1]);
      expect(queries[3]?.text).toContain("> (select ");
      expect(queries[3]?.text).not.toMatch(/banTime|crossFightSrcServerId|gmFlag|join/);
      if (kind === "power") {
        expect(board.params).toEqual([0, 9223372036854775807n, 0, 6]);
        expect(board.text).toContain('inner join "opencok_kingdom"."userprofile"');
        expect(board.text).toContain('"playerinfo"."power" desc nulls last');
        expect(board.text).toContain('"userprofile"."gmFlag" = $3');
        expect(board.text).toContain('"userprofile"."banTime" <> $2');
      } else {
        expect(board.params).toEqual([6]);
        expect(board.text).toContain('left join "opencok_kingdom"."userprofile"');
        expect(board.text).toContain(
          'order by "opencok_kingdom"."playerinfo"."armyKill" desc nulls last, "opencok_kingdom"."playerinfo"."power" desc nulls last',
        );
        expect(board.text).not.toMatch(/where|crossFightSrcServerId|gmFlag/);
      }
    }
  }
});

test("GM hiding changes only the power candidate filter and empty boards retain a computed fallback", async () => {
  const { db, queries } = database("power", { empty: true });
  const result = await readPlayerRanking(db, "self", query("power", false));
  expect(result.candidates).toEqual([]);
  expect(result.fallbackRank).toBe(9007199254740993n);
  expect(queries[2]?.params).toEqual([0, 9223372036854775807n, 6]);
  expect(queries[2]?.text).not.toContain('"gmFlag"');
});

test("missing or banned requesters skip board reads and provider failures roll back the snapshot", async () => {
  for (const options of [{ missing: true }, { banned: true }]) {
    const { db, queries } = database("level", options);
    expect((await readPlayerRanking(db, "self", query("level"))).candidates).toEqual([]);
    expect(queries).toHaveLength(3);
    expect(queries.at(-1)?.text).toBe("commit");
  }
  for (const options of [
    { fail: "profile" },
    { fail: "candidates" },
    { fail: "count" },
    { emptyCount: true },
  ]) {
    const { db, queries } = database("power", options);
    await expect(readPlayerRanking(db, "self", query("power"))).rejects.toThrow();
    expect(queries.at(-1)?.text).toBe("rollback");
    expect(queries.some((entry) => entry.text === "commit")).toBe(false);
  }
  const untouched = database("power");
  for (const uid of ["", " ", "x".repeat(41)])
    expect(() => readPlayerRanking(untouched.db, uid, query("power"))).toThrow();
  for (const limit of [0, -1, 0.5, 32768])
    expect(() => readPlayerRanking(untouched.db, "self", { ...query("power"), limit })).toThrow();
  expect(untouched.queries).toHaveLength(0);
});
