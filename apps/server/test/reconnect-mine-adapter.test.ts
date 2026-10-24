import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as globalSchema from "@opencok/drizzle/schema/global";
import * as kingdomSchema from "@opencok/drizzle/schema/kingdom";
import { loadFriendshipMine } from "@opencok/repositories/reconnect-mine";
import type { FriendshipMine } from "@opencok/contracts/reconnect";

const seed: FriendshipMine = { itemId: 8100, level: 1, exp: 0, miner: 0, mineTime: 0n, call: 0 };
const saved = [8100, 4, 21, 5, "9007199254740993", 1];

function database(
  options: {
    binding?: string | null;
    accounts?: number;
    server?: string;
    ownerMissing?: boolean;
    ownerRealm?: number;
    existing?: boolean;
    conflict?: boolean;
    lostConflict?: boolean;
    fail?: string;
    uncertainCommit?: boolean;
  } = {},
) {
  const queries: { database: string; text: string; params: unknown[] }[] = [];
  const mines = new Map<string, unknown[]>();
  const binding = options.binding === undefined ? "synthetic-binding" : options.binding;
  if (options.existing) mines.set(`synthetic:${binding}`, saved);
  let uncertainCommit = options.uncertainCommit;
  const global = drizzle(
    {
      query: async (query: { text: string }, params: unknown[] = []) => {
        queries.push({ database: "global", text: query.text, params });
        if (options.fail === "account") throw new Error("Synthetic account failure");
        return {
          rows: Array.from({ length: options.accounts ?? 1 }, () => [
            binding,
            options.server ?? "2",
          ]),
        };
      },
    } as unknown as NodePgClient,
    { schema: globalSchema },
  );
  const kingdom = drizzle(
    {
      query: async (query: { text: string }, params: unknown[] = []) => {
        queries.push({ database: "kingdom", text: query.text, params });
        if (query.text === "commit" && uncertainCommit) {
          uncertainCommit = false;
          throw new Error("Synthetic uncertain commit result");
        }
        if (query.text.includes('from "opencok_kingdom"."userprofile"')) {
          if (options.fail === "profile") throw new Error("Synthetic profile failure");
          return { rows: options.ownerMissing ? [] : [[params[0], options.ownerRealm ?? 2]] };
        }
        if (query.text.startsWith('insert into "opencok_kingdom"."user_mine"')) {
          if (options.fail === "insert") throw new Error("Synthetic insert failure");
          const key = `${params[0]}:${params[1]}`;
          if (options.conflict) {
            if (!options.lostConflict) mines.set(key, saved);
            return { rows: [] };
          }
          if (mines.has(key)) return { rows: [] };
          const row = [params[2], params[3], params[5], params[6], params[7], params[4]];
          mines.set(key, row);
          return { rows: [row] };
        }
        if (query.text.includes('from "opencok_kingdom"."user_mine"')) {
          if (options.fail === "mine") throw new Error("Synthetic mine failure");
          const row = mines.get(`${params[0]}:${params[1]}`);
          return { rows: row ? [row] : [] };
        }
        return { rows: [] };
      },
    } as unknown as NodePgClient,
    { schema: kingdomSchema },
  );
  return {
    global,
    kingdom,
    queries,
    mines,
    load: (initial = () => seed) => loadFriendshipMine(global, kingdom, 2, "synthetic", initial),
  };
}

test("bound mine reads preserve saved progress and select only the requested owner and binding", async () => {
  const db = database({ existing: true });
  expect(
    await db.load(() => {
      throw new Error("Default must not be evaluated");
    }),
  ).toEqual({ itemId: 8100, level: 4, exp: 21, miner: 5, mineTime: 9007199254740993n, call: 1 });
  expect(db.queries).toHaveLength(5);
  expect(db.queries[0]?.text).toContain(
    'select "facebookAccount", "server" from "opencok_global"."account_new"',
  );
  expect(db.queries[0]?.params).toEqual(["synthetic", 2]);
  expect(db.queries[1]?.text).toBe("begin isolation level read committed read write");
  expect(db.queries[2]?.params).toEqual(["synthetic", 1]);
  expect(db.queries[2]?.text).toEndWith("for share");
  expect(db.queries[3]?.params).toEqual(["synthetic", "synthetic-binding", 1]);
  expect(db.queries[3]?.text).toContain(
    '"user_mine"."uid" = $1 and "opencok_kingdom"."user_mine"."fId" = $2',
  );
  expect(db.queries[3]?.text).toContain(
    'select "itemId", "level", "exp", "miner", "mineTime", "call"',
  );
  expect(db.queries.at(-1)?.text).toBe("commit");
  for (const query of db.queries)
    expect(query.text).not.toMatch(
      /\b(insert|update|delete)\b|select \*|deviceId|emailAccount|passmd5|helpInfo/,
    );
});

test("unbound or absent account records use ephemeral defaults without reading or writing saved mines", async () => {
  for (const options of [
    { binding: null },
    { binding: "" },
    { binding: " \t\n" },
    { accounts: 0 },
    { accounts: 2 },
  ]) {
    const db = database(options);
    expect(await db.load()).toEqual({ ...seed });
    expect(db.mines.size).toBe(0);
    expect(db.queries).toHaveLength(4);
    expect(db.queries.every((query) => !query.text.includes('"user_mine"'))).toBe(true);
    expect(db.queries.at(-1)?.text).toBe("commit");
  }
});

test("first bound reconnect creates one mine and repeated reads never overwrite its progress", async () => {
  const db = database();
  expect(await db.load()).toEqual({ ...seed });
  const insert = db.queries.find((query) => query.text.startsWith("insert"))!;
  expect(insert.text).toContain(
    'on conflict ("uid","fId") do nothing returning "itemId", "level", "exp", "miner", "mineTime", "call"',
  );
  expect(insert.params).toEqual(["synthetic", "synthetic-binding", 8100, 1, 0, 0, 0, 0n, null]);
  expect(db.mines.size).toBe(1);
  db.mines.set("synthetic:synthetic-binding", saved);
  expect(
    await db.load(() => {
      throw new Error("Default must not be evaluated");
    }),
  ).toMatchObject({ level: 4, exp: 21, mineTime: 9007199254740993n });
  expect(db.queries.filter((query) => query.text.startsWith("insert"))).toHaveLength(1);
  expect(db.queries.some((query) => /^(update|delete)/.test(query.text))).toBe(false);
});

test("creation conflict reads the winning record instead of returning an unpersisted seed", async () => {
  const db = database({ conflict: true });
  expect(await db.load()).toMatchObject({ level: 4, exp: 21, mineTime: 9007199254740993n });
  expect(
    db.queries.filter((query) => query.text.includes('from "opencok_kingdom"."user_mine"')),
  ).toHaveLength(2);
  expect(db.queries.at(-1)?.text).toBe("commit");
  const lost = database({ conflict: true, lostConflict: true });
  await expect(lost.load()).rejects.toThrow("reconnect mine unavailable");
  expect(lost.queries.at(-1)?.text).toBe("rollback");
});

test("retry after a simulated lost commit response recovers the persisted mine through its natural key", async () => {
  const db = database({ uncertainCommit: true });
  await expect(db.load()).rejects.toThrow("Failed query: commit");
  expect(await db.load()).toEqual({ ...seed });
  expect(db.mines.size).toBe(1);
  expect(db.queries.filter((query) => query.text.startsWith("insert"))).toHaveLength(1);
});

test("invalid identity, realm, binding, missing owners and provider failures never initialize another player's mine", async () => {
  const untouched = database();
  for (const uid of ["", " ", "x".repeat(41)])
    await expect(
      loadFriendshipMine(untouched.global, untouched.kingdom, 2, uid, () => seed),
    ).rejects.toThrow();
  for (const kingdomId of [0, -1, 1.5, 2147483648])
    await expect(
      loadFriendshipMine(untouched.global, untouched.kingdom, kingdomId, "synthetic", () => seed),
    ).rejects.toThrow();
  expect(untouched.queries).toHaveLength(0);
  for (const options of [
    { server: "3" },
    { server: "2.0" },
    { binding: "x".repeat(41) },
    { ownerMissing: true },
    { ownerRealm: 3 },
    { fail: "account" },
    { fail: "profile" },
    { fail: "mine" },
    { fail: "insert" },
  ]) {
    const db = database(options);
    await expect(db.load()).rejects.toThrow();
    expect(db.mines.size).toBe(0);
    expect(db.queries.some((query) => query.text === "commit")).toBe(false);
    if (db.queries.some((query) => query.text.startsWith("begin")))
      expect(db.queries.at(-1)?.text).toBe("rollback");
  }
  const invalidDefault = database();
  await expect(
    invalidDefault.load(() => {
      throw new Error("Synthetic invalid default");
    }),
  ).rejects.toThrow("Synthetic invalid default");
  expect(invalidDefault.queries.some((query) => query.text.startsWith("insert"))).toBe(false);
  expect(invalidDefault.queries.at(-1)?.text).toBe("rollback");
});

test("a differently bound mine is neither reused nor modified", async () => {
  const db = database();
  db.mines.set("synthetic:previous-binding", saved);
  db.mines.set("another-owner:synthetic-binding", saved);
  expect(await db.load()).toEqual({ ...seed });
  expect(db.mines.size).toBe(3);
  expect(db.mines.get("synthetic:previous-binding")).toEqual(saved);
  expect(db.mines.get("another-owner:synthetic-binding")).toEqual(saved);
});
