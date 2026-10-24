import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { readReconnectProgress } from "@opencok/repositories/reconnect-progress";
import { executeReconnectProgress } from "@opencok/repositories/reconnect-write";

function database(overrides: Record<string, Record<string, unknown>[]> = {}, failBegin?: string) {
  const tables: Record<string, Record<string, unknown>[]> = {
    realm_authority: [{ ownerEpoch: "1" }],
    userprofile: [
      {
        uid: "owner",
        serverId: 2,
        banFlag: 0,
        banTime: "0",
        level: 12,
        pf: "market_global",
        gold: "9007199254740993",
        paidGold: "7",
        payTotal: "100",
        allianceId: "",
      },
    ],
    user_resource: [{ uid: "owner", food: "100", foodbind: "50", lastUpdateTime: "20" }],
    stat_reg: [
      { pf: "other", type: 0 },
      { pf: "facebook", type: 2 },
    ],
    user_army: [
      { uid: "owner", armyId: "army", free: 5, pve: 2, defence: 3, march: 4, train: 7, level: 1 },
    ],
    user_task: [{ uid: "owner", id: "quest", num: 2, state: 1, type: 1 }],
    queue: [{ uuid: "queue", ownerId: "owner", type: 12, itemId: "item", para: 0 }],
    ...overrides,
  };
  const queries: { text: string; params: unknown[] }[] = [];
  let failed = false;
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      if (query.text.startsWith("begin") && failBegin && !failed) {
        failed = true;
        throw Object.assign(new Error("Synthetic transaction failure"), { code: failBegin });
      }
      if (query.text.startsWith("update")) return { rows: [["owner"]] };
      const table = query.text.match(/from "opencok_kingdom"\."([^"]+)"/)?.[1];
      if (!table) return { rows: [] };
      const selected = query.text
        .slice(7, query.text.indexOf(" from "))
        .split(", ")
        .map((part) => [...part.matchAll(/"([^"]+)"/g)].at(-1)![1]!);
      return { rows: (tables[table] ?? []).map((row) => selected.map((key) => row[key] ?? null)) };
    },
  };
  return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}

test("reconnect progress locks the authenticated owner and resource checkpoint before reading all progress domains", async () => {
  const { db, queries } = database();
  const state = await db.transaction((tx) => readReconnectProgress(tx, "owner", 2, 100n), {
    isolationLevel: "repeatable read",
  });
  expect(state.profile.gold).toBe(9007199254740993n);
  expect(state.resource.lastUpdateTime).toBe(20n);
  expect(state.armies[0]!.pve).toBe(2);
  expect(state.queues[0]!.type).toBe(12);
  expect(state.tasks[0]!.id).toBe("quest");
  expect(state.registrationPlatform).toBe("facebook");
  const reads = queries.filter((query) => query.text.startsWith("select"));
  expect(reads[0]!.text).toContain('"userprofile"');
  expect(reads[0]!.text).toContain("for update");
  expect(reads[1]!.text).toContain('"user_resource"');
  expect(reads[1]!.text).toContain("for update");
  expect(reads[0]!.text).not.toMatch(/email|password|deviceId|loginIp|lastIp/i);
  expect(reads[0]!.text).toContain("deviceUuid");
  for (const table of ["user_army", "user_task", "queue", "user_weakness_building", "user_skill"])
    expect(
      reads.find((query) => query.text.includes(`from "opencok_kingdom"."${table}"`))!.params,
    ).toContain("owner");
  expect(queries.at(-1)!.text).toBe("commit");
});

test("reconnect retries only rolled-back concurrency failures and freezes the planner snapshot", async () => {
  for (const code of ["40001", "40P01"]) {
    const fixture = database({}, code);
    const result = await executeReconnectProgress(
      fixture.db,
      { kingdomId: 2, epoch: 1n, instance: "synthetic", assertReady: () => {} },
      "owner",
      100n,
      async (snapshot) => {
        expect(Object.isFrozen(snapshot.resource)).toBe(true);
        expect(Object.isFrozen(snapshot.armies)).toBe(true);
        return {
          result: "committed",
          write: {
            resource: { food: 100n, foodbind: 50n, lastUpdateTime: 100n, starvingMillis: 0n },
            tasks: { inserts: [], updates: [] },
            armies: [],
            weakness: [],
            weaknessTime: undefined,
            generalResets: [],
            skillResets: [],
            skillCooldownResets: [],
            mail: [],
            buildingRefreshes: [],
            troopChanges: [],
          },
        };
      },
    );
    expect(result).toBe("committed");
    expect(fixture.queries.filter((query) => query.text.startsWith("begin"))).toHaveLength(2);
  }
  const uncertain = database({}, "08006");
  await expect(
    executeReconnectProgress(
      uncertain.db,
      { kingdomId: 2, epoch: 1n, instance: "synthetic", assertReady: () => {} },
      "owner",
      100n,
      async () => {
        throw new Error("Unreachable planner");
      },
    ),
  ).rejects.toThrow();
  expect(uncertain.queries.filter((query) => query.text.startsWith("begin"))).toHaveLength(1);
});

test("invalid owners cannot reach dependent reads and missing or oversized progress rolls back", async () => {
  for (const overrides of [
    { userprofile: [] },
    { userprofile: [{ uid: "owner", serverId: 3, banFlag: 0 }] },
    { userprofile: [{ uid: "owner", serverId: 2, banFlag: 1 }] },
    { userprofile: [{ uid: "owner", serverId: 2, banFlag: 0, banTime: "101" }] },
  ]) {
    const fixture = database(overrides);
    await expect(
      fixture.db.transaction((tx) => readReconnectProgress(tx, "owner", 2, 100n)),
    ).rejects.toThrow();
    expect(fixture.queries.filter((query) => query.text.startsWith("select"))).toHaveLength(1);
    expect(fixture.queries.at(-1)!.text).toBe("rollback");
  }
  const missing = database({ user_resource: [] });
  await expect(
    missing.db.transaction((tx) => readReconnectProgress(tx, "owner", 2, 100n)),
  ).rejects.toThrow();
  const oversized = database({
    user_task: Array.from({ length: 32768 }, (_, index) => ({
      uid: "owner",
      id: String(index),
      num: 0,
      state: 0,
      type: 1,
    })),
  });
  await expect(
    oversized.db.transaction((tx) => readReconnectProgress(tx, "owner", 2, 100n)),
  ).rejects.toThrow();
  expect(oversized.queries.at(-1)!.text).toBe("rollback");
});
