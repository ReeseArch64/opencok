import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { initializeWorldNewsPreference } from "@opencok/repositories/game";

const owner = "synthetic-player";
const now = 1000;
type Preference = { type: number; status: number; audio: number };
function database(
  options: {
    profile?: { uid: string; serverId: number; banFlag: number; banTime: bigint } | null;
    rows?: Preference[];
    failure?: "insert" | "commit" | "lost-commit";
  } = {},
) {
  const profile =
    options.profile === undefined
      ? { uid: owner, serverId: 2, banFlag: 0, banTime: 0n }
      : options.profile;
  let saved = new Map((options.rows ?? []).map((row) => [row.type, { ...row }]));
  let pending: Map<number, Preference> | undefined;
  const queries: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      if (query.text.startsWith("begin")) {pending = structuredClone(saved);}
      else if (query.text.includes('from "opencok_kingdom"."userprofile"')) {
        expect(params[0]).toBe(owner);
        expect(query.text).toContain("for update");
        return {
          rows: profile ? [[profile.uid, profile.serverId, profile.banFlag, profile.banTime]] : [],
        };
      } else if (query.text.startsWith('insert into "opencok_kingdom"."parse_info"')) {
        if (options.failure === "insert") {throw new Error("insert unavailable");}
        const [uid, type, status, audio] = params;
        expect(uid).toBe(owner);
        if (pending!.has(Number(type)))
          {throw Object.assign(new Error("duplicate preference"), { code: "23505" });}
        pending!.set(Number(type), {
          type: Number(type),
          status: Number(status),
          audio: Number(audio),
        });
      } else if (query.text === "commit") {
        if (options.failure === "commit") {throw new Error("commit failed");}
        saved = pending!;
        pending = undefined;
        if (options.failure === "lost-commit") {throw new Error("commit acknowledgment lost");}
      } else if (query.text === "rollback") {pending = undefined;}
      else {throw new Error("Unexpected SQL operation");}
      return { rows: [] };
    },
  };
  return {
    db: drizzle(client as unknown as NodePgClient, { schema }),
    queries,
    rows: () => [...saved.values()],
  };
}

test("world-news initialization commits only the missing default under an authorized owner lock", async () => {
  const existing = { type: 3, status: 1, audio: 0 };
  const { db, queries, rows } = database({ rows: [existing] });
  await initializeWorldNewsPreference(db, owner, 2, now);
  expect(rows()).toEqual([existing, { type: 15, status: 0, audio: 1 }]);
  expect(queries[0]?.text).toBe("begin isolation level read committed read write");
  expect(queries[1]?.text).toContain('where "opencok_kingdom"."userprofile"."uid" = $1');
  expect(queries[2]?.params).toEqual([owner, 15, 0, 1]);
  expect(queries[2]?.text).not.toContain("on conflict");
  expect(queries.at(-1)?.text).toBe("commit");
  expect(
    queries.filter(
      ({ text }) => /\b(insert|update|delete)\b/i.test(text) && !text.includes("for update"),
    ),
  ).toHaveLength(1);
});

test("missing, moved, mismatched and banned owners cannot initialize preferences", async () => {
  const valid = { uid: owner, serverId: 2, banFlag: 0, banTime: 0n };
  for (const profile of [
    null,
    { ...valid, uid: "other" },
    { ...valid, serverId: 3 },
    { ...valid, banFlag: 1 },
    { ...valid, banTime: 1001n },
  ]) {
    const { db, rows, queries } = database({ profile });
    await expect(initializeWorldNewsPreference(db, owner, 2, now)).rejects.toThrow();
    expect(rows()).toEqual([]);
    expect(queries.some(({ text }) => text.startsWith("insert"))).toBe(false);
    expect(queries.at(-1)?.text).toBe("rollback");
  }
  const { db, rows } = database({ profile: { ...valid, banTime: 1000n } });
  await initializeWorldNewsPreference(db, owner, 2, now);
  expect(rows()).toEqual([{ type: 15, status: 0, audio: 1 }]);
});

test("preference initialization rejects invalid identity, realm and clock before any SQL", async () => {
  const { db, queries } = database();
  for (const uid of ["", "x".repeat(41)])
    {await expect(initializeWorldNewsPreference(db, uid, 2, now)).rejects.toThrow();}
  for (const clock of [-1, NaN, Infinity, 0.5])
    {await expect(initializeWorldNewsPreference(db, owner, 2, clock)).rejects.toThrow();}
  for (const kingdom of [0, 1.5, NaN])
    {await expect(initializeWorldNewsPreference(db, owner, kingdom, now)).rejects.toThrow();}
  expect(queries).toEqual([]);
});

test("duplicate preferences and failed writes reject without overwriting saved choices", async () => {
  const existing = { type: 15, status: 1, audio: 0 };
  const duplicate = database({ rows: [existing] });
  await expect(initializeWorldNewsPreference(duplicate.db, owner, 2, now)).rejects.toThrow();
  expect(duplicate.rows()).toEqual([existing]);
  expect(duplicate.queries.at(-1)?.text).toBe("rollback");
  for (const failure of ["insert", "commit"] as const) {
    const instance = database({ failure });
    await expect(initializeWorldNewsPreference(instance.db, owner, 2, now)).rejects.toThrow();
    expect(instance.rows()).toEqual([]);
    expect(instance.queries.at(-1)?.text).toBe("rollback");
  }
});

test("a lost commit acknowledgment can leave the initialized preference persisted", async () => {
  const { db, queries, rows } = database({ failure: "lost-commit" });
  await expect(initializeWorldNewsPreference(db, owner, 2, now)).rejects.toThrow();
  expect(rows()).toEqual([{ type: 15, status: 0, audio: 1 }]);
  expect(queries.at(-1)?.text).toBe("rollback");
});
