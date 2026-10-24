import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import type { ReconnectProgressState, ReconnectProgressWrite } from "@opencok/contracts/reconnect";
import { persistReconnectProgress } from "@opencok/repositories/reconnect-write";

const state = {
  profile: { uid: "owner", serverId: 2 },
  resource: { uid: "owner", food: 100n, foodbind: 50n, lastUpdateTime: 10n },
  armies: [{ armyId: "knight", free: 10, defence: 5 }],
  generals: [],
  skills: [],
  buildings: [],
  equipment: [],
  queues: [],
  tasks: [],
  playerInfo: undefined,
  registrationPlatform: null,
  civilizationCastle: undefined,
  glory: undefined,
  weakness: [],
  walls: [],
  knight: undefined,
  items: [],
} as unknown as ReconnectProgressState;
const write = (): ReconnectProgressWrite => ({
  resource: { food: 90n, foodbind: 45n, lastUpdateTime: 20n, starvingMillis: 0n },
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
});

function database(failure?: string) {
  let active = true;
  const committed: string[] = [];
  let pending: string[] = [];
  const queries: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      if (query.text.startsWith("begin")) pending = [];
      if (query.text === "commit") committed.push(...pending);
      if (query.text === "rollback") pending = [];
      if (query.text.startsWith("select")) return { rows: [["4"]] };
      if (query.text.startsWith("insert") || query.text.startsWith("update")) {
        const table = query.text.match(/"opencok_kingdom"\."([^"]+)"/)![1]!;
        if (table === failure) throw new Error("Synthetic write failure");
        pending.push(table);
        if (failure === "disconnect") active = false;
        return { rows: query.text.includes("returning") ? [["owner"]] : [] };
      }
      return { rows: [] };
    },
  };
  return {
    db: drizzle(client as unknown as NodePgClient, { schema }),
    queries,
    committed,
    authority: {
      kingdomId: 2,
      epoch: 4n,
      instance: "synthetic",
      assertReady: () => {
        if (!active) throw new Error("Inactive owner");
      },
    },
  };
}

test("reconnect commits the resource checkpoint and immutable interval ledger together", async () => {
  const fixture = database();
  await fixture.db.transaction((tx) =>
    persistReconnectProgress(tx, state, write(), fixture.authority, 20n),
  );
  expect(fixture.committed).toEqual(["resource_settlement", "user_resource"]);
  const update = fixture.queries.find((query) => query.text.startsWith("update"))!;
  expect(update.text).toContain('"lastUpdateTime" =');
  expect(update.params).toContain("owner");
  expect(update.params).toContain(10n);
  const retry = write();
  retry.resource = { ...retry.resource, food: 90n, foodbind: 45n };
  await fixture.db.transaction((tx) =>
    persistReconnectProgress(
      tx,
      { ...state, resource: { ...state.resource, food: 90n, foodbind: 45n, lastUpdateTime: 20n } },
      retry,
      fixture.authority,
      20n,
    ),
  );
  expect(fixture.committed).toEqual(["resource_settlement", "user_resource"]);
});

test("resource write failure and coordination loss roll back the interval receipt", async () => {
  for (const failure of ["user_resource", "disconnect"]) {
    const fixture = database(failure);
    await expect(
      fixture.db.transaction((tx) =>
        persistReconnectProgress(tx, state, write(), fixture.authority, 20n),
      ),
    ).rejects.toThrow();
    expect(fixture.committed).toEqual([]);
    expect(fixture.queries.at(-1)!.text).toBe("rollback");
  }
});

test("reconnect forbids currency creation, checkpoint reuse and unaccounted troop loss", async () => {
  const invalid = [write(), write(), write(), write()];
  invalid[0]!.resource.food = 101n;
  invalid[1]!.resource.lastUpdateTime = 10n;
  invalid[2]!.resource.starvingMillis = 11n;
  invalid[3]!.armies = [{ armyId: "knight", free: 5, defence: 5 }];
  for (const plan of invalid) {
    const fixture = database();
    await expect(
      fixture.db.transaction((tx) =>
        persistReconnectProgress(tx, state, plan, fixture.authority, 20n),
      ),
    ).rejects.toThrow();
    expect(fixture.committed).toEqual([]);
    expect(fixture.queries.some((query) => query.text.startsWith("insert"))).toBe(false);
  }
});

test("troop debits and their loss ledger fail atomically when task persistence fails", async () => {
  const fixture = database("user_task");
  const plan = write();
  plan.armies = [{ armyId: "knight", free: 5, defence: 5 }];
  plan.troopChanges = [
    {
      armyId: "knight",
      freeBefore: 10,
      freeAfter: 5,
      defenceBefore: 5,
      defenceAfter: 5,
      weakened: 3,
      dead: 2,
    },
  ];
  plan.weakness = [{ armyId: "knight", weakness: 3, marchWeakness: 0, heal: 0, finishTime: 0n }];
  plan.tasks.inserts = [
    {
      id: "task",
      num: 1,
      state: 1,
      type: 1,
      trigger: 34,
      phase: 0,
      accepted: false,
      predecessor: undefined,
      reward: undefined,
    },
  ];
  await expect(
    fixture.db.transaction((tx) =>
      persistReconnectProgress(tx, state, plan, fixture.authority, 20n),
    ),
  ).rejects.toThrow();
  expect(
    fixture.queries.some((query) => query.text.startsWith('update "opencok_kingdom"."user_army"')),
  ).toBe(true);
  expect(
    fixture.queries.some((query) =>
      query.text.startsWith('insert into "opencok_kingdom"."user_task"'),
    ),
  ).toBe(true);
  expect(fixture.committed).toEqual([]);
  expect(fixture.queries.at(-1)!.text).toBe("rollback");
});

test("skill repair, cooldown reset and notification share one commit and roll back on mail failure", async () => {
  const current = {
    ...state,
    generals: [{ uuid: "general", ability: Buffer.from("[]") }],
    skills: [{ uuid: "skill", stat: 2, endTime: 15n }],
  };
  const plan = write();
  plan.generalResets = ["general"];
  plan.skillResets = ["skill"];
  plan.skillCooldownResets = ["skill"];
  plan.mail = [
    {
      uid: "a".repeat(32) + "00",
      owner: "owner",
      title: "Skill repair",
      fromName: "",
      type: 2,
      contents: Buffer.from("Skills reset"),
      extra: null,
      rewardId: null,
      rewardStatus: 1,
      reply: 0,
      createTime: 20n,
      itemIdFlag: 0,
    },
  ];
  const fixture = database();
  await fixture.db.transaction((tx) =>
    persistReconnectProgress(tx, current, plan, fixture.authority, 20n),
  );
  expect(fixture.committed).toEqual([
    "resource_settlement",
    "user_resource",
    "user_general",
    "user_skill",
    "user_skill",
    "mail",
    "mail_group",
  ]);
  const cooldown = fixture.queries.find((query) => query.text.includes('set "startTime"'))!;
  expect(cooldown.params).toContain(9223372036854775807n);
  for (const failure of ["user_general", "user_skill", "mail", "mail_group"]) {
    const failed = database(failure);
    await expect(
      failed.db.transaction((tx) =>
        persistReconnectProgress(tx, current, plan, failed.authority, 20n),
      ),
    ).rejects.toThrow();
    expect(failed.committed).toEqual([]);
    expect(failed.queries.at(-1)!.text).toBe("rollback");
  }
});
