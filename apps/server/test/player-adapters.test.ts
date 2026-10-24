import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import * as globalSchema from "@opencok/drizzle/schema/global";
import type { Row } from "@opencok/contracts/rows";
import {
  getPlayerSummariesByIds,
  getLocalPlayerSummariesByIds,
} from "@opencok/repositories/players";
import { Database } from "@opencok/repositories/game";
import { Cache } from "@opencok/storage/session";

const columns = [
  "uid",
  "name",
  "allianceId",
  "pic",
  "picVer",
  "picfraId",
  "gmFlag",
  "crossFightSrcServerId",
  "country",
  "profileServerId",
  "vipLevel",
  "vipEndTime",
  "sLevel",
  "abbr",
  "rank",
  "showBanner",
];
type Query = { text: string; params: unknown[] };
function kingdom(rows: Row[], failState = false) {
  const queries: Query[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      if (query.text.includes('from "opencok_kingdom"."userprofile"'))
        return {
          rows: rows
            .filter((row) => params.includes(row.uid))
            .map((row) => columns.map((key) => row[key] ?? null)),
        };
      if (query.text.includes('from "opencok_kingdom"."alliance_title"'))
        return {
          rows: rows
            .filter((row) => row.officer !== undefined && params.includes(row.uid))
            .map((row) => [row.uid, row.officer]),
        };
      if (query.text.includes('from "opencok_kingdom"."user_state"')) {
        if (failState) throw new Error("Synthetic state failure");
        return {
          rows: rows
            .filter((row) => row.stateId !== undefined && params.includes(row.uid))
            .map((row) => [row.uid, row.stateId, String(row.endTime)]),
        };
      }
      if (query.text.includes('from "opencok_kingdom"."stat_reg"'))
        return {
          rows: rows
            .filter((row) => params.includes(row.uid))
            .map((row) => [row.uid, row.registrationCountry ?? null]),
        };
      return { rows: [] };
    },
  };
  return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}
function databases(
  local: ReturnType<typeof kingdom>,
  remote: ReturnType<typeof kingdom> | undefined,
  accounts: { uid: string; server: string }[] = [],
) {
  const queries: Query[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      return {
        rows: accounts
          .filter((row) => params.includes(row.uid))
          .map((row) => [row.uid, row.server]),
      };
    },
  };
  const kingdoms = new Map([[1, local]]);
  if (remote) kingdoms.set(2, remote);
  const dbs = {
    kingdoms,
    getKingdom: (id: number) => kingdoms.get(id)!,
    global: { db: drizzle(client as unknown as NodePgClient, { schema: globalSchema }) },
  } as unknown as Parameters<typeof getPlayerSummariesByIds>[0];
  return { dbs, queries };
}

test("player persistence reads only public columns and binds IDs in one read-only snapshot", async () => {
  const { db, queries } = kingdom([
    {
      uid: "1001",
      name: "Synthetic",
      allianceId: "alliance-a",
      abbr: "AAA",
      rank: 4,
      officer: 6,
      vipLevel: 8,
      vipEndTime: "1792756800000",
      sLevel: 3,
      showBanner: "1",
      stateId: 500103,
      endTime: "9007199254740993",
      registrationCountry: "TW",
    },
  ]);
  const rows = await getLocalPlayerSummariesByIds(db, ["1001"]);
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({
    uid: "1001",
    officer: 6,
    rank: 4,
    showBanner: 1n,
    stateId: 500103,
    endTime: 9007199254740993n,
    vipEndTime: 1792756800000n,
    registrationCountry: "TW",
  });
  expect(queries[0]?.text).toBe("begin isolation level repeatable read read only");
  expect(queries.at(-1)?.text).toBe("commit");
  const profile = queries[1]!;
  expect(profile.params).toContain("1001");
  expect(profile.text).toContain('where "opencok_kingdom"."userprofile"."uid" in (');
  expect(profile.text).toContain(
    '"alliance_member"."allianceId" = "opencok_kingdom"."userprofile"."allianceId"',
  );
  expect(profile.text).toContain('left join "opencok_kingdom"."user_vip"');
  const title = queries.find((entry) =>
    entry.text.includes('from "opencok_kingdom"."alliance_title"'),
  )!;
  expect(title.text).toContain(
    '"userprofile"."allianceId" = "opencok_kingdom"."alliance_title"."allianceId"',
  );
  const states = queries.find((entry) =>
    entry.text.includes('from "opencok_kingdom"."user_state"'),
  )!;
  expect(states.params).toEqual(["1001", 103]);
  expect(states.text).toContain('order by "opencok_kingdom"."user_state"."stateId" asc');
  for (const query of queries) {
    expect(query.text).not.toMatch(/\b(insert|update|delete)\b/i);
    expect(query.text).not.toMatch(/deviceId|deviceUuid|email|passmd5|gold|"ip"|referrer/);
  }
});

test("empty reads skip SQL, unknown players skip auxiliary reads and errors roll back", async () => {
  const empty = kingdom([]);
  expect(await getLocalPlayerSummariesByIds(empty.db, [])).toEqual([]);
  expect(empty.queries).toEqual([]);
  expect(await getLocalPlayerSummariesByIds(empty.db, ["unknown"])).toEqual([]);
  expect(empty.queries).toHaveLength(3);
  const failure = kingdom([{ uid: "1001" }], true);
  await expect(getLocalPlayerSummariesByIds(failure.db, ["1001"])).rejects.toThrow();
  expect(failure.queries.at(-1)?.text).toBe("rollback");
  expect(failure.queries.some((query) => query.text === "commit")).toBe(false);
  await expect(
    getLocalPlayerSummariesByIds(
      empty.db,
      Array.from({ length: 51 }, () => "1001"),
    ),
  ).rejects.toThrow();
});

test("local requests preserve requested order and duplicates without reading the global directory", async () => {
  const local = kingdom([{ uid: "1001" }, { uid: "1002" }]);
  const { dbs, queries } = databases(local, undefined);
  const rows = await getPlayerSummariesByIds(dbs, 1, ["1002", "missing", "1001", "1002"], false);
  expect(rows.map((row) => row.data.uid)).toEqual(["1002", "1001", "1002"]);
  expect(rows.every((row) => row.kingdomId === 1 && !row.remote)).toBe(true);
  expect(queries).toEqual([]);
});

test("cross-realm lookups route only missing normalized numeric IDs through the global account", async () => {
  const local = kingdom([{ uid: "1001", profileServerId: 1 }]);
  const remote = kingdom([{ uid: "2001", name: "Remote", profileServerId: 2 }]);
  const { dbs, queries } = databases(local, remote, [{ uid: "2001", server: "2" }]);
  const rows = await getPlayerSummariesByIds(
    dbs,
    1,
    ["2001@mod", "1001", "2001@mod", "unknown", "2002"],
    true,
  );
  expect(rows.map((row) => [row.data.uid, row.kingdomId, row.remote])).toEqual([
    ["1001", 1, false],
    ["2001", 2, true],
    ["2001", 2, true],
  ]);
  expect(queries).toHaveLength(1);
  expect(queries[0]?.params).toEqual(["2001", "2002"]);
  expect(queries[0]?.text).toContain('from "opencok_global"."account_new"');
  expect(queries[0]?.text).not.toMatch(/device|email|passmd5|uuid/);
  expect(remote.queries[1]?.params).toContain("2001");
  expect(remote.queries[1]?.params).not.toContain("1001");
  expect(remote.queries[0]?.text).toBe("begin isolation level repeatable read read only");
});

test("cross-realm missing configuration, ownership mismatch and read failure reject partial results", async () => {
  for (const remote of [
    undefined,
    kingdom([{ uid: "2001", profileServerId: 3 }]),
    kingdom([{ uid: "2001", profileServerId: 2 }], true),
  ]) {
    const local = kingdom([{ uid: "1001", profileServerId: 1 }]);
    const { dbs } = databases(local, remote, [{ uid: "2001", server: "2" }]);
    await expect(getPlayerSummariesByIds(dbs, 1, ["1001", "2001"], true)).rejects.toThrow();
  }
  const local = kingdom([{ uid: "1001" }]);
  const { dbs, queries } = databases(local, undefined);
  await getPlayerSummariesByIds(dbs, 1, ["1001"], true);
  expect(queries).toEqual([]);
});

test("realm topology prevents conflicting local routes and an unbounded set of pools", async () => {
  const config = {
    databaseUrl: "postgresql://unused.invalid/global",
    timeoutMs: 1000,
    globalDatabase: "opencok_global",
    kingdomId: 1,
    kingdomDatabase: "opencok_kingdom_1",
  };
  expect(
    () => new Database({ ...config, playerKingdoms: [{ id: 1, database: "wrong_db" }] }),
  ).toThrow("conflicts");
  expect(
    () =>
      new Database({
        ...config,
        playerKingdoms: [
          { id: 2, database: "kingdom_two" },
          { id: 3, database: "kingdom_three" },
        ],
      }),
  ).toThrow("two player realms");
  const db = new Database({ ...config, playerKingdoms: [{ id: 2, database: "kingdom_two" }] });
  expect(db.databases.topology.kingdoms).toEqual([
    { id: 2, database: "kingdom_two" },
    { id: 1, database: "opencok_kingdom_1" },
  ]);
  await db.close();
});

class UpdateCache extends Cache {
  readonly calls: string[][] = [];
  response: unknown = [];
  constructor() {
    super({ redisUrl: "redis://unused.invalid", timeoutMs: 1000, kingdomId: 1 });
  }
  override async command(command: string, ...args: string[]) {
    this.calls.push([command, ...args]);
    return this.response;
  }
}

test("profile update markers use one realm-scoped read and retain exact string timestamps", async () => {
  const cache = new UpdateCache();
  expect(await cache.playerUpdateTimes(2, [])).toEqual(new Map());
  expect(cache.calls).toEqual([]);
  cache.response = [null, "9007199254740993", " "];
  expect(await cache.playerUpdateTimes(2, ["1001", "1002", "1003"])).toEqual(
    new Map([["1002", "9007199254740993"]]),
  );
  expect(cache.calls).toEqual([
    [
      "MGET",
      "opencok:kingdom:2:player-update:1001",
      "opencok:kingdom:2:player-update:1002",
      "opencok:kingdom:2:player-update:1003",
    ],
  ]);
  for (const response of [null, [], [1], [undefined], ["-1"], ["1.5"], ["9223372036854775808"]]) {
    cache.response = response;
    await expect(cache.playerUpdateTimes(1, ["1001"])).rejects.toThrow();
  }
  const before = cache.calls.length;
  for (const id of [0, -1, 1.5])
    await expect(cache.playerUpdateTimes(id, ["1001"])).rejects.toThrow();
  await expect(cache.playerUpdateTimes(1, [""])).rejects.toThrow();
  await expect(cache.playerUpdateTimes(1, ["a".repeat(256)])).rejects.toThrow();
  expect(cache.calls).toHaveLength(before);
});
