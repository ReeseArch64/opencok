import { decodeWorldResourceArmy } from "@opencok/messages/world-resource-army";
import armyVectors from "./fixtures/world-resource-army-vectors.json";
import { Game } from "@opencok/controllers/game";
import type { GameStore } from "@opencok/contracts/game";
import { Rules } from "@opencok/rules/game";
import { Type } from "@opencok/messages/sfs";
import { MAX_FRAME } from "@opencok/messages/frame";
import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as kingdom from "@opencok/drizzle/schema/kingdom";
import {
  createWorldPointDetailStore,
  checkWorldPointDetailStore,
} from "@opencok/repositories/world-point-detail";
import {
  worldPointDetailQuery,
  worldPointOccupied,
  worldPointOwnerBase,
} from "@opencok/rules/world-point-detail";
import { worldPointOwner } from "@opencok/dtos/world-point-detail";
import type { WorldPointOwnerSnapshot } from "@opencok/contracts/world-point-detail";
import type { Row } from "@opencok/contracts/rows";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const now = 1792756800123;
const pointKeys = [
  "id",
  "worldId",
  "pointType",
  "pointItem",
  "ownerId",
  "ownerName",
  "allianceId",
  "ownerMarchUUid",
  "resInitValue",
  "resCostValue",
  "monsterCurrHP",
  "territoryAlliance",
  "active",
  "reserve",
];
const samplePoint = (patch: Row = {}): Row => ({
  id: 701,
  worldId: 9,
  pointType: 1,
  pointItem: "0",
  ownerId: "target",
  ownerName: "Synthetic owner",
  allianceId: "point-alliance",
  ownerMarchUUid: null,
  resInitValue: 100,
  resCostValue: 2,
  monsterCurrHP: 3,
  territoryAlliance: null,
  active: 0,
  reserve: 0n,
  ...patch,
});
const ownerSnapshot = (): WorldPointOwnerSnapshot => ({
  profile: { uid: "target", pic: "g101", regTime: 100n },
  statistics: { uid: "target", power: 9007199254740993n, armyKill: -9223372036854775808n },
  registration: { uid: "target", type: 2, time: 200n },
  alliance: { uid: "point-alliance", abbr: "SYN" },
  member: { uid: "target", rank: 4 },
});
function fixture() {
  const queries: { realm: number; text: string; params: unknown[] }[] = [];
  const state = {
    observer: {
      uid: "observer",
      serverId: 1,
      banTime: 0n,
      banFlag: 0,
      allianceId: "observer-alliance",
      appVersion: "12.06.0",
    } as Row | undefined,
    world: { uid: "observer", worldId: 9 } as Row | undefined,
    points: new Map<number, Row[]>([
      [1, [samplePoint()]],
      [2, [samplePoint({ worldId: 0, ownerId: "remote" })]],
    ]),
    owners: new Map<number, WorldPointOwnerSnapshot>([
      [1, ownerSnapshot()],
      [
        2,
        {
          profile: { uid: "remote", pic: "g102", regTime: 300n },
          statistics: { uid: "remote", power: 8n, armyKill: 5n },
          alliance: { uid: "point-alliance", abbr: "RMT" },
          member: { uid: "remote", rank: 3 },
        },
      ],
    ]),
    registrations: new Map<number, Row[]>([
      [
        1,
        [
          { uid: "target", type: 0, time: 900n },
          { uid: "target", type: 2, time: 200n },
          { uid: "target", type: 1, time: 500n },
        ],
      ],
      [2, []],
    ]),
    marches: new Map<number, Row[]>([
      [1, []],
      [2, []],
    ]),
    fail: "",
    raw: new Map<string, unknown[][]>(),
    onObserver: undefined as (() => void) | undefined,
  };
  const databases = new Map(
    [1, 2].map((realm) => {
      const client = {
        query: async (query: { text: string }, params: unknown[] = []) => {
          const text = query.text;
          queries.push({ realm, text, params });
          if (state.fail === `${realm}:${text}`) throw new Error("Synthetic private failure");
          if (text.startsWith("begin")) {
            expect(text).toBe("begin isolation level repeatable read read only");
            return { rows: [] };
          }
          if (text === "commit" || text === "rollback") return { rows: [] };
          expect(text).toStartWith("select ");
          expect(text).not.toMatch(/for update|for share|password|email|referrer|"ip"|monsterInfo/);
          const table = /from "opencok_kingdom"\."([^"]+)"/.exec(text)?.[1];
          expect(table).toBeDefined();
          if (table !== "world_march") expect(text).not.toMatch(/armyInfo|plunderRes/);
          if (state.fail === `${realm}:${table}`) throw new Error("Synthetic private failure");
          if (params.length === 1 && params[0] === 0) return { rows: [] };
          const key = `${realm}:${table}${table === "userprofile" && text.includes('"serverId"') ? ":observer" : ""}`;
          if (state.raw.has(key)) return { rows: state.raw.get(key) };
          const owner = state.owners.get(realm)!;
          const values = (row: Row | undefined, keys: string[]) =>
            row ? [keys.map((k) => row[k] ?? null)] : [];
          if (table === "userprofile" && text.includes('"serverId"')) {
            expect(realm).toBe(1);
            expect(params).toEqual(["observer", 2]);
            state.onObserver?.();
            return {
              rows: values(state.observer, [
                "uid",
                "serverId",
                "banTime",
                "banFlag",
                "allianceId",
                "appVersion",
              ]),
            };
          }
          if (table === "user_world") {
            expect(realm).toBe(1);
            expect(params).toEqual(["observer", 2]);
            return { rows: values(state.world, ["uid", "worldId"]) };
          }
          if (table === "world_barbarion") return { rows: [] };
          if (table === "world_march") {
            expect(params).toEqual([state.points.get(realm)![0]!.ownerMarchUUid, 2]);
            expect(text).toContain('"world_march"."uuid" = $1');
            expect(text.slice(text.indexOf(" where "))).not.toMatch(
              /ownerUid|worldId|targetId|state/,
            );
            const columns = text
              .slice(7, text.indexOf(" from "))
              .split(", ")
              .map((column) => [...column.matchAll(/"([^"]+)"/g)].at(-1)![1]!);
            return {
              rows: state.marches
                .get(realm)!
                .filter((row) => row.uuid === params[0])
                .map((row) => columns.map((key) => row[key] ?? null)),
            };
          }
          if (table === "worldpoint") {
            expect(text).toContain('"worldpoint"."id" = $1');
            expect(text).toContain('"worldpoint"."worldId" = $2');
            expect(params[2]).toBe(2);
            const rows = state.points
              .get(realm)!
              .filter((row) => row.id === params[0] && row.worldId === params[1]);
            return { rows: rows.map((row) => pointKeys.map((k) => row[k] ?? null)) };
          }
          if (table === "stat_reg") {
            expect(text).toContain(
              'order by "opencok_kingdom"."stat_reg"."type" = $2 desc, "opencok_kingdom"."stat_reg"."time" desc, "opencok_kingdom"."stat_reg"."type" asc limit $3',
            );
            expect(params.slice(1)).toEqual([2, 1]);
            const rows = state.registrations
              .get(realm)!
              .filter((row) => row.uid === params[0])
              .sort(
                (a, b) =>
                  Number(b.type === 2) - Number(a.type === 2) ||
                  ((a.time as bigint) > (b.time as bigint)
                    ? -1
                    : (a.time as bigint) < (b.time as bigint)
                      ? 1
                      : Number(a.type) - Number(b.type)),
              );
            return { rows: values(rows[0], ["uid", "type", "time"]) };
          }
          const choice: Record<string, [Row | undefined, string[]]> = {
            userprofile: [owner.profile, ["uid", "pic", "regTime"]],
            playerinfo: [owner.statistics, ["uid", "power", "armyKill"]],
            alliance: [owner.alliance, ["uid", "abbr"]],
            alliance_member: [owner.member, ["uid", "rank"]],
          };
          expect(choice[table!]).toBeDefined();
          expect(params[1]).toBe(2);
          if (table === "alliance_member") {
            expect(text).not.toContain('"allianceId"');
            expect(params[0]).toBe(realm === 1 ? "target" : "remote");
          }
          const [row, keys] = choice[table!]!;
          return { rows: values(row?.uid === params[0] ? row : undefined, keys) };
        },
      };
      return [
        realm,
        { db: drizzle(client as unknown as NodePgClient, { schema: kingdom }) },
      ] as const;
    }),
  );
  const topology = {
    kingdoms: databases,
    getKingdom: (id: number) => {
      const result = databases.get(id);
      if (!result) throw new Error("Synthetic missing realm");
      return result;
    },
  } as unknown as Parameters<typeof createWorldPointDetailStore>[0];
  const store = createWorldPointDetailStore(topology, 1);
  return {
    state,
    queries,
    topology,
    store,
    db: databases.get(1)!.db,
    read: (point = 701, server?: number) =>
      store.read("observer", worldPointDetailQuery(point, server, 1, now)),
  };
}
const reads = (f: ReturnType<typeof fixture>, table: string) =>
  f.queries.filter((q) => q.text.includes(`from "opencok_kingdom"."${table}"`));

test("point queries preserve signed point IDs and normalize the local realm sentinel", () => {
  for (const server of [undefined, -1, 1])
    expect(worldPointDetailQuery(-1, server, 1, now)).toEqual({ point: -1, kingdomId: 1, now });
  expect(worldPointDetailQuery(2147483647, 2, 1, now).kingdomId).toBe(2);
  for (const server of [0, -2, NaN, Infinity, 1.5, 2147483648])
    expect(() => worldPointDetailQuery(1, server, 1, now)).toThrow();
  for (const point of [NaN, 1.5, -2147483649, 2147483648])
    expect(() => worldPointDetailQuery(point, 1, 1, now)).toThrow();
  expect(() => worldPointDetailQuery(1, 1, 0, now)).toThrow();
  expect(() => worldPointDetailQuery(1, 1, 1, -1)).toThrow();
  expect(() => worldPointDetailQuery(1, 1, 1, 9007199254740992)).toThrow();
});

test("point occupancy recognizes either owner identity or name using Java whitespace", () => {
  for (const blank of [null, "", "\t\r\n ", "\u001c", "\u180e", "\u2003", "\u3000"]) {
    expect(worldPointOccupied({ ownerId: blank, ownerName: blank })).toBe(false);
    expect(worldPointOccupied({ ownerId: blank, ownerName: "Owner" })).toBe(true);
    expect(worldPointOccupied({ ownerId: "owner", ownerName: blank })).toBe(true);
  }
  for (const nonblank of ["\u00a0", "\u2007", "\u202f", "\u200b"])
    expect(worldPointOccupied({ ownerId: nonblank })).toBe(true);
  for (const value of ["\0", "\ud800", "x".repeat(256)])
    expect(() => worldPointOccupied({ ownerId: value })).toThrow();
});

test("owner base fields retain exact local SFS types and type-specific omissions across all point kinds", () => {
  for (const remote of [false, true])
    for (let type = 0; type <= 69; type++) {
      const result = worldPointOwner(
        worldPointOwnerBase(samplePoint({ pointType: type }), ownerSnapshot(), remote),
      );
      let expected = { uid: sfs.string("target"), registerTime: sfs.long(200n) } as ReturnType<
        typeof worldPointOwner
      >;
      if (!remote && type === 15) expected = {};
      else if (!remote && type === 6) expected = { uid: sfs.string("target") };
      else {
        if ([1, 2, 3, 4, 5, 37].includes(type)) expected.pic = sfs.string("g101");
        if ([1, 2].includes(type))
          Object.assign(expected, {
            power: sfs.long(9007199254740993n),
            killArmy: sfs.long(-9223372036854775808n),
          });
        if ([1, 2, 3].includes(type))
          Object.assign(expected, { rank: sfs.int(4), vl: sfs.int(0), afn: sfs.string("SYN") });
      }
      expect(result).toEqual(expected);
      expect(decode(encode(result))).toEqual(result);
    }
});

test("missing owners and alliance data retain legacy defaults without invented statistics or metadata", () => {
  const missing = worldPointOwnerBase(samplePoint(), {}, false);
  expect(missing).toEqual({ uid: "target", registerTime: 0n, pic: "", rank: 0, vl: 0 });
  expect(
    worldPointOwnerBase(
      samplePoint({ ownerId: "\u2003", ownerName: "Still occupied" }),
      ownerSnapshot(),
      false,
    ),
  ).toEqual({});
  const city = samplePoint({ allianceId: null });
  expect(worldPointOwnerBase(city, {}, false)).toEqual({
    uid: "target",
    registerTime: 0n,
    pic: "",
    vl: 0,
  });
  expect(worldPointOwnerBase({ ...city, pointType: 3 }, {}, false).rank).toBe(0);
  const owner = ownerSnapshot();
  owner.alliance!.abbr = "";
  owner.member!.rank = -1;
  expect(worldPointOwnerBase(samplePoint(), owner, false).afn).toBe("");
  expect(worldPointOwnerBase(samplePoint(), owner, false).rank).toBe(-1);
  owner.alliance!.abbr = null;
  owner.member!.rank = null;
  expect(worldPointOwnerBase(samplePoint(), owner, false).afn).toBeUndefined();
  expect(worldPointOwnerBase(samplePoint(), owner, false).rank).toBe(0);
  owner.statistics!.power = null;
  owner.statistics!.armyKill = null;
  expect(worldPointOwnerBase(samplePoint(), owner, false).power).toBe(0n);
  expect(worldPointOwnerBase(samplePoint(), owner, false).killArmy).toBe(0n);
});

test("registration is max(profile, chosen record), preserving negative and large exact times", () => {
  const owner = ownerSnapshot();
  for (const [profileTime, recordTime, expected] of [
    [100n, 200n, 200n],
    [9007199254740993n, 200n, 9007199254740993n],
    [-5n, -2n, -2n],
    [100n, 100n, 100n],
    [-9223372036854775808n, 9223372036854775807n, 9223372036854775807n],
  ]) {
    owner.profile!.regTime = profileTime!;
    owner.registration!.time = recordTime!;
    expect(worldPointOwnerBase(samplePoint(), owner, false).registerTime).toBe(expected!);
  }
  owner.profile = undefined;
  expect(worldPointOwnerBase(samplePoint(), owner, false).registerTime).toBe(0n);
});

test("owner projection rejects foreign rows, invalid wire values and missing required city statistics", () => {
  for (const key of ["profile", "statistics", "registration", "alliance", "member"] as const) {
    const owner = ownerSnapshot();
    owner[key]!.uid = "foreign";
    expect(() => worldPointOwnerBase(samplePoint(), owner, false)).toThrow();
  }
  const owner = ownerSnapshot();
  owner.statistics = undefined;
  expect(() => worldPointOwnerBase(samplePoint(), owner, false)).toThrow();
  expect(worldPointOwnerBase(samplePoint({ pointType: 3 }), owner, false).power).toBeUndefined();
  owner.profile!.pic = null;
  expect(() => worldPointOwnerBase(samplePoint({ pointType: 3 }), owner, false)).toThrow();
  expect(worldPointOwnerBase(samplePoint({ pointType: 14 }), owner, false).registerTime).toBe(200n);
  for (const key of ["power", "armyKill"]) {
    const invalid = ownerSnapshot();
    invalid.statistics![key] = 9223372036854775808n;
    expect(() => worldPointOwnerBase(samplePoint(), invalid, false)).toThrow();
  }
  const invalid = ownerSnapshot();
  invalid.member!.rank = 1.5;
  expect(() => worldPointOwnerBase(samplePoint(), invalid, false)).toThrow();
  const input = ownerSnapshot(),
    before = structuredClone(input);
  worldPointOwnerBase(samplePoint(), input, false);
  expect(input).toEqual(before);
});

test("local detail reads point and owner in the observer world and one read-only snapshot", async () => {
  const f = fixture();
  const result = await f.read();
  expect(result.remote).toBe(false);
  expect(result.kingdomId).toBe(1);
  expect(result.point).toEqual(samplePoint());
  expect(result.world).toEqual(f.state.world);
  expect(result.owner!.registration).toEqual({ uid: "target", type: 2, time: 200n });
  expect(worldPointOwnerBase(result.point!, result.owner!, result.remote)).toEqual({
    uid: "target",
    registerTime: 200n,
    pic: "g101",
    power: 9007199254740993n,
    killArmy: -9223372036854775808n,
    afn: "SYN",
    rank: 4,
    vl: 0,
  });
  expect(f.queries[0]!.text).toStartWith("begin");
  expect(f.queries.at(-1)!.text).toBe("commit");
  expect(f.queries.every((q) => q.realm === 1)).toBe(true);
  expect(reads(f, "worldpoint")[0]!.params).toEqual([701, 9, 2]);
  expect(reads(f, "alliance")[0]!.params[0]).toBe("point-alliance");
  const before = structuredClone({ point: f.state.points.get(1), owner: f.state.owners.get(1) });
  await f.read();
  expect({ point: f.state.points.get(1), owner: f.state.owners.get(1) }).toEqual(before);
});

test("registration query prefers type 2, otherwise latest time, without selecting private registration columns", async () => {
  const f = fixture();
  expect((await f.read()).owner!.registration!.type).toBe(2);
  f.state.registrations.set(
    1,
    f.state.registrations.get(1)!.filter((row) => row.type !== 2),
  );
  expect((await f.read()).owner!.registration!.time).toBe(900n);
  f.state.registrations.set(1, []);
  const result = await f.read();
  expect(result.owner!.registration).toBeUndefined();
  expect(worldPointOwnerBase(result.point!, result.owner!, false).registerTime).toBe(100n);
  expect(
    reads(f, "stat_reg").every((q) => !q.text.includes('"country"') && !q.text.includes('"pf"')),
  ).toBe(true);
});

test("remote reads authorize locally before a separate configured realm snapshot at world zero", async () => {
  const f = fixture();
  const result = await f.read(701, 2);
  expect(result.remote).toBe(true);
  expect(result.kingdomId).toBe(2);
  expect(result.point!.worldId).toBe(0);
  expect(result.owner!.profile!.uid).toBe("remote");
  expect(worldPointOwnerBase(result.point!, result.owner!, true).registerTime).toBe(300n);
  expect(reads(f, "worldpoint").map((q) => [q.realm, q.params])).toEqual([[2, [701, 0, 2]]]);
  expect(f.queries.filter((q) => q.text === "commit").map((q) => q.realm)).toEqual([1, 2]);
  const firstRemote = f.queries.findIndex((q) => q.realm === 2);
  expect(f.queries[firstRemote - 1]!.text).toBe("commit");
  expect(f.queries.filter((q) => q.realm === 1 && q.text.startsWith("select")).length).toBe(2);
});

test("nonpositive points stop after authentication, while missing points remain explicitly absent", async () => {
  for (const point of [0, -1, -2147483648]) {
    const f = fixture();
    const result = await f.read(point, 999);
    expect(result.point).toBeUndefined();
    expect(result.world).toBeUndefined();
    expect(f.queries.length).toBe(3);
    expect(f.queries.every((q) => q.realm === 1)).toBe(true);
  }
  const f = fixture();
  const result = await f.read(702);
  expect(result.point).toBeUndefined();
  expect(result.owner).toBeUndefined();
  expect(reads(f, "userprofile").length).toBe(1);
  expect(f.queries.at(-1)!.text).toBe("commit");
});

test("missing, banned, foreign or misplaced observers cannot read local or remote point state", async () => {
  const observers: (Row | undefined)[] = [
    undefined,
    { uid: "foreign" },
    { serverId: 2 },
    { banFlag: 1 },
    { banTime: BigInt(now + 1) },
    { banTime: 9223372036854775807n },
  ];
  for (const observer of observers) {
    for (const server of [1, 2]) {
      const f = fixture();
      f.state.observer = observer ? { ...f.state.observer!, ...observer } : undefined;
      const result = await f.read(701, server);
      expect(result.point).toBeUndefined();
      expect(result.owner).toBeUndefined();
      expect(f.queries.length).toBe(3);
      expect(f.queries.every((q) => q.realm === 1)).toBe(true);
    }
  }
  const f = fixture();
  f.state.observer!.banTime = BigInt(now);
  expect((await f.read()).point).toBeDefined();
});

test("local monster early exits skip public owner reads while remote owner reads remain present", async () => {
  for (const pointType of [6, 15]) {
    const f = fixture();
    f.state.points.set(1, [samplePoint({ pointType })]);
    const result = await f.read();
    expect(result.owner).toEqual({});
    expect(reads(f, "userprofile").length).toBe(1);
    expect(reads(f, "stat_reg")).toEqual([]);
    const remotePoint = samplePoint({ pointType, ownerId: "remote", worldId: 0 });
    f.state.points.set(2, [remotePoint]);
    const remote = await f.read(701, 2);
    expect(remote.owner!.profile!.uid).toBe("remote");
    expect(worldPointOwnerBase(remote.point!, remote.owner!, true)).toEqual({
      uid: "remote",
      registerTime: 300n,
    });
  }
});

test("blank and absent owners skip dependent reads; resources use only their relevant owner fields", async () => {
  for (const ownerId of [null, "", "\u180e\u2003", "\u001c\u3000"]) {
    const f = fixture();
    f.state.points.set(1, [samplePoint({ ownerId })]);
    expect((await f.read()).owner).toEqual({});
    expect(reads(f, "userprofile").length).toBe(1);
  }
  for (const pointType of [3, 4, 5, 14, 37]) {
    const f = fixture();
    f.state.points.set(1, [samplePoint({ pointType })]);
    const result = await f.read();
    expect(result.owner!.profile).toBeDefined();
    expect(reads(f, "playerinfo")).toEqual([]);
    expect(reads(f, "alliance").length).toBe(pointType === 3 ? 1 : 0);
  }
  const f = fixture();
  f.state.owners.get(1)!.profile = undefined;
  const result = await f.read();
  expect(result.owner!.statistics).toBeUndefined();
  expect(result.owner!.registration).toBeUndefined();
  expect(result.owner!.member).toBeDefined();
  expect(worldPointOwnerBase(result.point!, result.owner!, false)).toEqual({
    uid: "target",
    registerTime: 0n,
    pic: "",
    afn: "SYN",
    rank: 4,
    vl: 0,
  });
});

test("invalid worlds, unconfigured routes and adapter failures reject without fallback and sanitize dependency details", async () => {
  for (const world of [
    undefined,
    { uid: "other", worldId: 9 },
    { uid: "observer", worldId: 1.5 },
  ]) {
    const f = fixture();
    f.state.world = world;
    await expect(f.read(701, 2)).rejects.toThrow("world point detail unavailable");
    expect(f.queries.at(-1)!.text).toBe("rollback");
    expect(f.queries.every((q) => q.realm === 1)).toBe(true);
  }
  const f = fixture();
  await expect(f.read(701, 3)).rejects.toThrow("world point detail unavailable");
  expect(reads(f, "worldpoint")).toEqual([]);
  for (const fail of [
    "1:userprofile",
    "1:worldpoint",
    "1:stat_reg",
    "1:playerinfo",
    "1:alliance",
    "1:alliance_member",
    "1:commit",
    "2:worldpoint",
    "2:commit",
  ]) {
    const f = fixture();
    f.state.fail = fail;
    await expect(f.read(701, fail.startsWith("2") ? 2 : 1)).rejects.toThrow(
      "world point detail unavailable",
    );
    expect(f.queries.at(-1)!.text).toBe("rollback");
  }
});

test("foreign and duplicate adapter records reject instead of silently assembling another owner's detail", async () => {
  const cases: [string, unknown[][]][] = [
    [
      "1:userprofile:observer",
      [
        ["observer", 1, 0n, 0, "a", "12"],
        ["observer", 1, 0n, 0, "a", "12"],
      ],
    ],
    ["1:userprofile", [["other", "g101", 0n]]],
    ["1:stat_reg", [["other", 2, 0n]]],
    ["1:playerinfo", [["other", 1n, 2n]]],
    ["1:alliance", [["other", "SYN"]]],
    ["1:alliance_member", [["other", 1]]],
    ["1:worldpoint", [pointKeys.map((k) => samplePoint({ worldId: 0 })[k])]],
  ];
  for (const [key, rows] of cases) {
    const f = fixture();
    f.state.raw.set(key, rows);
    await expect(f.read()).rejects.toThrow("world point detail unavailable");
    expect(f.queries.at(-1)!.text).toBe("rollback");
  }
  const f = fixture();
  f.state.points.get(1)!.push(samplePoint());
  await expect(f.read()).rejects.toThrow("world point detail unavailable");
});

test("captured query fields cannot be changed during authorization and readiness stays read-only", async () => {
  const f = fixture();
  const input = worldPointDetailQuery(701, 1, 1, now);
  f.state.onObserver = () => {
    input.kingdomId = 2;
    input.point = 702;
    input.now = 0;
  };
  const result = await f.store.read("observer", input);
  expect(result.point!.id).toBe(701);
  expect(result.kingdomId).toBe(1);
  expect(f.queries.every((q) => q.realm === 1)).toBe(true);
  f.queries.length = 0;
  await checkWorldPointDetailStore(f.db);
  expect(f.queries).toHaveLength(10);
  expect(f.queries.every((q) => q.params[0] === 0)).toBe(true);
  expect(() => createWorldPointDetailStore(f.topology, 0)).toThrow();
  for (const patch of [{ point: 1.5 }, { kingdomId: 0 }, { now: -1 }])
    await expect(
      f.store.read("observer", { point: 701, kingdomId: 1, now, ...patch }),
    ).rejects.toThrow("Invalid world detail query");
  await expect(f.store.read("\0", { point: 701, kingdomId: 1, now })).rejects.toThrow(
    "Invalid world detail query",
  );
});

function remoteCommandFixture() {
  const f = fixture();
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.items.set("lost_battle", { k3: "1", k4: "2" });
  let clocks = 0;
  const game = new Game(
    {} as GameStore,
    rules,
    { kingdomId: 1 },
    () => {
      clocks++;
      return now;
    },
    {
      worldPointDetail: f.store,
      worldPowerEffects: async () => {
        throw new Error("Unexpected remote effect cache");
      },
      emperorVersion: async () => {
        throw new Error("Unexpected remote emperor read");
      },
    },
  );
  const execute = () =>
    game.execute("observer", "world.get.detail", {
      point: sfs.int(701),
      serverId: sfs.int(2),
      _cok_: sfs.long(1n),
      cmdBaseTime: sfs.long(2n),
    });
  return { ...f, rules, game, execute, clocks: () => clocks };
}

test("remote point command authenticates locally then reads world zero with legacy JSON numeric widths", async () => {
  const f = remoteCommandFixture();
  const result = await f.execute();
  expect(result).toEqual({
    body: {
      uid: sfs.string("remote"),
      registerTime: sfs.int(300),
      pic: sfs.string("g102"),
      power: sfs.int(8),
      killArmy: sfs.int(5),
      afn: sfs.string("RMT"),
      rank: sfs.int(3),
      vl: sfs.int(0),
      point: sfs.int(701),
      _cok_: sfs.long(1n),
      cmdBaseTime: sfs.long(2n),
    },
    pushes: [],
  });
  expect(decode(encode(result.body))).toEqual(result.body);
  expect(f.clocks()).toBe(1);
  expect(f.queries.map((q) => q.realm)).toEqual([
    ...Array(4).fill(1),
    ...Array(f.queries.length - 4).fill(2),
  ]);
  expect(f.queries[3]!.text).toBe("commit");
  expect(f.queries[4]!.text).toBe("begin isolation level repeatable read read only");
  expect(f.queries.at(-1)!.text).toBe("commit");
  expect(reads(f, "worldpoint")[0]!.params).toEqual([701, 0, 2]);
  expect(
    f.queries.some((q) => /world_march|user_mixed_info|world_barbarion|user_state/.test(q.text)),
  ).toBe(false);
});

test("remote public longs retain exact boundary values and narrow only inside the signed Int range", async () => {
  for (const power of [
    -9223372036854775808n,
    -9007199254740993n,
    -2147483649n,
    -2147483648n,
    0n,
    2147483647n,
    2147483648n,
    9007199254740993n,
    9223372036854775807n,
  ]) {
    const f = remoteCommandFixture();
    f.state.owners.get(2)!.statistics!.power = power;
    f.state.owners.get(2)!.profile!.regTime = power;
    const body = (await f.execute()).body;
    const expected =
      power >= -2147483648n && power <= 2147483647n ? sfs.int(Number(power)) : sfs.long(power);
    expect(body.power).toEqual(expected);
    expect(body.registerTime).toEqual(expected);
    expect(body._cok_!.type).toBe(Type.Long);
    expect(decode(encode(body))).toEqual(body);
  }
});

test("remote monster, city, barbarian, neutral and world-boss details omit local-only additions", async () => {
  for (const type of [1, 2, 6, 15, 44, 49, 50, 60]) {
    const f = remoteCommandFixture();
    f.state.points.get(2)![0]!.pointType = type;
    const result = await f.execute();
    expect(result.body.uid).toEqual(sfs.string("remote"));
    expect(result.body.registerTime).toEqual(sfs.int(300));
    expect(result.body.point).toEqual(sfs.int(701));
    for (const key of [
      "erp",
      "st",
      "et",
      "mchp",
      "mmhp",
      "slowDown",
      "targetTooStrong",
      "targetPower",
      "lastBeDuelTime",
      "barbarionPower",
      "occupybegintime",
      "data",
      "reward",
    ])
      expect(result.body[key]).toBeUndefined();
    expect(f.clocks()).toBe(1);
    expect(f.queries.some((q) => /world_march|world_barbarion|user_mixed_info/.test(q.text))).toBe(
      false,
    );
  }
});

test("remote resource service preserves its separate early return and new-resource base behavior", async () => {
  const f = remoteCommandFixture();
  const point = f.state.points.get(2)![0]!;
  Object.assign(point, {
    pointType: 3,
    ownerId: null,
    ownerName: null,
    resInitValue: -2147483648,
    resCostValue: 1,
  });
  expect((await f.execute()).body).toEqual({
    point: sfs.int(701),
    tq: sfs.int(2147483647),
    _cok_: sfs.long(1n),
    cmdBaseTime: sfs.long(2n),
  });
  point.pointType = 37;
  expect((await f.execute()).body).toEqual({
    point: sfs.int(701),
    _cok_: sfs.long(1n),
    cmdBaseTime: sfs.long(2n),
  });
  point.ownerId = "remote";
  point.ownerName = "Owner";
  expect((await f.execute()).body).toEqual({
    uid: sfs.string("remote"),
    registerTime: sfs.int(300),
    pic: sfs.string("g102"),
    point: sfs.int(701),
    _cok_: sfs.long(1n),
    cmdBaseTime: sfs.long(2n),
  });
  point.pointType = 3;
  point.active = 1;
  point.territoryAlliance = "observer-alliance";
  expect((await f.execute()).body.territory_positive_effect).toBeUndefined();
  point.ownerMarchUUid = "existing";
  await expect(f.execute()).rejects.toThrow("102192");
  point.pointType = 37;
  await expect(f.execute()).rejects.toThrow("102192");
});

test("remote point commands reject missing routes, points and unfinished territory state without local fallback", async () => {
  for (const type of [14, 18, 20, 21, 23, 46, 47, -1, 70]) {
    const f = remoteCommandFixture();
    f.state.points.get(2)![0]!.pointType = type;
    await expect(f.execute()).rejects.toThrow("102192");
  }
  const f = remoteCommandFixture();
  f.state.points.set(2, []);
  await expect(f.execute()).rejects.toThrow("E100169");
  await expect(
    f.game.execute("observer", "world.get.detail", {
      point: sfs.int(701),
      serverId: sfs.int(3),
    }),
  ).rejects.toThrow("world point detail unavailable");
  expect(f.queries.every((q) => q.realm !== 3)).toBe(true);
});

test("remote failures preserve local authorization and do not fabricate success after committed local reads", async () => {
  for (const key of ["2:worldpoint", "2:playerinfo", "2:commit"]) {
    const f = remoteCommandFixture();
    f.state.fail = key;
    await expect(f.execute()).rejects.toThrow("world point detail unavailable");
    expect(f.queries.at(-1)).toEqual({ realm: 2, text: "rollback", params: [] });
    expect(f.queries.some((q) => q.realm === 1 && q.text === "commit")).toBe(true);
  }
  for (const patch of [{ banFlag: 1 }, { banTime: BigInt(now + 1) }, { serverId: 2 }]) {
    const f = remoteCommandFixture();
    Object.assign(f.state.observer!, patch);
    await expect(f.execute()).rejects.toThrow("E000000");
    expect(f.queries.every((q) => q.realm === 1)).toBe(true);
  }
  const f = remoteCommandFixture();
  f.state.world = undefined;
  await expect(f.execute()).rejects.toThrow("world point detail unavailable");
  expect(f.queries.every((q) => q.realm === 1)).toBe(true);
});

test("remote public strings retain quoted JSON-like values while unsupported function values fail without execution", async () => {
  const f = remoteCommandFixture();
  for (const value of ["null", "123", "true", "{a:1}", "[1,2]", 'a"b', "a\nb", '"null"']) {
    f.state.owners.get(2)!.profile!.pic = value;
    expect((await f.execute()).body.pic).toEqual(sfs.string(value));
  }
  f.state.owners.get(2)!.profile!.pic = "function(){}";
  await expect(f.execute()).rejects.toThrow("Invalid stored JSON object");
  f.state.owners.get(2)!.profile!.pic = "function(){}\n";
  expect((await f.execute()).body.pic).toEqual(sfs.string("function(){}\n"));
});

test("remote nonpositive points preserve empty replies and complete response bounds include correlation", async () => {
  const f = remoteCommandFixture();
  expect(
    (
      await f.game.execute("observer", "world.get.detail", {
        point: sfs.int(0),
        serverId: sfs.int(999),
      })
    ).body,
  ).toEqual({});
  expect(f.queries.every((q) => q.realm === 1)).toBe(true);
  expect(f.queries.some((q) => /worldpoint|user_world/.test(q.text))).toBe(false);
  await expect(
    f.game.execute("observer", "world.get.detail", {
      point: sfs.int(701),
      serverId: sfs.int(2),
      _cok_: { type: Type.Bytes, value: Buffer.alloc(MAX_FRAME) },
    }),
  ).rejects.toThrow("102192");
});

const resourceMarch = (patch: Row = {}): Row => ({
  uuid: "resource-march",
  ownerUid: "target",
  targetId: 701,
  worldId: 9,
  state: 1,
  armyInfo: Buffer.from(armyVectors.arrayList, "base64"),
  collectSpd: 0.1,
  marchArrivalTime: 9007199254740993n,
  collectedBeforeSpd: 2147483647n,
  changeCollectSpdTime: -9223372036854775808n,
  occupyResourceEndTime: 9223372036854775807n,
  plunderRes: '[{"v":7}]',
  ...patch,
});
function resourceFixture(realm = 1, type = 3) {
  const f = fixture();
  Object.assign(f.state.points.get(realm)![0]!, {
    pointType: type,
    ownerMarchUUid: "resource-march",
  });
  f.state.marches.set(realm, [
    resourceMarch({ ownerUid: realm === 1 ? "target" : "remote", worldId: realm === 1 ? 9 : 0 }),
  ]);
  return { ...f, readResource: () => f.read(701, realm) };
}

test("occupied resource reads the exact pointer in the point snapshot and preserves saved collection fields", async () => {
  for (const type of [3, 37]) {
    const f = resourceFixture(1, type);
    const saved = f.state.marches.get(1)![0]!;
    Object.assign(saved, { targetId: 702, worldId: 7, state: 2 });
    f.state.marches.get(1)!.push(resourceMarch({ uuid: "unrelated" }));
    const result = await f.readResource();
    expect(result.resource!.march).toEqual({ ...saved, collectSpd: Math.fround(0.1) });
    expect(saved.collectSpd).toBe(0.1);
    expect(decodeWorldResourceArmy(result.resource!.march!.armyInfo as Buffer)!.cachedLoad).toBe(
      123,
    );
    const queries = reads(f, "world_march");
    expect(queries).toHaveLength(1);
    expect(queries[0]!.params).toEqual(["resource-march", 2]);
    expect(queries[0]!.text).not.toMatch(
      /exploreReport|monsterInfo|buildingKillArmy|marchStartTime|maxCollectTime/,
    );
    expect(f.queries.filter((q) => q.text.startsWith("begin"))).toHaveLength(1);
    expect(f.queries.at(-1)!.text).toBe("commit");
  }
});

test("remote occupied resource reads occur only in the destination snapshot after local authorization", async () => {
  const f = resourceFixture(2);
  const result = await f.readResource();
  expect(result.remote).toBe(true);
  expect(result.point!.worldId).toBe(0);
  expect(result.resource!.march!.ownerUid).toBe("remote");
  expect(reads(f, "world_march").map((q) => q.realm)).toEqual([2]);
  const localCommit = f.queries.findIndex((q) => q.realm === 1 && q.text === "commit");
  const marchRead = f.queries.findIndex((q) =>
    q.text.includes('from "opencok_kingdom"."world_march"'),
  );
  expect(localCommit).toBeGreaterThan(0);
  expect(marchRead).toBeGreaterThan(localCommit);
  expect(f.queries.at(-1)).toEqual({ realm: 2, text: "commit", params: [] });
});

test("resource payloads are skipped for other point types, blank owners and blank march pointers", async () => {
  for (const patch of [
    ...[0, 1, 2, 4, 5, 6, 15, 18, 44, 49, 50].map((pointType) => ({ pointType })),
    ...[null, "", "\u2003", "\u001c"].map((ownerId) => ({ ownerId })),
    ...[null, "", "\u2003", "\u001c"].map((ownerMarchUUid) => ({ ownerMarchUUid })),
  ]) {
    const f = resourceFixture();
    Object.assign(f.state.points.get(1)![0]!, patch);
    const result = await f.readResource();
    expect(result.resource).toBeUndefined();
    expect(reads(f, "world_march")).toHaveLength(0);
  }
});

test("missing resource marches and nullable fields remain explicit without fabricated state or ownership repair", async () => {
  const f = resourceFixture();
  f.state.marches.set(1, []);
  expect((await f.readResource()).resource).toEqual({ march: undefined });
  const saved = resourceMarch({
    state: null,
    armyInfo: null,
    collectSpd: null,
    marchArrivalTime: null,
    collectedBeforeSpd: null,
    changeCollectSpdTime: null,
    occupyResourceEndTime: null,
    plunderRes: null,
  });
  f.state.marches.set(1, [saved]);
  expect((await f.readResource()).resource!.march).toEqual(saved);
  expect(f.state.points.get(1)![0]!.ownerId).toBe("target");
  expect(f.state.points.get(1)![0]!.ownerMarchUUid).toBe("resource-march");
  expect(
    f.queries.every(
      (q) => q.text.startsWith("select ") || q.text.startsWith("begin ") || q.text === "commit",
    ),
  ).toBe(true);
});

test("ambiguous or foreign resource marches reject with sanitized dependency failures", async () => {
  for (const rows of [
    [resourceMarch(), resourceMarch()],
    [resourceMarch({ ownerUid: "other" })],
    [resourceMarch({ uuid: "other" })],
  ]) {
    const f = resourceFixture();
    f.state.raw.set(
      "1:world_march",
      rows.map((row) => Object.keys(resourceMarch()).map((key) => row[key])),
    );
    await expect(f.readResource()).rejects.toThrow("world point detail unavailable");
    expect(f.queries.at(-1)!.text).toBe("rollback");
  }
});

test("resource snapshots bound payloads and preserve signed long precision plus database float normalization", async () => {
  for (const patch of [
    { armyInfo: Buffer.alloc(65536) },
    { plunderRes: "a".repeat(2049) },
    { plunderRes: "\0" },
    { collectSpd: Number.MAX_VALUE },
    { targetId: 1.5 },
    { worldId: 2147483648 },
    { state: 2147483648 },
    { marchArrivalTime: 9223372036854775808n },
    { collectedBeforeSpd: -9223372036854775809n },
  ]) {
    const f = resourceFixture();
    Object.assign(f.state.marches.get(1)![0]!, patch);
    await expect(f.readResource()).rejects.toThrow("world point detail unavailable");
    expect(f.queries.at(-1)!.text).toBe("rollback");
  }
  for (const collectSpd of [0, -0, 0.1, NaN, Infinity, -Infinity]) {
    const f = resourceFixture();
    Object.assign(f.state.marches.get(1)![0]!, {
      collectSpd,
      collectedBeforeSpd: 9223372036854775807n,
    });
    const result = (await f.readResource()).resource!.march!;
    expect(result.collectSpd).toBe(Math.fround(collectSpd));
    expect(result.collectedBeforeSpd).toBe(9223372036854775807n);
    expect(result.marchArrivalTime).toBe(9007199254740993n);
  }
  const f = resourceFixture();
  f.state.points.get(1)![0]!.ownerMarchUUid = "a".repeat(41);
  await expect(f.readResource()).rejects.toThrow("world point detail unavailable");
  expect(reads(f, "world_march")).toHaveLength(0);
});

test("resource read and commit failures roll back the active realm without retrying another realm", async () => {
  for (const realm of [1, 2])
    for (const failure of ["world_march", "commit"]) {
      const f = resourceFixture(realm);
      f.state.fail = `${realm}:${failure}`;
      await expect(f.readResource()).rejects.toThrow("world point detail unavailable");
      expect(f.queries.at(-1)).toEqual({ realm, text: "rollback", params: [] });
      expect(reads(f, "world_march")).toHaveLength(1);
      if (realm === 2)
        expect(f.queries.some((q) => q.realm === 1 && q.text === "commit")).toBe(true);
    }
});

test("resource authorization precedes payload reads and readiness probes the required columns without data", async () => {
  for (const patch of [{ banFlag: 1 }, { banTime: BigInt(now + 1) }, { serverId: 2 }]) {
    const f = resourceFixture(2);
    Object.assign(f.state.observer!, patch);
    expect((await f.readResource()).resource).toBeUndefined();
    expect(reads(f, "world_march")).toHaveLength(0);
    expect(f.queries.every((q) => q.realm === 1)).toBe(true);
  }
  const f = resourceFixture();
  await checkWorldPointDetailStore(f.db);
  expect(f.queries).toHaveLength(10);
  const probe = reads(f, "world_march")[0]!;
  expect(probe.params).toEqual([0]);
  for (const column of [
    "armyInfo",
    "collectSpd",
    "collectedBeforeSpd",
    "plunderRes",
    "marchArrivalTime",
    "changeCollectSpdTime",
    "occupyResourceEndTime",
  ])
    expect(probe.text).toContain(`"${column}"`);
});
