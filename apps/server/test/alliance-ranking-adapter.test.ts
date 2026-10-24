import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { readAllianceRanking } from "@opencok/repositories/alliance-ranking";
import type {
  AllianceRankingKind,
  AllianceRankingQuery,
} from "@opencok/contracts/alliance-ranking";

const now = 1792756800000;
function database(
  options: {
    missing?: boolean;
    banned?: boolean;
    allianceId?: string;
    fail?: string;
    countMissing?: boolean;
    size?: number;
    sciencesOverflow?: boolean;
  } = {},
) {
  const queries: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      const fail = (phase: string) => {
        if (options.fail === phase) throw new Error(`Synthetic ${phase} failure`);
      };
      if (query.text.startsWith("select (count(*) + 1)::text")) {
        fail("count");
        return { rows: options.countMissing ? [] : [["9007199254740993"]] };
      }
      if (query.text.includes('"ranking_leaders"')) {
        fail("board");
        return {
          rows: Array.from({ length: options.size ?? 3 }, (_, index) => [
            String(index),
            `Alliance ${index}`,
            "A",
            "crest",
            4,
            10,
            0,
            "9007199254740993",
            "2147483648",
            `leader${index}`,
            "Leader",
          ]),
        };
      }
      if (query.text.startsWith('select "uid", "serverId"')) {
        fail("profile");
        return {
          rows: options.missing
            ? []
            : [["owner", 1, "0", options.banned ? 1 : 0, options.allianceId ?? "own-alliance"]],
        };
      }
      if (query.text.includes('from "opencok_kingdom"."alliance_science"')) {
        fail("sciences");
        return {
          rows: options.sciencesOverflow
            ? Array.from({ length: 32768 }, (_, i) => ["0", i, 0])
            : [["0", 1000, 1]],
        };
      }
      if (query.text.includes('from "opencok_kingdom"."alliance_vedio"')) {
        fail("videos");
        return { rows: [["0", "video", "thumb", 20, 30, 40, 50, -1]] };
      }
      return { rows: [] };
    },
  };
  return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}
function query(kind: AllianceRankingKind): AllianceRankingQuery {
  return { kind, limit: 2, now };
}

test("alliance snapshots preserve member-only fallback, science power and distinct candidate limits", async () => {
  for (const kind of ["power", "kills"] as const) {
    const { db, queries } = database();
    const result = await readAllianceRanking(db, "owner", query(kind));
    expect(result.profile).toEqual({
      uid: "owner",
      serverId: 1,
      banTime: 0n,
      banFlag: 0,
      allianceId: "own-alliance",
    });
    expect(result.fallbackRank).toBe(9007199254740993n);
    expect(result.candidates).toHaveLength(3);
    expect(result.candidates[0]).toEqual({
      uid: "0",
      alliancename: "Alliance 0",
      abbr: "A",
      icon: "crest",
      curMember: 4,
      maxMember: 10,
      ckfThroneFightFlag: 0,
      nums: "2147483648",
      leaderUid: "leader0",
      leader: "Leader",
      [kind === "power" ? "fightpower" : "armyKill"]: "9007199254740993",
    });
    expect(result.sciences).toEqual([{ allianceId: "0", scienceId: 1000, level: 1 }]);
    expect(result.videos).toEqual([
      {
        allianceId: "0",
        vedioURL: "video",
        thumbnailURL: "thumb",
        vedioH: 20,
        vedioW: 30,
        vedioSize: 40,
        vedioLength: 50,
        checkSign: -1,
      },
    ]);
    expect(queries).toHaveLength(7);
    expect(queries[0]?.text).toBe("begin isolation level repeatable read read only");
    expect(queries.at(-1)?.text).toBe("commit");
    expect(queries[1]?.params).toEqual(["owner", 1]);
    const board = queries[2]!;
    expect(board.params).toEqual([5, 0, kind === "power" ? 3 : 4]);
    expect(board.text).toContain('"alliance_member"."rank" = $1');
    expect(board.text).toContain('"alliance"."ckfThroneFightFlag" = $2');
    expect(board.text).toContain('"alliance"."curMember" asc nulls first');
    expect(board.text).toContain('"alliance"."uid" collate "C" asc');
    expect(board.text).toContain('"ranking_leaders"."uid" collate "C" asc');
    expect(board.text).not.toMatch(/banTime|gmFlag|crossFightSrcServerId/);
    expect(board.text).toContain(
      `sum("opencok_kingdom"."playerinfo"."${kind === "power" ? "power" : "armyKill"}")`,
    );
    if (kind === "power")
      expect(board.text).toContain(
        'coalesce(sum("opencok_kingdom"."alliance_science"."power"), 0)',
      );
    else expect(board.text).not.toContain('"alliance_science"');
    const fallback = queries[3]!;
    expect(fallback.params).toEqual(["own-alliance"]);
    expect(fallback.text).toContain('"member_score" > (select');
    expect(fallback.text).not.toMatch(
      /alliance_science|userprofile|ckfThroneFightFlag|ranking_leaders|order by/,
    );
    expect(queries[4]?.params).toEqual(["0", "1", 32768]);
    expect(queries[5]?.params).toEqual(["0", "1", 2]);
    for (const statement of queries)
      expect(statement.text).not.toMatch(
        /\b(insert|update|delete)\b|select \*|email|passmd5|"gold"|"wood"/,
      );
  }
});

test("empty and single-candidate kill boards skip presentation reads and unaffiliated requesters skip fallback", async () => {
  for (const kind of ["power", "kills"] as const) {
    for (const size of kind === "power" ? [0] : [0, 1]) {
      const { db, queries } = database({ size, allianceId: " " });
      const result = await readAllianceRanking(db, "owner", query(kind));
      expect(result.candidates).toHaveLength(size);
      expect(result.fallbackRank).toBe(1n);
      expect(result.sciences).toEqual([]);
      expect(result.videos).toEqual([]);
      expect(queries).toHaveLength(4);
    }
  }
});

test("missing or banned owners skip reads and query failures or oversized science collections roll back", async () => {
  for (const options of [{ missing: true }, { banned: true }]) {
    const { db, queries } = database(options);
    const result = await readAllianceRanking(db, "owner", query("power"));
    expect(result.candidates).toEqual([]);
    expect(queries).toHaveLength(3);
  }
  for (const options of [
    ...["profile", "board", "count", "sciences", "videos"].map((fail) => ({ fail })),
    { countMissing: true },
    { sciencesOverflow: true },
  ]) {
    const { db, queries } = database(options);
    await expect(readAllianceRanking(db, "owner", query("power"))).rejects.toThrow();
    expect(queries.at(-1)?.text).toBe("rollback");
    expect(queries.some((entry) => entry.text === "commit")).toBe(false);
  }
  const untouched = database();
  for (const uid of ["", " ", "x".repeat(41)])
    expect(() => readAllianceRanking(untouched.db, uid, query("power"))).toThrow();
  for (const limit of [0, -1, 1.5, 32768])
    expect(() =>
      readAllianceRanking(untouched.db, "owner", { ...query("power"), limit }),
    ).toThrow();
  expect(untouched.queries).toHaveLength(0);
});
