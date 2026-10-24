import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import type { ReconnectMarchState } from "@opencok/contracts/reconnect";
import type { Row } from "@opencok/contracts/rows";
import { readReconnectMarches } from "@opencok/repositories/reconnect-marches";
import { projectReconnectMarches } from "@opencok/controllers/reconnect-marches";
import { Rules, type Rule } from "@opencok/rules/game";
import { decode, encode, fields, sfs, type Value } from "@opencok/messages/sfs";
import fixture from "./fixtures/reconnect-march-army.json";

const owner = "synthetic-owner";
const context = { kingdomId: 2, version: "12.06.0", now: 1000 };
const march = (extra: Row = {}): Row => ({
  uuid: "march",
  ownerUid: owner,
  ownerId: 1,
  targetId: 2,
  type: 0,
  state: 0,
  worldId: 0,
  armyInfo: null,
  ...extra,
});
const empty = (): ReconnectMarchState => ({
  rows: [],
  teams: [],
  points: [],
  profiles: [],
  alliances: [],
  states: [],
  offices: [],
  dragons: [],
  skills: [],
  miracles: [],
  territories: [],
});

function database(own: Row[], team: Row[] = [], overrides: Record<string, Row[]> = {}) {
  const tables: Record<string, Row[]> = {
    userprofile: [{ uid: owner, serverId: 2 }],
    alliance_battle_team: [{ id: "team", worldId: 0, leaderUid: owner, createTime: 100n }],
    ...overrides,
  };
  const queries: { text: string; params: unknown[] }[] = [];
  let marchRead = 0;
  const db = drizzle(
    {
      query: async (query: { text: string }, params: unknown[] = []) => {
        queries.push({ text: query.text, params });
        const table = query.text.match(/from "opencok_kingdom"\."([^"]+)"/)?.[1];
        if (!table) return { rows: [] };
        const selected = query.text
          .slice(7, query.text.indexOf(" from "))
          .split(", ")
          .map((part) => [...part.matchAll(/"([^"]+)"/g)].at(-1)![1]!);
        const rows =
          table === "world_march" ? (marchRead++ === 0 ? own : team) : (tables[table] ?? []);
        return {
          rows: rows.map((row) =>
            selected.map((key) =>
              typeof row[key] === "bigint" ? String(row[key]) : (row[key] ?? null),
            ),
          ),
        };
      },
    } as unknown as NodePgClient,
    { schema },
  );
  return { db, queries };
}

test("march hydration reads only the owner's marches and referenced teams, worlds and presentation fields", async () => {
  const own = march({ type: 5, teamId: "team" });
  const leader = march({ uuid: "leader", type: 4, teamId: "team" });
  const { db, queries } = database([own], [own, leader]);
  const result = await readReconnectMarches(db, owner);
  expect(result.rows.map((row) => row.uuid)).toEqual(["march", "leader"]);
  expect(result.teams[0]!.family).toBe(4);
  expect(queries[0]!.params).toContain(owner);
  expect(queries[0]!.text).not.toMatch(/exploreReport|buildingKillArmy|monsterInfo/);
  const memberQuery = queries.find((query) => query.text.includes('"world_march"."teamId"'))!;
  expect(memberQuery.params).toContain("team");
  const profileQuery = queries.find((query) =>
    query.text.includes('from "opencok_kingdom"."userprofile"'),
  )!;
  expect(profileQuery.text).not.toMatch(/password|device|email|gold/);
  const points = queries.find((query) =>
    query.text.includes('from "opencok_kingdom"."worldpoint"'),
  )!;
  expect(points.params).toContain(0);
  expect(points.params).toContain(2);
  const none = database([]);
  expect((await readReconnectMarches(none.db, owner)).rows).toEqual([]);
  expect(none.queries).toHaveLength(1);
});

test("foreign owners, foreign team worlds, dependencies and oversized rows reject", async () => {
  for (const fixture of [
    database([march({ ownerUid: "foreign" })]),
    database(
      [march({ type: 5, teamId: "team" })],
      [march({ type: 4, teamId: "team", worldId: 3 })],
    ),
    database([march()], [], { userprofile: [{ uid: "foreign", serverId: 2 }] }),
    database(Array.from({ length: 32768 }, (_, id) => march({ uuid: String(id) }))),
  ])
    await expect(readReconnectMarches(fixture.db, owner)).rejects.toThrow();
});

test("march projection restores realm origin, alliance, officer and appearance without exposing another owner's march", () => {
  const state = empty();
  state.rows = [
    march({ targetUid: "target", targetType: 1, allianceId: "alliance" }),
    march({ uuid: "foreign", ownerUid: "target" }),
  ];
  state.profiles = [
    { uid: owner, serverId: 2, crossFightSrcServerId: 7 },
    { uid: "target", serverId: 2, allianceId: "target-alliance" },
  ];
  state.alliances = [{ uid: "alliance", abbr: "ALLY" }];
  state.offices = [{ uid: owner, positionId: "216003", serverId: 2 }];
  state.states = [
    { uid: owner, stateId: 1 },
    { uid: owner, stateId: 2 },
    { uid: "target", stateId: 3 },
  ];
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.power.statuses = new Map<string, Rule>([
    ["1", { effect: "14;1" }],
    ["2", { type2: "101" }],
    ["3", { effect: "14;2" }],
  ]);
  const response = decode(encode(projectReconnectMarches(state, owner, rules, context, undefined)));
  const rows = response.worldMarch!.value as Value[];
  expect(rows).toHaveLength(1);
  expect(fields(rows[0])).toMatchObject({
    serverId: sfs.int(7),
    asn: sfs.string("ALLY"),
    tali: sfs.string("target-alliance"),
    officer: sfs.string("216003"),
    attSkin: sfs.int(1),
    marchSkin: sfs.int(2),
    defSkin: sfs.int(3),
    oType: sfs.int(0),
  });
});

test("occupied resource marches combine saved companions, current effects, plunder and typed collection fields", () => {
  const state = empty();
  state.rows = [
    march({
      state: 1,
      targetType: 3,
      armyInfo: Buffer.from(fixture.companions, "base64"),
      plunderRes: '[{"v":3}]',
      collectSpd: 2.5,
      collectedBeforeSpd: 7n,
      marchArrivalTime: 900n,
      changeCollectSpdTime: 950n,
      occupyResourceEndTime: 2000n,
    }),
  ];
  state.profiles = [{ uid: owner, serverId: 2, crossFightSrcServerId: -1 }];
  state.points = [
    { id: 2, worldId: 0, pointType: 3, pointItem: "3", resInitValue: 1000, resCostValue: 10 },
  ];
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.arms.set("100001", { arm: "1", new_arms: "1", load: "10" });
  rules.items.set("resources_weight", { k4: "2" });
  const effects = { worldLoad: 10, worldLoadAdd: 0, general: 0, newGeneral: 0, expedition: 0 };
  const response = decode(encode(projectReconnectMarches(state, owner, rules, context, effects)));
  const row = fields((response.worldMarch!.value as Value[])[0]);
  expect(row.q).toEqual(sfs.int(90));
  expect(row.tq).toEqual(sfs.int(990));
  expect(row.sdt).toEqual(sfs.long(900));
  expect(row.collected).toEqual(sfs.int(7));
  expect(row.occupyEndTime).toEqual(sfs.long(2000));
  expect(row.generalList!.value as Value[]).toHaveLength(1);
  state.rows[0]!.plunderRes = "";
  const blank = projectReconnectMarches(state, owner, rules, context, effects);
  state.rows[0]!.plunderRes = null;
  expect(projectReconnectMarches(state, owner, rules, context, effects)).toEqual(blank);
  state.points = [];
  expect(() => projectReconnectMarches(state, owner, rules, context, effects)).toThrow();
});
