import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as kingdom from "@opencok/drizzle/schema/kingdom";
import { createWorldPointDetailStore } from "@opencok/repositories/world-point-detail";
import { Game } from "@opencok/controllers/game";
import { Rules } from "@opencok/rules/game";
import type { GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import type { WorldPointDetailStore } from "@opencok/contracts/world-point-detail";
import { sfs, Type, encode, decode, encodeArray, type Fields } from "@opencok/messages/sfs";
import { MAX_FRAME } from "@opencok/messages/frame";

import orderVectors from "./fixtures/mail-helper-order-vectors.json";

const now = 1792756800123;
const samplePoint = (patch: Row = {}): Row => ({
  id: 701,
  worldId: 9,
  pointType: 6,
  pointItem: "monster",
  ownerId: "target",
  ownerName: "Owner",
  allianceId: "A",
  ownerMarchUUid: null,
  resInitValue: 100,
  resCostValue: 2,
  monsterCurrHP: 8,
  territoryAlliance: "A",
  active: 1,
  reserve: 0n,
  ...patch,
});
const sampleMarch = (patch: Row = {}): Row => ({
  uuid: "m",
  ownerUid: "observer",
  targetId: 701,
  worldId: 9,
  state: 1,
  marchStartTime: 9007199254740993n,
  arrivalTime: 9223372036854775807n,
  exploreTime: 1n,
  exploreReport: encodeArray([sfs.object({ id: sfs.int(7), time: sfs.long(9007199254740993n) })]),
  ...patch,
});
function fixture() {
  const queries: { text: string; params: unknown[] }[] = [];
  const state = {
    observer: {
      uid: "observer",
      serverId: 1,
      banTime: 0n,
      banFlag: 0,
      allianceId: "A",
      appVersion: "12.06.0",
    } as Row | undefined,
    world: { uid: "observer", worldId: 9 } as Row | undefined,
    point: samplePoint() as Row | undefined,
    target: { uid: "target", pic: "g101", regTime: 100n } as Row | undefined,
    marches: [sampleMarch()],
    overrides: new Map<string, Row[]>(),
    fail: "",
  };
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      const text = query.text;
      queries.push({ text, params });
      if (text === state.fail) throw new Error("Synthetic private failure");
      if (text.startsWith("begin")) {
        expect(text).toBe("begin isolation level repeatable read read only");
        return { rows: [] };
      }
      if (text === "commit" || text === "rollback") return { rows: [] };
      expect(text).toStartWith("select ");
      expect(text).not.toMatch(/for update|for share|armyInfo|plunderRes|monsterInfo/);
      const table = /from "opencok_kingdom"\."([^"]+)"/.exec(text)![1]!;
      const report = table === "world_march" && text.includes('"exploreReport"');
      const key = table + (report ? ":report" : "");
      if (key === state.fail) throw new Error("Synthetic private failure");
      let rows: Row[] = [];
      if (table === "userprofile")
        rows = [params[0] === "observer" ? state.observer : state.target].filter(Boolean) as Row[];
      else if (table === "user_world") rows = state.world ? [state.world] : [];
      else if (table === "worldpoint")
        rows =
          state.point && state.point.id === params[0] && state.point.worldId === params[1]
            ? [state.point]
            : [];
      else if (table === "playerinfo")
        rows = [{ uid: "target", power: 9007199254740995n, armyKill: 3n }];
      else if (table === "stat_reg") rows = [{ uid: "target", type: 2, time: 200n }];
      else if (table === "alliance") rows = [{ uid: "A", abbr: "SYN" }];
      else if (table === "alliance_member") rows = [{ uid: "target", rank: 4 }];
      else if (table === "world_march") {
        if (report) {
          expect(text).toContain('"world_march"."uuid" = $1');
          expect(text).toContain('"world_march"."ownerUid" = $2');
          expect(params.slice(1)).toEqual(["observer", 2]);
          rows = state.marches.filter(
            (row) => row.uuid === params[0] && row.ownerUid === params[1],
          );
        } else {
          expect(params).toEqual(["observer", 4097]);
          expect(text).toContain('order by "opencok_kingdom"."world_march"."uuid" asc limit $2');
          expect(text.slice(text.indexOf(" where "))).not.toMatch(/targetId|worldId|state/);
          rows = state.marches
            .filter((row) => row.ownerUid === "observer")
            .sort((a, b) => (String(a.uuid) < String(b.uuid) ? -1 : 1))
            .slice(0, 4097);
        }
      } else throw new Error("Unexpected synthetic query");
      rows = state.overrides.get(key) ?? rows;
      const columns = text
        .slice(7, text.indexOf(" from "))
        .split(", ")
        .map((column) => [...column.matchAll(/"([^"]+)"/g)].at(-1)![1]!);
      return { rows: rows.map((row) => columns.map((column) => row[column] ?? null)) };
    },
  };
  const db = drizzle(client as unknown as NodePgClient, { schema: kingdom });
  const databases = {
    kingdoms: new Map([[1, { db }]]),
    getKingdom: (id: number) => {
      if (id !== 1) throw new Error("Unconfigured realm");
      return { db };
    },
  } as unknown as Parameters<typeof createWorldPointDetailStore>[0];
  const store = createWorldPointDetailStore(databases, 1);
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.world.fieldMonsters = new Map([["monster", { NPC: "1", Gift: "100" }]]);
  const game = new Game({} as GameStore, rules, { kingdomId: 1 }, () => now, {
    worldPointDetail: store,
  });
  return {
    state,
    queries,
    store,
    rules,
    game,
    execute: (params: Fields = {}) =>
      game.execute("observer", "world.get.detail", { point: sfs.int(701), ...params }),
  };
}
const reportReads = (f: ReturnType<typeof fixture>) =>
  f.queries.filter((q) => q.text.startsWith("select") && q.text.includes('"exploreReport"'));

test("world.get.detail composes owned exploration metadata and one selected binary report without mutations", async () => {
  const f = fixture();
  const result = await f.execute({ _cok_: sfs.int(4), cmdBaseTime: sfs.long(99n) });
  expect(result).toEqual({
    body: {
      uid: sfs.string("target"),
      point: sfs.int(701),
      erp: sfs.array([sfs.object({ id: sfs.int(7), time: sfs.long(9007199254740993n) })]),
      st: sfs.long(9007199254740993n),
      et: sfs.long(-9223372036854775808n),
      _cok_: sfs.int(4),
      cmdBaseTime: sfs.long(99n),
    },
    pushes: [],
  });
  expect(decode(encode(result.body))).toEqual(result.body);
  expect(reportReads(f)).toHaveLength(1);
  expect(f.queries[0]!.text).toStartWith("begin");
  expect(f.queries.at(-1)!.text).toBe("commit");
  expect(f.state.marches[0]!.state).toBe(1);
});

test("restored map traversal checks first destination state instead of preferring an occupying march", async () => {
  const f = fixture();
  f.state.marches = [sampleMarch({ uuid: "a", state: 1 }), sampleMarch({ uuid: "p", state: 2 })];
  expect((await f.execute()).body).toEqual({ uid: sfs.string("target"), point: sfs.int(701) });
  expect(reportReads(f)).toHaveLength(0);
  f.state.marches[1]!.state = 1;
  expect((await f.execute()).body.erp).toBeDefined();
  expect(reportReads(f)[0]!.params[0]).toBe("p");
});

test("all owner march metadata influences restored traversal, while only selected report bytes are read", async () => {
  const f = fixture();
  f.state.marches = [
    sampleMarch({ uuid: "other", targetId: 702, exploreReport: Buffer.alloc(65535) }),
    sampleMarch({ uuid: "m", worldId: 999, exploreReport: null }),
  ];
  expect((await f.execute()).body.erp).toEqual(sfs.array([]));
  expect(reportReads(f)).toHaveLength(1);
  expect(reportReads(f)[0]!.params[0]).toBe("m");
  f.state.marches = [];
  f.queries.length = 0;
  expect((await f.execute()).body).toEqual({ uid: sfs.string("target"), point: sfs.int(701) });
  expect(reportReads(f)).toHaveLength(0);
});

test("local boss details return health before owner fields and do not read marches", async () => {
  const f = fixture();
  f.state.point = samplePoint({ pointType: 15 });
  expect((await f.execute()).body).toEqual({
    mchp: sfs.int(8),
    mmhp: sfs.int(100),
    point: sfs.int(701),
  });
  expect(f.queries.some((q) => q.text.includes('from "opencok_kingdom"."world_march"'))).toBe(
    false,
  );
  f.rules.world.fieldMonsters!.clear();
  await expect(f.execute()).rejects.toThrow();
});

test("unoccupied resources preserve remaining quantity wrapping, member count and early-return fields", async () => {
  for (const pointType of [3, 37]) {
    const f = fixture();
    f.state.point = samplePoint({
      pointType,
      ownerId: null,
      ownerName: "\u2003",
      resInitValue: -2147483648,
      resCostValue: 1,
    });
    expect((await f.execute()).body).toEqual({
      point: sfs.int(701),
      tq: sfs.int(2147483647),
      ...(pointType === 37 ? { existMember: sfs.int(8) } : {}),
    });
    expect(reportReads(f)).toHaveLength(0);
  }
});

test("ordinary occupied resources without owner march retain owner and positive territory effect fields", async () => {
  const f = fixture();
  f.state.point = samplePoint({ pointType: 3 });
  expect((await f.execute()).body).toEqual({
    uid: sfs.string("target"),
    registerTime: sfs.long(200n),
    pic: sfs.string("g101"),
    afn: sfs.string("SYN"),
    rank: sfs.int(4),
    vl: sfs.int(0),
    point: sfs.int(701),
    territory_positive_effect: sfs.int(1),
  });
  f.state.point.territoryAlliance = "other";
  expect((await f.execute()).body.territory_positive_effect).toBeUndefined();
  f.state.point.ownerMarchUUid = "existing";
  await expect(f.execute()).rejects.toThrow("102192");
});

test("base-only point kinds and city branches use public owner fields without fabricating pending additions", async () => {
  for (const type of [0, 1, 2, 4, 5, 7, 9, 10, 16, 19, 24, 38, 49, 50, 66, 69]) {
    const f = fixture();
    f.state.point = samplePoint({ pointType: type });
    const body = (await f.execute()).body;
    expect(body.point).toEqual(sfs.int(701));
    expect(body.uid).toEqual(sfs.string("target"));
    expect(body.registerTime).toEqual(sfs.long(200n));
    expect(body.power).toEqual([1, 2].includes(type) ? sfs.long(9007199254740995n) : undefined);
  }
  const f = fixture();
  f.state.point = samplePoint({ pointType: 1 });
  f.rules.items.set("lost_battle", { k3: "1" });
  await expect(f.execute()).rejects.toThrow("102192");
  f.state.target = undefined;
  expect((await f.execute()).body.targetPower).toBeUndefined();
});

test("unfinished territory, boss, occupied new-resource, neutral and barbarian paths reject explicitly", async () => {
  for (const type of [14, 18, 20, 21, 23, 37, 44, 46, 47, 60, -1, 70]) {
    const f = fixture();
    f.state.point = samplePoint({ pointType: type });
    await expect(f.execute()).rejects.toThrow("102192");
  }
  for (const type of [49, 50]) {
    const f = fixture();
    f.state.point = samplePoint({ pointType: type, ownerId: null, ownerName: null });
    await expect(f.execute()).rejects.toThrow("102192");
  }
  const f = fixture();
  f.state.point = samplePoint({ pointType: 60, pointItem: null });
  expect((await f.execute()).body.point).toEqual(sfs.int(701));
});

test("nonpositive points preserve empty responses and correlation; missing points are errors", async () => {
  for (const point of [0, -1, -2147483648]) {
    const f = fixture();
    expect((await f.execute({ point: sfs.int(point) })).body).toEqual({});
    expect(f.queries.length).toBe(3);
    expect((await f.execute({ point: sfs.int(point), _cok_: sfs.int(5) })).body).toEqual({
      _cok_: sfs.int(5),
    });
  }
  const f = fixture();
  f.state.point = undefined;
  await expect(f.execute()).rejects.toThrow("E100169");
});

test("command validates integer parameters, local realm routing and observer state before target access", async () => {
  const invalidParams: Fields[] = [
    { point: sfs.string("701") },
    { point: sfs.int(1.5) },
    { serverId: sfs.string("1") },
    { serverId: sfs.int(0) },
    { serverId: sfs.int(2) },
  ];
  for (const params of invalidParams) {
    const f = fixture();
    await expect(f.execute(params)).rejects.toThrow();
    expect(f.queries).toHaveLength(0);
  }
  const f = fixture();
  await expect(f.game.execute("observer", "world.get.detail", {})).rejects.toThrow("E000000");
  for (const serverId of [-1, 1])
    expect((await f.execute({ serverId: sfs.int(serverId) })).body.point).toEqual(sfs.int(701));
  for (const patch of [{ serverId: 2 }, { banFlag: 1 }, { banTime: BigInt(now + 1) }] as Row[]) {
    const f = fixture();
    Object.assign(f.state.observer!, patch);
    await expect(f.execute()).rejects.toThrow("E000000");
    expect(f.queries.length).toBe(3);
  }
  f.state.observer = undefined;
  await expect(f.execute()).rejects.toThrow("E100169");
});

test("march metadata and report failures are bounded, owned and never converted to empty success", async () => {
  for (const key of ["world_march", "world_march:report", "commit"]) {
    const f = fixture();
    f.state.fail = key;
    await expect(f.execute()).rejects.toThrow("world point detail unavailable");
    expect(f.queries.at(-1)!.text).toBe("rollback");
  }
  for (const rows of [
    [sampleMarch({ ownerUid: "other" })],
    [sampleMarch(), sampleMarch()],
    Array.from({ length: 4097 }, (_, i) => sampleMarch({ uuid: String(i) })),
  ]) {
    const f = fixture();
    f.state.overrides.set("world_march", rows);
    await expect(f.execute()).rejects.toThrow("world point detail unavailable");
    expect(reportReads(f)).toHaveLength(0);
  }
  for (const rows of [
    [],
    [sampleMarch({ ownerUid: "other" })],
    [sampleMarch({ exploreReport: Buffer.alloc(65536) })],
  ]) {
    const f = fixture();
    f.state.overrides.set("world_march:report", rows);
    await expect(f.execute()).rejects.toThrow("world point detail unavailable");
  }
  const f = fixture();
  f.state.marches[0]!.exploreReport = Buffer.from("110001", "hex");
  await expect(f.execute()).rejects.toThrow("Invalid or unsupported SFS packet");
});

test("repository validates selector results and runtime checks full correlated frame size", async () => {
  const f = fixture();
  await expect(
    f.store.read("observer", { point: 701, kingdomId: 1, now }, () => "foreign"),
  ).rejects.toThrow("world point detail unavailable");
  await expect(
    f.execute({ _cok_: { type: Type.Bytes, value: Buffer.alloc(MAX_FRAME) } }),
  ).rejects.toThrow("102192");
  const original = await f.store.read("observer", { point: 701, kingdomId: 1, now }, () => "m");
  const bad: WorldPointDetailStore = {
    read: async () => ({ ...original, exploration: undefined }),
  };
  const game = new Game({} as GameStore, f.rules, { kingdomId: 1 }, () => now, {
    worldPointDetail: bad,
  });
  await expect(
    game.execute("observer", "world.get.detail", { point: sfs.int(701) }),
  ).rejects.toThrow("102192");
});

test("fresh owner-map restoration matches existing Java 8 collision traversal oracle cases", async () => {
  const vectors = orderVectors.filter(
    (vector) =>
      JSON.stringify(vector.keys) === JSON.stringify([...vector.keys].sort()) &&
      vector.keys.length > 0,
  );
  expect(vectors).toHaveLength(10);
  for (const { keys, order } of vectors) {
    for (const position of new Set([0, Math.floor(keys.length / 2), keys.length - 1])) {
      const f = fixture();
      const eligible = new Set(order.slice(position).map((index) => keys[index]!));
      f.state.marches = [...keys]
        .reverse()
        .map((uuid) => sampleMarch({ uuid, targetId: eligible.has(uuid) ? 701 : 702 }));
      await f.execute();
      expect(reportReads(f)).toHaveLength(1);
      expect(reportReads(f)[0]!.params[0]).toBe(keys[order[position]!]!);
    }
  }
});
