import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as kingdom from "@opencok/drizzle/schema/kingdom";
import type { Row } from "@opencok/contracts/rows";
import {
  createWorldPointDetailStore,
  checkWorldPointDetailStore,
} from "@opencok/repositories/world-point-detail";
import { readWorldResourceOwner } from "@opencok/repositories/world-resource-owner";

const now = 1792756800123;
function fixture() {
  const queries: { realm: number; text: string; params: unknown[] }[] = [];
  const state = {
    observer: {
      uid: "observer",
      serverId: 1,
      banFlag: 0,
      banTime: 0n,
      allianceId: null,
      appVersion: "12.6.0",
    },
    owners: new Map<number, Row | undefined>(
      [1, 2].map((realm) => [
        realm,
        {
          uid: `owner-${realm}`,
          pic: "g101",
          regTime: 1n,
          level: 30,
          serverId: realm,
          crossFightSrcServerId: -1,
          banTime: 0n,
          appVersion: "12.6.0",
          allianceId: null,
          pf: "synthetic",
          civilizationType: 1,
          decomposesuiteffect: null,
        },
      ]),
    ),
    points: new Map<number, Row>(
      [1, 2].map((realm) => [
        realm,
        {
          id: 701,
          worldId: realm === 1 ? 9 : 0,
          pointType: 3,
          ownerId: `owner-${realm}`,
          ownerMarchUUid: "march",
          allianceId: null,
          pointItem: "0",
        },
      ]),
    ),
    marches: new Map<number, Row | undefined>(
      [1, 2].map((realm) => [
        realm,
        {
          uuid: "march",
          ownerUid: `owner-${realm}`,
          targetId: 701,
          worldId: realm === 1 ? 9 : 0,
          state: 1,
        },
      ]),
    ),
    records: new Map<string, Row[]>(),
    overrides: new Map<string, Row[]>(),
    fail: "",
    onObserver: undefined as (() => void) | undefined,
  };
  for (const realm of [1, 2]) {
    const uid = `owner-${realm}`;
    state.records.set(`${realm}:user_building`, [
      { uid, uuid: "castle", itemId: 400000, level: 30, star: 5 },
    ]);
    state.records.set(`${realm}:new_general`, [
      {
        uid,
        id: 7,
        state: 2,
        buildingUuid: "castle",
        star: 2,
        baseSkill: "10;2",
        talent: "11;1",
        optime: "1;9007199254740993",
        refineproperty: "1;a_2",
      },
    ]);
    state.records.set(`${realm}:new_general_status`, [
      {
        uid,
        newGeneralId: 7,
        stateId: 9,
        startTime: 9007199254740993n,
        endTime: 9223372036854775807n,
      },
    ]);
    state.records.set(`${realm}:user_equip`, [
      { uid, uuid: "general-piece", generalid: 7, itemId: 100, on: 0, extraProperty: "78,1" },
      {
        uid,
        uuid: "player-piece",
        generalid: 0,
        itemId: 101,
        on: 1,
        extraProperty: null,
        strengthLevel: 0,
      },
    ]);
    state.records.set(`${realm}:hero_office`, [
      { uid, id: 7, officeId: "office", position: 1, startTime: 9007199254740993n },
    ]);
  }
  const dbs = new Map(
    [1, 2].map((realm) => {
      const client = {
        query: async (query: { text: string }, params: unknown[] = []) => {
          const text = query.text;
          queries.push({ realm, text, params });
          if (text.startsWith("begin")) {
            expect(text).toBe("begin isolation level repeatable read read only");
            return { rows: [] };
          }
          if (text === "commit" || text === "rollback") {return { rows: [] };}
          expect(text).toStartWith("select ");
          expect(text).not.toMatch(
            /for update|for share|password|email|referrer|"ip"|skillInfo|oldrefineproperty|lockproperty|costUnlockTimes/,
          );
          if (params.length === 1 && params[0] === 0) {return { rows: [] };}
          const table = /from "opencok_kingdom"\."([^"]+)"/.exec(text)![1]!;
          const detailProfile = table === "userprofile" && text.includes('"crossFightSrcServerId"');
          const generalGear = table === "user_equip" && text.includes('"generalid" >');
          const key = `${realm}:${table}${detailProfile ? ":effects" : generalGear ? ":general" : ""}`;
          if (state.fail === key) {throw new Error("Synthetic private driver detail");}
          let rows = state.records.get(`${realm}:${table}`) ?? [];
          if (table === "userprofile") {
            if (params[0] === "observer") {
              state.onObserver?.();
              rows = [state.observer];
            } else {rows = state.owners.get(realm) ? [state.owners.get(realm)!] : [];}
          } else if (table === "user_world") {rows = [{ uid: "observer", worldId: 9 }];}
          else if (table === "worldpoint") {rows = [state.points.get(realm)!];}
          else if (table === "world_march")
            {rows = state.marches.get(realm) ? [state.marches.get(realm)!] : [];}
          else if (table === "user_equip")
            {rows = rows.filter((row) =>
              generalGear ? (row.generalid as number) > 0 : row.on === 1,
            );}
          if (table !== "userprofile" && rows[0]?.uid !== undefined)
            {rows = rows.filter((row) => row.uid === params[0]);}
          if (state.overrides.has(key)) {rows = state.overrides.get(key)!;}
          const columns = text
            .slice(7, text.indexOf(" from "))
            .split(", ")
            .map((column) => [...column.matchAll(/"([^"]+)"/g)].at(-1)![1]!);
          return { rows: rows.map((row) => columns.map((name) => row[name] ?? null)) };
        },
      } as unknown as NodePgClient;
      return [realm, { db: drizzle(client, { schema: kingdom }) }] as const;
    }),
  );
  const topology = {
    kingdoms: dbs,
    getKingdom: (realm: number) => dbs.get(realm)!,
  } as unknown as Parameters<typeof createWorldPointDetailStore>[0];
  const store = createWorldPointDetailStore(topology, 1);
  return {
    state,
    queries,
    store,
    db: dbs.get(1)!.db,
    read: (realm = 1, resourceEffects = true) =>
      store.read("observer", { point: 701, kingdomId: realm, now, resourceEffects }),
  };
}
const reads = (f: ReturnType<typeof fixture>, table: string) =>
  f.queries.filter((query) => query.text.includes(`from "opencok_kingdom"."${table}"`));

test("resource owner effects and general records share the point transaction with bounded owner predicates and minimal columns", async () => {
  const f = fixture();
  const result = await f.read();
  const owner = result.resource!.owner!;
  expect(owner.effects.profile.uid).toBe("owner-1");
  expect(owner.effects.profile.appVersion).toBe("12.6.0");
  expect(owner.effects.profile.crossFightSrcServerId).toBe(-1);
  expect(owner.buildings).toEqual(f.state.records.get("1:user_building")!);
  expect(owner.newGenerals.generals).toEqual([
    {
      uid: "owner-1",
      id: 7,
      state: 2,
      buildingUuid: "castle",
      star: 2,
      baseSkill: "10;2",
      talent: "11;1",
      opTime: "1;9007199254740993",
      refinement: "1;a_2",
    },
  ]);
  expect(owner.newGenerals.statuses[0]!.startTime).toBe(9007199254740993n);
  expect(owner.newGenerals.offices[0]!.startTime).toBe(9007199254740993n);
  expect(owner.effects.equipment).toEqual([
    { itemId: 101, on: 1, extraProperty: null, strengthLevel: 0 },
  ]);
  expect(owner.newGenerals.equipment).toEqual([
    { uid: "owner-1", uuid: "general-piece", generalId: 7, itemId: 100, extraProperty: "78,1" },
  ]);
  for (const table of ["user_building", "new_general", "new_general_status", "hero_office"]) {
    expect(reads(f, table)).toHaveLength(1);
    const query = reads(f, table)[0]!;
    expect(query.params).toEqual(["owner-1", 4097]);
    expect(query.text).toContain(`"${table}"."uid" = $1`);
    expect(query.text).toContain("order by");
  }
  const gear = reads(f, "user_equip").find((query) => query.text.includes('"generalid" >'))!;
  expect(gear.params).toEqual(["owner-1", 0, 4097]);
  expect(gear.text.slice(gear.text.indexOf(" where "))).not.toContain('"on"');
  expect(f.queries.filter((query) => query.text.startsWith("begin"))).toHaveLength(1);
  expect(f.queries.at(-1)!.text).toBe("commit");
  const group = fixture();
  group.state.points.get(1)!.pointType = 37;
  expect((await group.read()).resource!.owner!.newGenerals.generals).toHaveLength(1);
});

test("remote owner reads use the destination transaction after local authorization and preserve home-origin metadata", async () => {
  const f = fixture();
  f.state.owners.get(2)!.crossFightSrcServerId = 3;
  f.state.owners.get(2)!.serverId = 4;
  const result = await f.read(2);
  expect(result.resource!.owner!.effects.profile.serverId).toBe(4);
  expect(result.resource!.owner!.effects.profile.crossFightSrcServerId).toBe(3);
  for (const table of [
    "user_building",
    "new_general",
    "new_general_status",
    "hero_office",
    "user_equip",
  ])
    {expect(reads(f, table).every((query) => query.realm === 2)).toBe(true);}
  const localCommit = f.queries.findIndex((query) => query.realm === 1 && query.text === "commit");
  expect(localCommit).toBeGreaterThan(0);
  expect(f.queries.findIndex((query) => query.text.includes('"new_general"'))).toBeGreaterThan(
    localCommit,
  );
  expect(f.queries.at(-1)).toEqual({ realm: 2, text: "commit", params: [] });
});

test("owner-effect reads are explicit and skip absent marches, profiles, unsupported points and unauthorized observers", async () => {
  const disabled = fixture();
  expect((await disabled.read(1, false)).resource!.owner).toBeUndefined();
  expect(reads(disabled, "new_general")).toHaveLength(0);
  for (const kind of ["march", "profile", "type", "owner", "pointer", "authorization"]) {
    const f = fixture();
    if (kind === "march") {f.state.marches.set(1, undefined);}
    if (kind === "profile") {f.state.owners.set(1, undefined);}
    if (kind === "type") {f.state.points.get(1)!.pointType = 0;}
    if (kind === "owner") {f.state.points.get(1)!.ownerId = "\u2000";}
    if (kind === "pointer") {f.state.points.get(1)!.ownerMarchUUid = null;}
    if (kind === "authorization") {f.state.observer.banFlag = 1;}
    expect((await f.read()).resource?.owner).toBeUndefined();
    expect(reads(f, "new_general")).toHaveLength(0);
    expect(reads(f, "user_general")).toHaveLength(0);
  }
});

test("moved owners retain general rows but skip general status and equipment loading without treating every ban as relocation", async () => {
  const moved = fixture();
  moved.state.owners.get(1)!.banTime = 9223372036854775807n;
  moved.state.fail = "1:new_general_status";
  const result = (await moved.read()).resource!.owner!;
  expect(result.newGenerals.moved).toBe(true);
  expect(result.newGenerals.generals).toHaveLength(1);
  expect(result.newGenerals.statuses).toEqual([]);
  expect(result.newGenerals.equipment).toEqual([]);
  expect(reads(moved, "new_general_status")).toHaveLength(0);
  expect(reads(moved, "user_equip")).toHaveLength(1);
  expect(result.newGenerals.offices).toHaveLength(1);
  const banned = fixture();
  banned.state.owners.get(1)!.banTime = BigInt(now + 1000);
  expect((await banned.read()).resource!.owner!.newGenerals.moved).toBe(false);
  expect(reads(banned, "new_general_status")).toHaveLength(1);
});

test("nullable saved values, unassigned generals and orphan associations remain available without repairs or catalog interpretation", async () => {
  const f = fixture();
  f.state.records.set("1:new_general", [
    {
      uid: "owner-1",
      id: 7,
      state: null,
      star: null,
      buildingUuid: null,
      baseSkill: "bad;bad",
      talent: null,
      optime: null,
      refineproperty: null,
    },
  ]);
  f.state.records.get("1:new_general_status")![0]!.newGeneralId = 999;
  f.state.records.get("1:new_general_status")![0]!.startTime = null;
  f.state.records.get("1:user_equip")![0]!.generalid = 999;
  const before = structuredClone(f.state.records);
  const result = (await f.read()).resource!.owner!;
  expect(result.newGenerals.generals[0]!.star).toBeNull();
  expect(result.newGenerals.generals[0]!.baseSkill).toBe("bad;bad");
  expect(result.newGenerals.statuses[0]!.newGeneralId).toBe(999);
  expect(result.newGenerals.equipment[0]!.generalId).toBe(999);
  expect(f.state.records).toEqual(before);
});

test("foreign, duplicate and oversized resource-owner collections reject and roll back without exposing driver detail", async () => {
  for (const table of [
    "user_building",
    "new_general",
    "new_general_status",
    "user_equip",
    "hero_office",
  ]) {
    for (const kind of ["foreign", "duplicate", "limit"]) {
      const f = fixture();
      const row = f.state.records.get(`1:${table}`)![0]!;
      f.state.overrides.set(
        `1:${table}${table === "user_equip" ? ":general" : ""}`,
        kind === "foreign"
          ? [{ ...row, uid: "foreign" }]
          : Array(kind === "limit" ? 4097 : 2).fill(row),
      );
      await expect(f.read()).rejects.toThrow("world point detail");
      expect(f.queries.at(-1)!.text).toBe("rollback");
    }
  }
  const f = fixture();
  f.state.fail = "1:new_general";
  await expect(f.read()).rejects.toThrow("world point detail");
  expect(f.queries.at(-1)!.text).toBe("rollback");
  const ordinary = fixture();
  ordinary.state.overrides.set(
    "1:user_general",
    Array(4097).fill({ generalId: "7", level: 1, ability: null }),
  );
  await expect(ordinary.read()).rejects.toThrow("world point detail");
  expect(reads(ordinary, "new_general")).toHaveLength(0);
});

test("resource-owner field validation preserves integer widths, text bounds and PostgreSQL-compatible strings", async () => {
  const cases: [string, string, Row[string]][] = [
    ["user_building", "level", 2147483648],
    ["user_building", "uuid", ""],
    ["new_general", "state", 32768],
    ["new_general", "talent", "x".repeat(5001)],
    ["new_general", "optime", "x".repeat(201)],
    ["new_general", "refineproperty", "x".repeat(301)],
    ["new_general", "baseSkill", "x".repeat(257)],
    ["new_general", "buildingUuid", "\0"],
    ["new_general_status", "endTime", 9223372036854775808n],
    ["new_general_status", "stateId", 0.5],
    ["user_equip", "extraProperty", "x".repeat(256)],
    ["user_equip", "generalid", 0],
    ["user_equip", "itemId", 2147483648],
    ["hero_office", "officeId", "x".repeat(41)],
    ["hero_office", "officeId", "\ud800"],
    ["hero_office", "startTime", -9223372036854775809n],
  ];
  for (const [table, column, value] of cases) {
    const f = fixture();
    const row = { ...f.state.records.get(`1:${table}`)![0], [column]: value };
    f.state.overrides.set(`1:${table}${table === "user_equip" ? ":general" : ""}`, [row]);
    await expect(f.read()).rejects.toThrow("world point detail");
  }
  const profilePatches: Row[] = [
    { uid: "foreign" },
    { pf: "x".repeat(41) },
    { decomposesuiteffect: "x".repeat(101) },
    { crossFightSrcServerId: 2147483648 },
    { banTime: 9223372036854775808n },
  ];
  for (const patch of profilePatches) {
    const f = fixture();
    f.state.overrides.set("1:userprofile:effects", [{ ...f.state.owners.get(1)!, ...patch }]);
    await expect(f.read()).rejects.toThrow("world point detail");
  }
});

test("resource query flags are captured before authorization and readiness checks only selected columns without data", async () => {
  const f = fixture();
  const input = { point: 701, kingdomId: 1, now, resourceEffects: true };
  f.state.onObserver = () => {
    input.resourceEffects = false;
    input.kingdomId = 2;
  };
  expect((await f.store.read("observer", input)).resource!.owner).toBeDefined();
  expect(f.queries.every((query) => query.realm === 1)).toBe(true);
  await expect(
    f.store.read("observer", { ...input, resourceEffects: "yes" as unknown as boolean }),
  ).rejects.toThrow("Invalid world detail query");
  f.queries.length = 0;
  await checkWorldPointDetailStore(f.db);
  expect(f.queries).toHaveLength(24);
  expect(f.queries.every((query) => query.params.length === 1 && query.params[0] === 0)).toBe(true);
  expect(reads(f, "new_general")[0]!.text).not.toMatch(/skillInfo|predatoruid|oldrefineproperty/);
  await expect(readWorldResourceOwner(f.db, "bad\0owner")).rejects.toThrow(
    "Invalid resource owner",
  );
});
