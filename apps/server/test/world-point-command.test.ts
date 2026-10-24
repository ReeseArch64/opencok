import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as kingdom from "@opencok/drizzle/schema/kingdom";
import { createWorldPointDetailStore } from "@opencok/repositories/world-point-detail";
import { GameService as Game } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import type { GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import type { WorldPointDetailStore } from "@opencok/contracts/world-point-detail";
import { sfs, Type, encode, decode, encodeArray, type Fields } from "@opencok/messages/sfs";
import { MAX_FRAME } from "@opencok/messages/frame";

import orderVectors from "./fixtures/mail-helper-order-vectors.json";
import barbarianVectors from "./fixtures/world-barbarian-vectors.json";

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
  occupyResourceEndTime: 5000n,
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
    target: {
      uid: "target",
      pic: "g101",
      regTime: 100n,
      serverId: 1,
      level: 5,
      allianceId: "B",
      civilizationType: 0,
      pf: "synthetic",
      decomposesuiteffect: null,
    } as Row | undefined,
    observerPower: 100n as bigint | null,
    targetPower: 9007199254740995n as bigint | null,
    mixed: { uid: "target", lastBeDuelTime: 9007199254740997n } as Row | undefined,
    effects: new Map<string, Row[]>(),
    worldEffects: new Map<string, string>(),
    worldCalls: 0,
    emperorCalls: 0,
    emperor: null as number | null | undefined,
    marches: [sampleMarch()],
    barbarian: undefined as Row | undefined,
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
      expect(text).not.toMatch(/for update|for share|monsterInfo/);
      const table = /from "opencok_kingdom"\."([^"]+)"/.exec(text)![1]!;
      const resource =
        table === "world_march" && (text.includes('"armyInfo"') || text.includes('"collectSpd"'));
      if (!resource) expect(text).not.toMatch(/armyInfo|plunderRes/);
      const report = table === "world_march" && text.includes('"exploreReport"');
      const neutral =
        !resource && table === "world_march" && text.includes('"occupyResourceEndTime"');
      const key = table + (resource ? ":resource" : report ? ":report" : neutral ? ":neutral" : "");
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
        rows = [
          {
            uid: params[0] as string,
            power: params[0] === "observer" ? state.observerPower : state.targetPower,
            armyKill: 3n,
          },
        ];
      else if (table === "user_mixed_info") {
        expect(params).toEqual(["target", 2]);
        expect(text).not.toMatch(/clientRecord|activitypopup|friend|session/);
        rows = state.mixed ? [state.mixed] : [];
      } else if (table === "stat_reg") rows = [{ uid: "target", type: 2, time: 200n }];
      else if (table === "alliance") rows = [{ uid: "A", abbr: "SYN", bannerStyle: "UN" }];
      else if (table === "alliance_member") rows = [{ uid: "target", rank: 4 }];
      else if (table === "world_barbarion") {
        expect(params).toEqual([701, 2]);
        expect(text).not.toMatch(/lastAwardArmyMapByteArray|currentHP|worldId|ownerId/);
        rows = state.barbarian ? [state.barbarian] : [];
      } else if (table === "alliance_territory" && typeof params[0] === "number") {
        rows = [];
      } else if (["t_worldboss", "t_worldbossrank"].includes(table)) {
        rows = [];
      } else if (table === "world_march") {
        if (resource && params.length === 4) {
          rows = state.marches.filter(
            (row) =>
              row.targetId === params[0] && row.worldId === params[1] && row.state === params[2],
          );
        } else if (resource) {
          expect(params).toEqual([state.point!.ownerMarchUUid, 2]);
          expect(text).toContain('"world_march"."uuid" = $1');
          rows = state.marches.filter((row) => row.uuid === params[0]);
        } else if (neutral) {
          expect(params).toEqual([701, 1, 1]);
          expect(text).toContain('"world_march"."targetId" = $1');
          expect(text).toContain('"world_march"."state" = $2');
          expect(text).toContain('order by "opencok_kingdom"."world_march"."uuid" asc limit $3');
          expect(text.slice(text.indexOf(" where "))).not.toMatch(/ownerUid|worldId/);
          expect(text).not.toMatch(/exploreReport|armyInfo|collectSpd|plunderRes/);
          rows = state.marches
            .filter((row) => row.targetId === params[0] && row.state === params[1])
            .sort((a, b) => (String(a.uuid) < String(b.uuid) ? -1 : 1))
            .slice(0, 1);
        } else if (report) {
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
      } else if (
        [
          "user_general",
          "user_science",
          "user_civilization_science",
          "saga_tower_science",
          "foreigen_sciences",
          "user_equip",
          "t_hero",
          "user_pet_dragon",
          "user_pet_dragon_skill",
          "user_state",
          "user_vip",
          "alliance_science",
          "user_civilization_prestige",
          "user_military_rank",
          "user_miracle_buff_active",
          "kingdom_position",
          "activity",
          "alliance_territory",
          "lucky_day",
          "server_info",
          "cross_throne_reward_record",
        ].includes(table)
      ) {
        expect(params[0]).toBe(
          ["alliance_science", "alliance_territory"].includes(table)
            ? "B"
            : table === "activity"
              ? 0
              : table === "server_info"
                ? "server"
                : "target",
        );
        expect(text).toContain(" limit $");
        rows = state.effects.get(table) ?? [];
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
  rules.world.neutralResources = new Map([["monster", { gather_time: "2" }]]);
  rules.world.fieldMonsters = new Map([["monster", { NPC: "1", Gift: "100" }]]);
  const game = new Game({} as GameStore, rules, { kingdomId: 1 }, () => now, {
    worldPointDetail: store,
    worldPowerEffects: async () => {
      state.worldCalls++;
      return state.worldEffects;
    },
    emperorVersion: async () => {
      state.emperorCalls++;
      return state.emperor;
    },
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
  expect((await f.execute()).body.uid).toEqual(sfs.string("target"));
});

test("base point kinds and disabled city extras use public owner fields", async () => {
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

test("specialized points without optional persisted objects return base state and unknown kinds reject", async () => {
  for (const type of [14, 18, 20, 21, 23, 37, 46, 47]) {
    const f = fixture();
    f.state.point = samplePoint({ pointType: type });
    expect((await f.execute()).body.point).toEqual(sfs.int(701));
  }
  for (const type of [-1, 70]) {
    const f = fixture();
    f.state.point = samplePoint({ pointType: type });
    await expect(f.execute()).rejects.toThrow("102192");
  }
  for (const type of [49, 50]) {
    const f = fixture();
    f.state.point = samplePoint({ pointType: type, ownerId: null, ownerName: null });
    expect((await f.execute()).body).toEqual({ point: sfs.int(701) });
  }
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

test("neutral resources select an occupying destination march across owners and worlds in the local ordinary realm", async () => {
  const f = fixture();
  f.state.point = samplePoint({ pointType: 60 });
  f.state.marches = [
    sampleMarch({ uuid: "00", state: 0, occupyResourceEndTime: 99n }),
    sampleMarch({ uuid: "01", targetId: 702, occupyResourceEndTime: 100n }),
    sampleMarch({ uuid: "b", occupyResourceEndTime: 7000n }),
    sampleMarch({
      uuid: "a",
      ownerUid: "another-player",
      worldId: 99,
      occupyResourceEndTime: 6000n,
      exploreReport: Buffer.alloc(65536),
    }),
  ];
  const result = await f.execute({ _cok_: sfs.int(42) });
  expect(result).toEqual({
    body: {
      uid: sfs.string("target"),
      registerTime: sfs.long(200n),
      point: sfs.int(701),
      occupybegintime: sfs.long(4000n),
      _cok_: sfs.int(42),
    },
    pushes: [],
  });
  expect(decode(encode(result.body))).toEqual(result.body);
  expect(reportReads(f)).toHaveLength(0);
  expect(f.queries.filter((q) => q.text.includes('"occupyResourceEndTime"'))).toHaveLength(1);
  expect(f.state.marches[3]!.occupyResourceEndTime).toBe(6000n);
});

test("neutral timing omits the field without a selected march and skips catalogs for blank items", async () => {
  const f = fixture();
  f.state.point = samplePoint({ pointType: 60 });
  f.rules.world.neutralResources!.clear();
  f.state.marches = [];
  expect((await f.execute()).body.occupybegintime).toBeUndefined();
  f.state.marches = [sampleMarch({ state: 2 })];
  expect((await f.execute()).body.occupybegintime).toBeUndefined();
  for (const pointItem of [null, "", "\u180e\u2003"]) {
    f.state.point.pointItem = pointItem;
    f.queries.length = 0;
    f.state.marches = [sampleMarch()];
    expect((await f.execute()).body.occupybegintime).toBeUndefined();
    expect(f.queries.some((q) => q.text.includes('from "opencok_kingdom"."world_march"'))).toBe(
      false,
    );
  }
  f.state.point = samplePoint({ pointType: 60, ownerId: null, ownerName: null });
  f.rules.world.neutralResources!.set("monster", { gather_time: "2" });
  expect((await f.execute()).body).toEqual({
    point: sfs.int(701),
    occupybegintime: sfs.long(3000n),
  });
});

test("neutral timestamps widen signed durations before multiplication and preserve exact long wrapping", async () => {
  const vectors: [bigint | null, string, bigint][] = [
    [5000n, "2", 3000n],
    [null, "2", -2000n],
    [9007199254740993n, "+٣", 9007199254737993n],
    [-9223372036854775808n, "1", 9223372036854774808n],
    [9223372036854775807n, "-1", -9223372036854774809n],
    [0n, "2147483647", -2147483647000n],
    [0n, "-2147483648", 2147483648000n],
    [-5000n, "-2", -3000n],
  ];
  for (const [end, duration, expected] of vectors) {
    const f = fixture();
    f.state.point = samplePoint({ pointType: 60 });
    f.state.marches = [sampleMarch({ occupyResourceEndTime: end })];
    f.rules.world.neutralResources!.set("monster", { gather_time: duration });
    const result = await f.execute();
    expect(result.body.occupybegintime).toEqual(sfs.long(expected));
    expect(decode(encode(result.body))).toEqual(result.body);
  }
});

test("neutral selected-march dependencies reject missing or malformed durations without fabricated times", async () => {
  for (const record of [
    undefined,
    {},
    { gather_time: "" },
    { gather_time: " 2" },
    { gather_time: "2.0" },
    { gather_time: "2147483648" },
    { gather_time: "-2147483649" },
  ]) {
    const f = fixture();
    f.state.point = samplePoint({ pointType: 60 });
    f.rules.world.neutralResources = new Map();
    if (record) f.rules.world.neutralResources.set("monster", record as Record<string, string>);
    await expect(f.execute()).rejects.toThrow("102192");
  }
  const f = fixture();
  f.state.point = samplePoint({ pointType: 60, pointItem: "null" });
  await expect(f.execute()).rejects.toThrow("102192");
  f.rules.world.neutralResources!.set("null", { gather_time: "0" });
  expect((await f.execute()).body.occupybegintime).toEqual(sfs.long(5000n));
});

test("neutral lookup failures and inconsistent selected rows fail visibly in the read-only snapshot", async () => {
  for (const rows of [
    [sampleMarch({ targetId: 702 })],
    [sampleMarch({ state: 2 })],
    [sampleMarch({ uuid: "" })],
    [sampleMarch({ worldId: 1.5 })],
    [sampleMarch(), sampleMarch()],
  ]) {
    const f = fixture();
    f.state.point = samplePoint({ pointType: 60 });
    f.state.overrides.set("world_march:neutral", rows);
    await expect(f.execute()).rejects.toThrow("world point detail unavailable");
    expect(f.queries.at(-1)!.text).toBe("rollback");
  }
  const f = fixture();
  f.state.point = samplePoint({ pointType: 60 });
  f.state.fail = "world_march:neutral";
  await expect(f.execute()).rejects.toThrow("world point detail unavailable");
  f.state.fail = "";
  f.state.marches[0]!.occupyResourceEndTime = 9223372036854775808n;
  await expect(f.execute()).rejects.toThrow("102192");
  f.state.marches[0]!.occupyResourceEndTime = 5000n;
  const snapshot = await f.store.read("observer", { point: 701, kingdomId: 1, now });
  const missing: WorldPointDetailStore = {
    read: async () => ({ ...snapshot, neutralResource: undefined }),
  };
  const game = new Game({} as GameStore, f.rules, { kingdomId: 1 }, () => now, {
    worldPointDetail: missing,
  });
  await expect(
    game.execute("observer", "world.get.detail", { point: sfs.int(701) }),
  ).rejects.toThrow("102192");
  f.state.observer!.banFlag = 1;
  f.queries.length = 0;
  await expect(f.execute()).rejects.toThrow("E000000");
  expect(f.queries.some((q) => q.text.includes('"occupyResourceEndTime"'))).toBe(false);
});

test("enabled city details compose target effects, persisted powers and exact duel time in one read-only snapshot", async () => {
  const f = fixture();
  f.state.point = samplePoint({ pointType: 1 });
  f.rules.items.set("lost_battle", { k3: "1", k4: "2" });
  f.rules.items.set("effect", { k1: "37;-2" });
  f.state.worldEffects.set("37", '{"value":"3"}');
  const result = await f.execute({
    _cok_: sfs.int(37),
    slowDown: sfs.bool(false),
    targetPower: sfs.long(1n),
  });
  expect(result.body.slowDown).toEqual(sfs.bool(true));
  expect(result.body.targetTooStrong).toEqual(sfs.bool(true));
  expect(result.body.targetPower).toEqual(sfs.long(9007199254740995n));
  expect(result.body.lastBeDuelTime).toEqual(sfs.long(9007199254740997n));
  expect(result.body.power).toEqual(result.body.targetPower);
  expect(result.body._cok_).toEqual(sfs.int(37));
  expect(decode(encode(result.body))).toEqual(result.body);
  expect(result.pushes).toEqual([]);
  expect(f.state.worldCalls).toBe(1);
  expect(f.state.emperorCalls).toBe(0);
  expect(f.queries.filter((q) => q.text.startsWith("begin"))).toHaveLength(1);
  expect(f.queries.at(-1)!.text).toBe("commit");
  expect(
    f.queries.some((q) =>
      /user_army|user_building|user_wall|user_item|pic_upload_record|user_knight_title/.test(
        q.text,
      ),
    ),
  ).toBe(false);
  const sciences = f.queries.find((q) => q.text.includes('from "opencok_kingdom"."user_science"'))!;
  expect(sciences.params).toEqual(["target", 4097]);
  const alliance = f.queries.find((q) =>
    q.text.includes('from "opencok_kingdom"."alliance_science"'),
  )!;
  expect(alliance.params).toEqual(["B", 4097]);
  expect(f.state.observerPower).toBe(100n);
  expect(f.state.targetPower).toBe(9007199254740995n);
});

test("city extras obey exact feature flag and city type and do not read unused dependencies", async () => {
  for (const [type, flag, target] of [
    [1, undefined, true],
    [1, "0", true],
    [1, "01", true],
    [1, " 1", true],
    [2, "1", true],
    [1, "1", false],
  ] as const) {
    const f = fixture();
    f.state.point = samplePoint({ pointType: type });
    f.rules.items.set("lost_battle", { k3: flag! });
    if (!target) f.state.target = undefined;
    const result = await f.execute();
    expect(result.body.slowDown).toBeUndefined();
    expect(result.body.targetPower).toBeUndefined();
    expect(result.body.lastBeDuelTime).toBeUndefined();
    expect(f.state.worldCalls).toBe(0);
    expect(f.state.emperorCalls).toBe(0);
    expect(f.queries.some((q) => /user_mixed_info|user_science|user_state/.test(q.text))).toBe(
      false,
    );
  }
});

test("city target strength preserves wrapped long multiplication, nullable primitives and float sign", async () => {
  const cases: [bigint | null, bigint | null, string, string, boolean, boolean][] = [
    [100n, 200n, "2", "0", false, false],
    [100n, 201n, "+٢", "0.000001", true, true],
    [9223372036854775807n, 0n, "2", "-1", true, false],
    [-9223372036854775808n, 1n, "-1", "-0.0", true, false],
    [9007199254740993n, 9007199254740994n, "1", "0", true, false],
    [null, null, "1", "0", false, false],
  ];
  for (const [observer, target, factor, effect, strong, slow] of cases) {
    const f = fixture();
    f.state.point = samplePoint({ pointType: 1 });
    f.state.observerPower = observer;
    f.state.targetPower = target;
    f.state.mixed!.lastBeDuelTime = null;
    f.rules.items.set("lost_battle", { k3: "1", k4: factor });
    f.state.worldEffects.set("37", JSON.stringify({ value: effect }));
    const result = await f.execute();
    expect(result.body.targetTooStrong).toEqual(sfs.bool(strong));
    expect(result.body.slowDown).toEqual(sfs.bool(slow));
    expect(result.body.targetPower).toEqual(sfs.long(target ?? 0n));
    expect(result.body.lastBeDuelTime).toEqual(sfs.long(0n));
  }
});

test("city effects respect status expiry, target catalogs and personal throne dependency", async () => {
  const f = fixture();
  f.state.point = samplePoint({ pointType: 1 });
  f.rules.items.set("lost_battle", { k3: "1", k4: "1" });
  f.state.effects.set("user_state", [{ stateId: 5000, endTime: BigInt(now) }]);
  expect((await f.execute()).body.slowDown).toEqual(sfs.bool(false));
  f.state.effects.get("user_state")![0]!.endTime = BigInt(now + 1);
  await expect(f.execute()).rejects.toThrow("102192");
  f.rules.power.statuses = new Map([["5000", { effect: "37;1" }]]);
  expect((await f.execute()).body.slowDown).toEqual(sfs.bool(true));
  f.state.effects.set("user_state", []);
  f.state.effects.set("cross_throne_reward_record", [{ version: 7, reward_id: 1001 }]);
  f.state.emperor = undefined;
  await expect(f.execute()).rejects.toThrow("102192");
  f.state.emperor = null;
  expect((await f.execute()).body.slowDown).toEqual(sfs.bool(false));
  f.state.emperor = 7;
  f.rules.power.monarchTitles = new Map([["1001", { effect: "37", num: "1" }]]);
  expect((await f.execute()).body.slowDown).toEqual(sfs.bool(true));
  expect(f.state.emperorCalls).toBe(3);
});

test("city dependencies fail visibly on missing state, foreign rows, oversized effects and read failures", async () => {
  for (const [key, rows] of [
    ["playerinfo", []],
    ["user_mixed_info", []],
    ["user_mixed_info", [{ uid: "foreign", lastBeDuelTime: 1n }]],
    ["user_mixed_info", [{ uid: "target" }, { uid: "target" }]],
    ["user_science", Array.from({ length: 4097 }, () => ({ itemId: 1, level: 0 }))],
  ] as [string, Row[]][]) {
    const f = fixture();
    f.state.point = samplePoint({ pointType: 1 });
    f.rules.items.set("lost_battle", { k3: "1", k4: "1" });
    f.state.overrides.set(key, rows);
    await expect(f.execute()).rejects.toThrow("world point detail unavailable");
    expect(f.queries.at(-1)!.text).toBe("rollback");
    expect(f.state.worldCalls).toBe(0);
  }
  const f = fixture();
  f.state.point = samplePoint({ pointType: 1 });
  f.rules.items.set("lost_battle", { k3: "1", k4: "1" });
  f.state.fail = "user_state";
  await expect(f.execute()).rejects.toThrow("world point detail unavailable");
  expect(f.queries.at(-1)!.text).toBe("rollback");
  f.state.fail = "";
  f.state.target!.serverId = 2;
  await expect(f.execute()).rejects.toThrow("world point detail unavailable");
  f.state.target!.serverId = 1;
  f.game.services.worldPowerEffects = undefined;
  await expect(f.execute()).rejects.toThrow("102192");
  f.game.services.worldPowerEffects = async () => {
    throw new Error("Synthetic cache failure");
  };
  await expect(f.execute()).rejects.toThrow("Synthetic cache failure");
  f.state.observer!.banFlag = 1;
  f.queries.length = 0;
  await expect(f.execute()).rejects.toThrow("E000000");
  expect(f.queries.some((q) => q.text.includes('"user_mixed_info"'))).toBe(false);
});

function barbarianFixture() {
  const f = fixture();
  f.state.point = samplePoint({ pointType: 44, pointItem: "unused-point-config" });
  f.state.barbarian = {
    pointId: 701,
    configId: "camp",
    lastBeAttackedTime: BigInt(now),
    lastArmyMapByteArray: Buffer.from(barbarianVectors.maps[1]!.data, "base64"),
  };
  f.rules.world.barbarians = new Map([["camp", { para3: "1", army: "formation" }]]);
  f.rules.world.armies = new Map([["formation", { arm: "a;100|b;100" }]]);
  f.rules.arms.set("a", { power: "1.5" });
  f.rules.arms.set("b", { power: "2.25" });
  return f;
}

test("barbarian point command reads saved troop state and returns public power without combat or reward reads", async () => {
  const f = barbarianFixture();
  const before = structuredClone(f.state.barbarian);
  const result = await f.execute({ _cok_: sfs.int(44), barbarionPower: sfs.long(999999n) });
  expect(result.body).toEqual({
    uid: sfs.string("target"),
    registerTime: sfs.long(200n),
    point: sfs.int(701),
    barbarionPower: sfs.long(157n),
    _cok_: sfs.int(44),
  });
  expect(result.pushes).toEqual([]);
  expect(decode(encode(result.body))).toEqual(result.body);
  expect(f.state.barbarian).toEqual(before);
  expect(
    f.queries.filter((q) => q.text.includes('from "opencok_kingdom"."world_barbarion"')),
  ).toHaveLength(1);
  expect(
    f.queries.some((q) => /world_march|lastAwardArmyMapByteArray|currentHP/.test(q.text)),
  ).toBe(false);
  expect(f.queries.filter((q) => q.text.startsWith("begin"))).toHaveLength(1);
  expect(f.queries.at(-1)!.text).toBe("commit");
  expect(f.state.worldCalls).toBe(0);
});

test("barbarian regeneration samples server time at projection and respects full recovery and future attacks", async () => {
  const f = barbarianFixture();
  let clocks = 0;
  const game = new Game({} as GameStore, f.rules, { kingdomId: 1 }, () => now + clocks++ * 1000, {
    worldPointDetail: f.store,
  });
  expect(
    (await game.execute("observer", "world.get.detail", { point: sfs.int(701) })).body
      .barbarionPower,
  ).toEqual(sfs.long(161n));
  expect(clocks).toBe(2);
  f.state.barbarian!.lastBeAttackedTime = BigInt(now - 100000);
  expect((await f.execute()).body.barbarionPower).toEqual(sfs.long(375n));
  f.state.barbarian!.lastBeAttackedTime = BigInt(now + 1000);
  expect((await f.execute()).body.barbarionPower).toEqual(sfs.long(153n));
});

test("missing barbarian state returns zero and empty formations do not deserialize unused troop payloads", async () => {
  const f = barbarianFixture();
  f.state.barbarian = undefined;
  f.rules.world.barbarians!.clear();
  expect((await f.execute()).body.barbarionPower).toEqual(sfs.long(0n));
  const empty = barbarianFixture();
  empty.rules.world.armies!.get("formation")!.arm = "";
  empty.state.barbarian!.lastArmyMapByteArray = Buffer.from("invalid-unused");
  expect((await empty.execute()).body.barbarionPower).toEqual(sfs.long(0n));
  empty.state.barbarian!.lastArmyMapByteArray = null;
  expect((await empty.execute()).body.barbarionPower).toEqual(sfs.long(0n));
  empty.state.point!.pointType = 7;
  empty.queries.length = 0;
  expect((await empty.execute()).body.barbarionPower).toBeUndefined();
  expect(empty.queries.some((q) => q.text.includes('"world_barbarion"'))).toBe(false);
});

test("barbarian dependencies reject corrupt maps, missing catalogs and inconsistent read snapshots", async () => {
  for (const data of [
    null,
    Buffer.alloc(0),
    Buffer.from("{}"),
    Buffer.from(barbarianVectors.nullMap, "base64"),
  ]) {
    const f = barbarianFixture();
    f.state.barbarian!.lastArmyMapByteArray = data;
    await expect(f.execute()).rejects.toThrow("102192");
  }
  for (const patch of [
    { pointId: 702 },
    { configId: "\0" },
    { lastArmyMapByteArray: Buffer.alloc(65536) },
  ]) {
    const f = barbarianFixture();
    Object.assign(f.state.barbarian!, patch);
    await expect(f.execute()).rejects.toThrow("world point detail unavailable");
    expect(f.queries.at(-1)!.text).toBe("rollback");
  }
  const f = barbarianFixture();
  f.state.overrides.set("world_barbarion", [f.state.barbarian!, f.state.barbarian!]);
  await expect(f.execute()).rejects.toThrow("world point detail unavailable");
  f.state.overrides.clear();
  f.state.fail = "world_barbarion";
  await expect(f.execute()).rejects.toThrow("world point detail unavailable");
  f.state.fail = "";
  f.rules.world.barbarians!.clear();
  await expect(f.execute()).rejects.toThrow("102192");
  f.state.observer!.banFlag = 1;
  f.queries.length = 0;
  await expect(f.execute()).rejects.toThrow("E000000");
  expect(f.queries.some((q) => q.text.includes('"world_barbarion"'))).toBe(false);
});
