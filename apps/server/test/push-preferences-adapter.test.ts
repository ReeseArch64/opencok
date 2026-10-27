import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { setPushPreference } from "@opencok/repositories/push-preferences";
import { Database, initializeWorldNewsPreference } from "@opencok/repositories/game";
import type { PushPreference } from "@opencok/contracts/game";

type Entry = PushPreference & { uid: string };
type Profile = { uid: string; serverId: number; banFlag: number; banTime: bigint };
const now = 1000;
function fixture() {
  let saved: Entry[] = [
    { uid: "other", type: 15, status: 8, audio: 9 },
    { uid: "self", type: 3, status: 1, audio: 0 },
  ];
  let profile: Profile | undefined = { uid: "self", serverId: 2, banFlag: 0, banTime: 0n };
  let failure = "";
  let lock = Promise.resolve();
  let next = 0;
  const queries: { client: number; text: string; params: unknown[] }[] = [];
  class FixturePool {
    async connect() {
      const client = next++;
      let pending: Entry[] | undefined;
      let unlock: (() => void) | undefined;
      const release = () => {
        unlock?.();
        unlock = undefined;
      };
      return {
        release,
        query: async (query: { text: string }, params: unknown[] = []) => {
          const text = query.text;
          queries.push({ client, text, params });
          if (text.startsWith("begin")) {return { rows: [] };}
          if (text === "rollback") {
            pending = undefined;
            release();
            return { rows: [] };
          }
          if (text === "commit") {
            if (failure === "commit") {throw new Error("Synthetic commit failure");}
            saved = pending!;
            pending = undefined;
            release();
            if (failure === "lost") {throw new Error("Synthetic lost acknowledgment");}
            return { rows: [] };
          }
          if (text.includes('from "opencok_kingdom"."userprofile"')) {
            expect(text).toContain('where "opencok_kingdom"."userprofile"."uid" = $1');
            expect(text).toContain("for update");
            expect(params).toEqual(["self", 1]);
            const previous = lock;
            lock = new Promise<void>((resolve) => {
              unlock = resolve;
            });
            await previous;
            pending = structuredClone(saved);
            if (failure === "profile") {throw new Error("Synthetic profile failure");}
            return {
              rows: profile
                ? [[profile.uid, profile.serverId, profile.banFlag, profile.banTime]]
                : [],
            };
          }
          if (!pending) {throw new Error("SQL before owner lock");}
          if (text.startsWith("select") && text.includes('from "opencok_kingdom"."parse_info"')) {
            expect(text).toContain(
              'where ("opencok_kingdom"."parse_info"."uid" = $1 and "opencok_kingdom"."parse_info"."type" = $2)',
            );
            if (failure === "select") {throw new Error("Synthetic select failure");}
            return {
              rows: pending
                .filter((row) => row.uid === params[0] && row.type === params[1])
                .map((row) => [row.uid]),
            };
          }
          if (text.startsWith('insert into "opencok_kingdom"."parse_info"')) {
            expect(text).not.toContain("on conflict");
            if (failure === "insert") {throw new Error("Synthetic insert failure");}
            const [uid, type, status, audio] = params as [string, number, number, number];
            if (pending.some((row) => row.uid === uid && row.type === type))
              {throw new Error("Duplicate preference");}
            pending.push({ uid, type, status, audio });
            return { rows: [], rowCount: 1 };
          }
          if (text.startsWith('update "opencok_kingdom"."parse_info"')) {
            expect(text).toContain(
              'set "status" = $1, "audio" = $2 where ("opencok_kingdom"."parse_info"."uid" = $3 and "opencok_kingdom"."parse_info"."type" = $4)',
            );
            if (failure === "update") {throw new Error("Synthetic update failure");}
            const [status, audio, uid, type] = params;
            const selected = pending.filter((row) => row.uid === uid && row.type === type);
            for (const row of selected) {
              row.status = status as number;
              row.audio = audio as number;
            }
            return { rows: [], rowCount: selected.length };
          }
          throw new Error("Unexpected SQL");
        },
      };
    }
  }
  return {
    db: drizzle(new FixturePool() as unknown as NodePgClient, { schema }),
    queries,
    rows: () => structuredClone(saved),
    profile: (value: Profile | undefined) => {
      profile = value;
    },
    fail: (value: string) => {
      failure = value;
    },
  };
}

test("preference writes insert or replace both values for only the locked owner and selected type", async () => {
  const instance = fixture();
  const initial = instance.rows();
  await setPushPreference(instance.db, "self", 2, { type: 15, status: -7, audio: 0 }, now);
  expect(instance.rows()).toEqual([...initial, { uid: "self", type: 15, status: -7, audio: 0 }]);
  for (let index = 0; index < 2; index++)
    {await setPushPreference(instance.db, "self", 2, { type: 15, status: 1, audio: -4 }, now);}
  expect(instance.rows()).toEqual([...initial, { uid: "self", type: 15, status: 1, audio: -4 }]);
  expect(instance.queries.filter(({ text }) => text.startsWith("insert"))).toHaveLength(1);
  expect(instance.queries.filter(({ text }) => text.startsWith("update"))).toHaveLength(2);
  expect(
    instance.queries
      .filter(({ text }) => text.startsWith("begin"))
      .every(({ text }) => text === "begin isolation level read committed read write"),
  ).toBe(true);
});

test("repository accepts signed Int boundaries and snapshots input before awaiting a transaction", async () => {
  const instance = fixture();
  const input = { type: -2147483648, status: 2147483647, audio: -2147483648 };
  const save = setPushPreference(instance.db, "self", 2, input, now);
  input.type = 0;
  input.status = 0;
  input.audio = 0;
  await save;
  expect(instance.rows().at(-1)).toEqual({
    uid: "self",
    type: -2147483648,
    status: 2147483647,
    audio: -2147483648,
  });
});

test("missing moved mismatched and banned owners cannot select or mutate preferences", async () => {
  const valid = { uid: "self", serverId: 2, banFlag: 0, banTime: 0n };
  for (const profile of [
    undefined,
    { ...valid, uid: "other" },
    { ...valid, serverId: 3 },
    { ...valid, banFlag: 1 },
    { ...valid, banTime: 1001n },
  ]) {
    const instance = fixture();
    instance.profile(profile);
    const before = instance.rows();
    await expect(
      setPushPreference(instance.db, "self", 2, { type: 15, status: 1, audio: 0 }, now),
    ).rejects.toThrow();
    expect(instance.rows()).toEqual(before);
    expect(instance.queries.some(({ text }) => text.includes('"parse_info"'))).toBe(false);
    expect(instance.queries.at(-1)?.text).toBe("rollback");
  }
  const expired = fixture();
  expired.profile({ ...valid, banTime: BigInt(now) });
  await setPushPreference(expired.db, "self", 2, { type: 15, status: 1, audio: 0 }, now);
  expect(expired.rows().at(-1)?.audio).toBe(0);
});

test("invalid preference inputs fail before SQL", async () => {
  const instance = fixture();
  const valid = { type: 15, status: 1, audio: 0 };
  for (const key of ["type", "status", "audio"])
    {for (const value of [NaN, Infinity, 0.5, -2147483649, 2147483648])
      {await expect(
        setPushPreference(instance.db, "self", 2, { ...valid, [key]: value }, now),
      ).rejects.toThrow();}}
  for (const uid of ["", "x".repeat(41), "a\0b", "\ud800"])
    {await expect(setPushPreference(instance.db, uid, 2, valid, now)).rejects.toThrow();}
  for (const time of [-1, 0.5, NaN, Infinity])
    {await expect(setPushPreference(instance.db, "self", 2, valid, time)).rejects.toThrow();}
  for (const realm of [0, -1, 0.5, NaN])
    {await expect(setPushPreference(instance.db, "self", realm, valid, now)).rejects.toThrow();}
  expect(instance.queries).toEqual([]);
});

test("required SQL failures and unsuccessful commits preserve previous preference state", async () => {
  for (const stage of ["profile", "select", "insert", "update", "commit"]) {
    const instance = fixture();
    const before = instance.rows();
    instance.fail(stage);
    await expect(
      setPushPreference(
        instance.db,
        "self",
        2,
        { type: stage === "update" ? 3 : 15, status: 0, audio: 8 },
        now,
      ),
    ).rejects.toThrow();
    expect(instance.rows()).toEqual(before);
    expect(instance.queries.at(-1)?.text).toBe("rollback");
  }
});

test("lost acknowledgments leave committed choices and replay updates the same row", async () => {
  const instance = fixture();
  const choice = { type: 15, status: 1, audio: 0 };
  instance.fail("lost");
  await expect(setPushPreference(instance.db, "self", 2, choice, now)).rejects.toThrow();
  expect(instance.rows().at(-1)).toEqual({ uid: "self", ...choice });
  instance.fail("");
  await setPushPreference(instance.db, "self", 2, choice, now);
  expect(instance.rows().filter((row) => row.uid === "self" && row.type === 15)).toEqual([
    { uid: "self", ...choice },
  ]);
});

test("concurrent writes serialize selection after the owner lock and update the inserted row", async () => {
  const instance = fixture();
  const choices = [
    { type: 15, status: 0, audio: 1 },
    { type: 15, status: 1, audio: 0 },
  ];
  await Promise.all(
    choices.map((choice) => setPushPreference(instance.db, "self", 2, choice, now)),
  );
  expect(instance.rows().filter((row) => row.uid === "self" && row.type === 15)).toEqual([
    { uid: "self", ...choices[1]! },
  ]);
  expect(instance.queries.filter(({ text }) => text.startsWith("insert"))).toHaveLength(1);
  expect(instance.queries.filter(({ text }) => text.startsWith("update"))).toHaveLength(1);
  const firstCommit = instance.queries.findIndex(
    ({ client, text }) => client === 0 && text === "commit",
  );
  const secondRead = instance.queries.findIndex(
    ({ client, text }) =>
      client === 1 && text.startsWith("select") && text.includes('"parse_info"'),
  );
  expect(secondRead).toBeGreaterThan(firstCommit);
});

test("the default initializer and explicit setter retain their distinct insert and update semantics", async () => {
  const instance = fixture();
  await initializeWorldNewsPreference(instance.db, "self", 2, now);
  const context = { kingdom: { db: instance.db }, config: { kingdomId: 2 } } as Database;
  await Database.prototype.setPushPreference.call(
    context,
    "self",
    { type: 15, status: 1, audio: 0 },
    now,
  );
  await expect(initializeWorldNewsPreference(instance.db, "self", 2, now)).rejects.toThrow();
  expect(instance.rows().at(-1)).toEqual({ uid: "self", type: 15, status: 1, audio: 0 });
});
