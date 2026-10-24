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
          expect(text).not.toMatch(
            /for update|for share|password|email|referrer|"ip"|armyInfo|monsterInfo/,
          );
          const table = /from "opencok_kingdom"\."([^"]+)"/.exec(text)?.[1];
          expect(table).toBeDefined();
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
  expect(f.queries).toHaveLength(8);
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
