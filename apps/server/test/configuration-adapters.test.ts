import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import { getTableColumns } from "drizzle-orm";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { readLoginConfiguration } from "@opencok/repositories/game";
import { Cache } from "@opencok/storage/session";

function database(failPreferences = false) {
  const queries: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      if (query.text.includes('from "opencok_kingdom"."userprofile"')) {
        const values: Record<string, unknown> = {
          uid: "synthetic-player",
          level: 5,
          pf: "market_global",
        };
        return {
          rows: [Object.keys(getTableColumns(userprofile)).map((key) => values[key] ?? null)],
        };
      }
      if (query.text.includes('from "opencok_kingdom"."switches"'))
        return { rows: [["synthetic-switch", 1, "12.6.0"]] };
      if (query.text.includes('from "opencok_kingdom"."parse_info"')) {
        if (failPreferences) throw new Error("Synthetic query failure");
        return { rows: [[3, 0, 1]] };
      }
      return { rows: [] };
    },
  };
  return { queries, db: drizzle(client as unknown as NodePgClient, { schema }) };
}

test("configuration persistence uses one read-only snapshot and filters both player projections", async () => {
  const { db, queries } = database();
  const result = await readLoginConfiguration(db, "synthetic-player");
  expect(result.profile?.uid).toBe("synthetic-player");
  expect(result.switches).toEqual([{ name: "synthetic-switch", stat: 1, appVersion: "12.6.0" }]);
  expect(result.pushSettings).toEqual([{ type: 3, status: 0, audio: 1 }]);
  expect(queries[0]?.text).toBe("begin isolation level repeatable read read only");
  expect(queries.at(-1)?.text).toBe("commit");
  const profile = queries.find((query) =>
    query.text.includes('from "opencok_kingdom"."userprofile"'),
  )!;
  expect(profile.text).toContain('where "opencok_kingdom"."userprofile"."uid" = $1');
  expect(profile.params[0]).toBe("synthetic-player");
  const preferences = queries.find((query) =>
    query.text.includes('from "opencok_kingdom"."parse_info"'),
  )!;
  expect(preferences.text).toContain('where "opencok_kingdom"."parse_info"."uid" = $1');
  expect(preferences.params).toEqual(["synthetic-player"]);
  expect(preferences.text).toContain('order by "opencok_kingdom"."parse_info"."type" asc');
  expect(queries.every((query) => !/\b(insert|update|delete)\b/i.test(query.text))).toBe(true);
});

test("configuration query failure rolls back and never returns a partial snapshot", async () => {
  const { db, queries } = database(true);
  await expect(readLoginConfiguration(db, "synthetic-player")).rejects.toThrow();
  expect(queries.at(-1)?.text).toBe("rollback");
  expect(queries.some((query) => query.text === "commit")).toBe(false);
});

class CounterCache extends Cache {
  readonly calls: string[][] = [];
  response: unknown = null;
  constructor(kingdomId: number) {
    super({ redisUrl: "redis://unused.invalid", timeoutMs: 1000, kingdomId });
  }
  override async command(command: string, ...args: string[]): Promise<unknown> {
    this.calls.push([command, ...args]);
    return this.response;
  }
}

test("device change counter reads are global, nullable and preserve literal text for deferred parsing", async () => {
  const first = new CounterCache(1);
  const second = new CounterCache(2);
  expect(await first.deviceChangeCount("synthetic-device")).toBeNull();
  first.response = "9007199254740993";
  expect(await first.deviceChangeCount("synthetic-device")).toBe("9007199254740993");
  second.response = "0";
  expect(await second.deviceChangeCount("synthetic-device")).toBe("0");
  for (const raw of ["", "-1", "+２", "0003", "invalid", " 3", "0".repeat(65535)]) {
    first.response = raw;
    expect(await first.deviceChangeCount("synthetic-device")).toBe(raw);
  }
  expect(first.calls[0]).toEqual(["GET", "opencok:global:device-account-change:synthetic-device"]);
  expect(second.calls[0]).toEqual(first.calls[0]);
  expect(first.calls.every(([command]) => command === "GET")).toBe(true);
});

test("invalid Redis transport responses and bounded keys fail before configuration interpretation", async () => {
  const cache = new CounterCache(1);
  for (const value of [undefined, 3, false, {}, [], "0".repeat(65536)]) {
    cache.response = value;
    await expect(cache.deviceChangeCount("synthetic-device")).rejects.toThrow();
  }
  cache.calls.length = 0;
  for (const device of ["", "a".repeat(256)])
    await expect(cache.deviceChangeCount(device)).rejects.toThrow();
  expect(cache.calls).toEqual([]);
});
