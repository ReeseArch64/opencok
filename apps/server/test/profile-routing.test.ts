import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import * as globalSchema from "@opencok/drizzle/schema/global";
import { checkPublicProfileStore, loadPublicProfile } from "@opencok/repositories/profile";

function fixture(
  options: {
    server?: string | null;
    profileRealm?: number;
    missing?: boolean;
    failure?: string;
    configured?: boolean;
  } = {},
) {
  const calls: { realm: number; text: string; params: unknown[] }[] = [];
  const realm = (id: number) => {
    const client = {
      query: async (query: { text: string }, params: unknown[] = []) => {
        calls.push({ realm: id, text: query.text, params });
        const table = query.text.match(/from "opencok_kingdom"\."([^"]+)"/)?.[1];
        if (table && table === options.failure) {throw new Error("Synthetic route failure");}
        if (table === "userprofile")
          {return {
            rows: options.missing
              ? []
              : [["2001", "Synthetic", 5, 12, null, 0, 0, 0, "", options.profileRealm ?? id]],
          };}
        if (table === "user_achievement") {return { rows: [["0"]] };}
        return { rows: [] };
      },
    };
    return { db: drizzle(client as unknown as NodePgClient, { schema }) };
  };
  const global = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      calls.push({ realm: 0, text: query.text, params });
      if (options.failure === "directory") {throw new Error("Synthetic directory failure");}
      return { rows: options.server === null ? [] : [[options.server ?? "2"]] };
    },
  };
  const kingdoms = new Map([[1, realm(1)]]);
  if (options.configured !== false) {kingdoms.set(2, realm(2));}
  const databases = {
    global: { db: drizzle(global as unknown as NodePgClient, { schema: globalSchema }) },
    kingdoms,
    getKingdom: (id: number) => kingdoms.get(id)!,
  } as unknown as Parameters<typeof loadPublicProfile>[0];
  return { databases, calls };
}

test("full profiles follow the global directory before reading any realm", async () => {
  const { databases, calls } = fixture();
  const result = await loadPublicProfile(databases, 1, "2001", "observer-alliance");
  expect(result?.kingdomId).toBe(2);
  expect(result?.state.profile).toMatchObject({ uid: "2001", serverId: 2 });
  expect(calls[0]?.realm).toBe(0);
  expect(calls[0]?.params).toEqual(["2001", 1]);
  expect(calls[0]?.text).toContain('select "server" from "opencok_global"."account_new"');
  expect(calls[0]?.text).not.toMatch(/uuid|device|email|passmd5/);
  expect(calls.slice(1).every((call) => call.realm === 2)).toBe(true);
  expect(calls[1]?.text).toBe("begin isolation level repeatable read read only");
  expect(calls.at(-1)?.text).toBe("commit");
});

test("absent directory entries use the local realm while absent targets and nonnumeric IDs stay absent", async () => {
  const local = fixture({ server: null });
  expect((await loadPublicProfile(local.databases, 1, "2001", ""))?.kingdomId).toBe(1);
  expect(local.calls.every((call) => call.realm !== 2)).toBe(true);
  const missing = fixture({ missing: true });
  expect(await loadPublicProfile(missing.databases, 1, "2001", "")).toBeUndefined();
  expect(missing.calls).toHaveLength(4);
  const invalid = fixture();
  for (const uid of ["", "2001@mod", "synthetic", " ", "1".repeat(41)])
    {expect(await loadPublicProfile(invalid.databases, 1, uid, "")).toBeUndefined();}
  expect(invalid.calls).toEqual([]);
});

test("unconfigured and malformed directory routes never fall back to a different realm", async () => {
  for (const options of [
    { configured: false },
    { server: "3" },
    { server: "0" },
    { server: "-1" },
    { server: "2.0" },
    { server: " 2" },
    { server: "2147483648" },
    { failure: "directory" },
  ]) {
    const { databases, calls } = fixture(options);
    await expect(loadPublicProfile(databases, 1, "2001", "")).rejects.toThrow();
    expect(calls.every((call) => call.realm === 0)).toBe(true);
  }
  for (const options of [{ profileRealm: 1 }, { failure: "flower_ranking" }]) {
    const { databases, calls } = fixture(options);
    await expect(loadPublicProfile(databases, 1, "2001", "")).rejects.toThrow();
    expect(calls.every((call) => call.realm !== 1)).toBe(true);
  }
});

test("public profile readiness checks additional tables without reading records", async () => {
  const calls: { text: string; params: unknown[] }[] = [];
  let fail = false;
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      calls.push({ text: query.text, params });
      if (fail) {throw new Error("Synthetic readiness failure");}
      return { rows: [] };
    },
  };
  const db = drizzle(client as unknown as NodePgClient, { schema });
  await checkPublicProfileStore(db);
  expect(calls.map((call) => call.text.match(/from "opencok_kingdom"\."([^"]+)"/)?.[1])).toEqual([
    "user_skill",
    "user_honor",
    "user_achievement",
    "flower_ranking",
    "alliance_vedio",
  ]);
  expect(calls.every((call) => call.params.length === 1 && call.params[0] === 0)).toBe(true);
  expect(calls.every((call) => !/\b(insert|update|delete)\b/.test(call.text))).toBe(true);
  fail = true;
  await expect(checkPublicProfileStore(db)).rejects.toThrow();
});
