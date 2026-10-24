import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as kingdom from "@opencok/drizzle/schema/kingdom";
import { createWorldSearchStore, checkWorldSearchStore } from "@opencok/repositories/world-search";
import { worldSearchOffset, worldSearchName } from "@opencok/rules/world-search";
import { worldSearch } from "@opencok/dtos/world-search";
import { Game } from "@opencok/controllers/game";
import { Rules } from "@opencok/rules/game";
import type { GameStore, GameServices } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { Type, sfs, fields, encode, decode, extension, type Fields } from "@opencok/messages/sfs";

const now = 1792756800123;
interface Entry {
  uid: string;
  name: string;
  banTime: bigint | null;
  pic?: string | null;
  picVer?: number | null;
  power?: bigint | null;
  abbr?: string | null;
}
const sample = (uid: string, name = "Player " + uid): Entry => ({
  uid,
  name,
  banTime: 0n,
  pic: "g101",
  picVer: 2,
  power: 9007199254740993n,
  abbr: "SYN",
});
function matches(name: string, pattern: string): boolean {
  let expression = "^";
  const chars = Array.from(pattern);
  for (let i = 0; i < chars.length; i++) {
    let char = chars[i]!;
    if (char === "\\") {
      char = chars[++i]!;
      if (char === undefined) throw new Error("Invalid synthetic pattern");
    } else if (char === "%") {
      expression += "[\\s\\S]*";
      continue;
    } else if (char === "_") {
      expression += "[\\s\\S]";
      continue;
    }
    expression += "\\u{" + char.codePointAt(0)!.toString(16) + "}";
  }
  return new RegExp(expression + "$", "iu").test(name);
}
function fixture() {
  const queries: { realm: number; text: string; params: unknown[] }[] = [];
  const state = {
    profile: ["self", 1, 0n, 0] as unknown[] | null,
    local: [] as Entry[],
    remote: [] as Entry[],
    fail: "",
    raw: undefined as unknown[][] | undefined,
    onProfile: undefined as (() => void) | undefined,
  };
  const databases = new Map(
    [1, 2].map((realm) => {
      const client = {
        query: async (query: { text: string }, params: unknown[] = []) => {
          const text = query.text;
          queries.push({ realm, text, params });
          if (text.startsWith("begin")) {
            expect(text).toBe("begin isolation level repeatable read read only");
            if (state.fail === "begin") throw new Error("Synthetic begin failure");
            return { rows: [] };
          }
          if (text === "rollback") return { rows: [] };
          if (text === "commit") {
            if (state.fail === "commit") throw new Error("Synthetic commit failure");
            return { rows: [] };
          }
          expect(text).toStartWith("select ");
          if (params.length === 1 && params[0] === 0) return { rows: [] };
          if (!text.includes("left join")) {
            expect(realm).toBe(1);
            expect(params).toEqual(["self", 1]);
            expect(text).not.toContain("for update");
            expect(text).not.toContain("for share");
            if (state.fail === "profile") throw new Error("Synthetic profile failure");
            state.onProfile?.();
            return { rows: state.profile ? [state.profile] : [] };
          }
          if (state.fail === "search" || (state.fail === "remote" && realm === 2))
            throw new Error("Synthetic private database failure");
          expect(text).toContain('left join "opencok_kingdom"."playerinfo"');
          expect(text).toContain('left join "opencok_kingdom"."alliance"');
          expect(text).toContain('"playerinfo"."uid" = "opencok_kingdom"."userprofile"."uid"');
          expect(text).toContain('"alliance"."uid" = "opencok_kingdom"."userprofile"."allianceId"');
          expect(text).toContain('"userprofile"."banTime" <> $1');
          expect(text).toContain('"userprofile"."banTime" <> $2');
          expect(text).toContain('"userprofile"."name" ilike $3');
          expect(text).toContain('order by "opencok_kingdom"."userprofile"."uid" asc limit $4');
          expect(text).not.toContain('"banFlag"');
          expect(text).not.toContain('"serverId"');
          expect(params.slice(0, 2)).toEqual([9223372036854775807n, 9223372036854775806n]);
          expect(params[3]).toBe(8);
          if (params.length === 5) expect(text).toEndWith("offset $5");
          if (state.raw) return { rows: state.raw };
          const offset = Number(params[4] ?? 0);
          const rows = (realm === 1 ? state.local : state.remote)
            .filter(
              (entry) =>
                entry.banTime !== null &&
                entry.banTime !== 9223372036854775807n &&
                entry.banTime !== 9223372036854775806n,
            )
            .filter((entry) => matches(entry.name, String(params[2])))
            .sort((a, b) => (a.uid < b.uid ? -1 : a.uid > b.uid ? 1 : 0))
            .slice(offset, offset + 8)
            .map((entry) => [
              entry.uid,
              entry.name,
              entry.pic ?? null,
              entry.picVer ?? null,
              entry.power ?? null,
              entry.abbr ?? "",
            ]);
          return { rows };
        },
      };
      return [
        realm,
        { db: drizzle(client as unknown as NodePgClient, { schema: kingdom }) },
      ] as const;
    }),
  );
  type Databases = Parameters<typeof createWorldSearchStore>[0];
  const topology = {
    kingdoms: databases,
    getKingdom: (id: number) => {
      const database = databases.get(id);
      if (!database) throw new Error("Synthetic unconfigured realm");
      return database;
    },
  } as unknown as Databases;
  const store = createWorldSearchStore(topology, 1);
  const game = new Game(
    {} as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => now,
    { worldSearch: store },
  );
  return {
    state,
    queries,
    topology,
    store,
    game,
    db: databases.get(1)!.db,
    search: (params: Fields = {}) => game.execute("self", "world.search.user", params),
  };
}
function resultRows(body: Fields): Fields[] {
  return (body.list!.value as ReturnType<typeof sfs.object>[]).map(fields);
}

test("map search defaults preserve eight-row paging, typed public fields and correlation", async () => {
  const f = fixture();
  f.state.local = Array.from({ length: 19 }, (_, i) =>
    sample(String(i).padStart(2, "0")),
  ).reverse();
  const result = await f.search({
    _cok_: sfs.int(19),
    cmdBaseTime: sfs.string("opaque"),
    uid: sfs.string("other"),
  });
  expect(resultRows(result.body).map((row) => row.uid!.value)).toEqual([
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
  ]);
  expect(resultRows(result.body)[0]).toEqual({
    uid: sfs.string("00"),
    name: sfs.string("Player 00"),
    pic: sfs.string("g101"),
    picVer: sfs.int(2),
    power: sfs.long(9007199254740993n),
    abbr: sfs.string("SYN"),
    pointId: sfs.int(1203),
  });
  expect(result.body._cok_).toEqual(sfs.int(19));
  expect(result.body.cmdBaseTime).toEqual(sfs.string("opaque"));
  expect(Object.keys(result.body).sort()).toEqual(["_cok_", "cmdBaseTime", "list"]);
  expect(result.pushes).toEqual([]);
  expect(decode(encode(result.body))).toEqual(result.body);
  expect(
    resultRows((await f.search({ page: sfs.int(2) })).body).map((row) => row.uid!.value),
  ).toEqual(["08", "09", "10", "11", "12", "13", "14", "15"]);
  expect(resultRows((await f.search({ page: sfs.int(3) })).body)).toHaveLength(3);
  expect((await f.search({ page: sfs.int(4) })).body.list).toEqual(sfs.array());
  expect(f.queries.every((query) => query.realm === 1)).toBe(true);
});

test("map search preserves SQL wildcards and apostrophes as bound data without trimming", async () => {
  const f = fixture();
  f.state.local = [
    sample("01", "xx o'Neil yy"),
    sample("02", "oXNeil"),
    sample("03", "100%"),
    sample("04", "1000"),
    sample("05", " a "),
    sample("06", "a"),
    sample("07", "a_b"),
    sample("08", "axb"),
  ];
  for (const [name, ids] of [
    ["O'NEIL", ["01"]],
    ["o_Neil", ["01", "02"]],
    ["100%", ["03", "04"]],
    ["100\\%", ["03"]],
    ["a\\_b", ["07"]],
    [" a ", ["05"]],
    ["' OR 1=1 --", []],
  ] as const) {
    const result = await f.search({ name: sfs.string(name) });
    expect(resultRows(result.body).map((row) => row.uid!.value)).toEqual([...ids]);
    const query = f.queries.findLast((entry) => entry.text.includes("left join"))!;
    expect(query.params[2]).toBe("%" + name + "%");
    expect(query.text).not.toContain(name);
  }
});

test("target filters omit permanent and null ban times while preserving temporary bans and nullable joins", async () => {
  const f = fixture();
  f.state.local = [
    { ...sample("01"), banTime: 9223372036854775807n },
    { ...sample("02"), banTime: 9223372036854775806n },
    { ...sample("03"), banTime: null },
    { ...sample("04"), banTime: BigInt(now + 999999) },
    { uid: "05", name: "No optional rows", banTime: 0n },
    { ...sample("06"), power: -9223372036854775808n, picVer: -2147483648 },
  ];
  const result = await f.search();
  const rows = resultRows(result.body);
  expect(rows.map((row) => row.uid!.value)).toEqual(["04", "05", "06"]);
  expect(rows[1]).toEqual({
    uid: sfs.string("05"),
    name: sfs.string("No optional rows"),
    abbr: sfs.string(""),
    pointId: sfs.int(1203),
  });
  expect(rows[2]!.power).toEqual(sfs.long(-9223372036854775808n));
  expect(rows[2]!.picVer).toEqual(sfs.int(-2147483648));
  expect(decode(encode(result.body))).toEqual(result.body);
});

test("explicit configured realms route only the public query after authenticating the local observer", async () => {
  const f = fixture();
  f.state.local.push(sample("local"));
  f.state.remote.push(sample("remote"));
  const result = await f.search({ serverId: sfs.int(2) });
  expect(resultRows(result.body).map((row) => row.uid!.value)).toEqual(["remote"]);
  expect(f.queries.map((query) => query.realm)).toEqual([1, 1, 1, 2, 2, 2]);
  expect(f.queries[2]!.text).toBe("commit");
  expect(f.queries[4]!.text).toContain("left join");
  expect(Object.keys(resultRows(result.body)[0]!)).not.toContain("serverId");
  f.state.fail = "remote";
  await expect(f.search({ serverId: sfs.int(2) })).rejects.toThrow("world search unavailable");
  expect(f.queries.at(-1)!.text).toBe("rollback");
  expect(resultRows((await f.search()).body)[0]!.uid).toEqual(sfs.string("local"));
  const missing = fixture();
  await expect(missing.search({ serverId: sfs.int(3) })).rejects.toThrow(
    "world search unavailable",
  );
  expect(missing.queries.every((query) => query.realm === 1)).toBe(true);
});

test("missing, foreign, transferred and banned observers cannot execute local or remote searches", async () => {
  for (const profile of [
    null,
    ["other", 1, 0n, 0],
    ["self", 2, 0n, 0],
    ["self", 1, BigInt(now + 1), 0],
    ["self", 1, 0n, 1],
  ]) {
    for (const serverId of [1, 2, 999]) {
      const f = fixture();
      f.state.profile = profile;
      await expect(f.search({ serverId: sfs.int(serverId) })).rejects.toThrow();
      expect(f.queries.some((query) => query.text.includes("left join"))).toBe(false);
      expect(f.queries.every((query) => query.realm === 1)).toBe(true);
    }
  }
  const exact = fixture();
  exact.state.profile = ["self", 1, BigInt(now), null];
  expect((await exact.search()).body.list).toEqual(sfs.array());
});

test("page normalization preserves positive Java wrapping and rejects negative wrapped offsets", async () => {
  const cases = [
    [-2147483648, 0],
    [-1, 0],
    [0, 0],
    [1, 0],
    [2, 8],
    [268435456, 2147483640],
    [536870913, 0],
    [536870914, 8],
    [805306368, 2147483640],
    [1610612737, 0],
  ];
  for (const [page, offset] of cases) {
    expect(worldSearchOffset(page!)).toBe(offset!);
    const f = fixture();
    await f.search({ page: sfs.int(page!) });
    expect(f.queries.find((query) => query.text.includes("left join"))!.params[4] ?? 0).toBe(
      offset!,
    );
  }
  for (const page of [
    268435457,
    536870912,
    2147483647,
    NaN,
    Infinity,
    1.5,
    2147483648,
    -2147483649,
  ])
    expect(() => worldSearchOffset(page)).toThrow();
});

test("malformed parameters fail before repository access without silently coercing values", async () => {
  for (const params of [
    { name: sfs.int(1) },
    { name: sfs.null() },
    { name: sfs.string("bad\0") },
    { name: sfs.string("\ud800") },
    { name: sfs.string("é".repeat(16384)) },
    { page: sfs.string("2") },
    { page: sfs.long(2n) },
    { page: sfs.int(1.5) },
    { page: sfs.int(268435457) },
    { serverId: sfs.string("2") },
    { serverId: sfs.int(0) },
    { serverId: sfs.int(-1) },
    { serverId: sfs.int(2147483648) },
  ] as Fields[]) {
    const f = fixture();
    await expect(f.search(params)).rejects.toThrow();
    expect(f.queries).toEqual([]);
  }
  expect(worldSearchName("x".repeat(32767))).toBe(true);
  expect(worldSearchName("x".repeat(32768))).toBe(false);
  expect(worldSearchName("😀")).toBe(true);
  expect(worldSearchName("\0")).toBe(false);
  const f = fixture();
  await f.search({ name: sfs.string("x".repeat(32767)) });
  expect(f.queries.find((query) => query.text.includes("left join"))!.params[2]).toHaveLength(
    32769,
  );
});

test("projection allows only public fields and rejects invalid, duplicate or excess results", () => {
  const valid: Row = {
    uid: "1",
    name: "",
    pic: "",
    picVer: 0,
    power: 0n,
    abbr: "",
    gold: 999n,
    deviceId: "private",
    pointId: 42,
    serverId: 99,
  };
  const first = resultRows(worldSearch([valid]))[0]!;
  expect(Object.keys(first).sort()).toEqual([
    "abbr",
    "name",
    "pic",
    "picVer",
    "pointId",
    "power",
    "uid",
  ]);
  expect(first.pointId).toEqual(sfs.int(1203));
  for (const patch of [
    { uid: "" },
    { name: null },
    { name: "\ud800" },
    { pic: "x".repeat(41) },
    { picVer: 1.5 },
    { picVer: 2147483648 },
    { power: 9007199254740992 },
    { power: 9223372036854775808n },
    { abbr: "x".repeat(11) },
    { abbr: null },
  ] as Row[])
    expect(() => worldSearch([{ ...valid, ...patch }])).toThrow();
  expect(() => worldSearch([valid, valid])).toThrow();
  expect(() =>
    worldSearch(Array.from({ length: 9 }, (_, i) => ({ ...valid, uid: String(i) }))),
  ).toThrow();
});

test("repository failures are explicit and sanitized; excessive or duplicate results do not become partial success", async () => {
  for (const failure of ["begin", "profile", "search", "commit"]) {
    const f = fixture();
    f.state.fail = failure;
    await expect(f.search()).rejects.toThrow("world search unavailable");
    expect(f.queries.some((query) => /^(insert|update|delete)/.test(query.text))).toBe(false);
  }
  for (const rows of [
    Array(9).fill(["1", "Name", null, null, null, ""]),
    Array(2).fill(["1", "Name", null, null, null, ""]),
  ]) {
    const f = fixture();
    f.state.raw = rows;
    await expect(f.search()).rejects.toThrow("world search unavailable");
    expect(f.queries.at(-1)!.text).toBe("rollback");
  }
});

test("repository captures input before awaiting and validates direct caller bounds", async () => {
  const f = fixture();
  const query = { name: "Original", offset: 0, kingdomId: 2, now };
  f.state.remote.push(sample("2", "Original"));
  f.state.onProfile = () =>
    Object.assign(query, { name: "Changed", offset: 8, kingdomId: 1, now: -1 });
  const result = await f.store.search("self", query);
  expect(result.kingdomId).toBe(2);
  expect(result.rows[0]!.name).toBe("Original");
  const invalid = fixture();
  for (const patch of [
    { name: "\0" },
    { name: "é".repeat(16384) },
    { offset: -8 },
    { offset: 1 },
    { offset: 2147483648 },
    { kingdomId: 0 },
    { kingdomId: 1.5 },
    { now: -1 },
    { now: NaN },
  ])
    await expect(
      invalid.store.search("self", { name: "", offset: 0, kingdomId: 1, now, ...patch }),
    ).rejects.toThrow();
  for (const owner of ["", "\0", "\ud800", "x".repeat(256)])
    await expect(
      invalid.store.search(owner, { name: "", offset: 0, kingdomId: 1, now }),
    ).rejects.toThrow();
  expect(invalid.queries).toEqual([]);
  expect(() => createWorldSearchStore(invalid.topology, 0)).toThrow();
  expect(() => createWorldSearchStore(invalid.topology, 3)).toThrow();
});

test("command revalidates injected adapter identity and realm and bounds the correlated wire response", async () => {
  const make = (services: GameServices) =>
    new Game(
      {} as GameStore,
      new Rules(new Map(), new Map(), new Map()),
      { kingdomId: 1 },
      () => now,
      services,
    );
  await expect(make({}).execute("self", "world.search.user", {})).rejects.toThrow();
  for (const snapshot of [
    { profile: { uid: "other", serverId: 1 }, kingdomId: 1, rows: [] },
    { profile: { uid: "self", serverId: 2 }, kingdomId: 1, rows: [] },
    { profile: { uid: "self", serverId: 1 }, kingdomId: 2, rows: [] },
  ])
    await expect(
      make({ worldSearch: { search: async () => snapshot } }).execute(
        "self",
        "world.search.user",
        {},
      ),
    ).rejects.toThrow();
  const f = fixture();
  const overhead = encode(
    extension("world.search.user", {
      list: sfs.array(),
      _cok_: { type: Type.Bytes, value: Buffer.alloc(0) },
    }),
  ).length;
  const accepted = await f.search({
    _cok_: { type: Type.Bytes, value: Buffer.alloc(1024 * 1024 - overhead) },
  });
  expect(encode(extension("world.search.user", accepted.body)).length).toBe(1024 * 1024);
  await expect(
    f.search({ _cok_: { type: Type.Bytes, value: Buffer.alloc(1024 * 1024 - overhead + 1) } }),
  ).rejects.toMatchObject({ reason: "world_search_size" });
  await checkWorldSearchStore(f.db);
  expect(f.queries.slice(-3).map((query) => query.params)).toEqual([[0], [0], [0]]);
  expect(f.queries.every((query) => query.realm === 1)).toBe(true);
});
