import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import { getTableColumns } from "drizzle-orm";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { getConfigurationByPlayerId, readLoginSwitches } from "@opencok/repositories/game";
import { Cache } from "@opencok/storage/session";

function database(
  options: {
    failure?: "profile" | "preferences" | "switches" | "commit";
    emptySwitches?: boolean;
    sqlState?: string;
  } = {},
) {
  const queries: { text: string; params: unknown[] }[] = [];
  let aborted = false;
  let transaction = false;
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      if (query.text.startsWith("begin")) transaction = true;
      const stage =
        query.text === "commit"
          ? "commit"
          : query.text.includes('from "opencok_kingdom"."userprofile"')
            ? "profile"
            : query.text.includes('from "opencok_kingdom"."parse_info"')
              ? "preferences"
              : query.text.includes('from "opencok_kingdom"."switches"')
                ? "switches"
                : undefined;
      if (stage && stage === options.failure) {
        aborted = transaction;
        throw Object.assign(
          new Error("Synthetic query failure"),
          options.sqlState ? { code: options.sqlState } : {},
        );
      }
      if (query.text === "rollback") aborted = false;
      if (aborted) throw new Error("Transaction still aborted");
      if (query.text === "commit" || query.text === "rollback") transaction = false;
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
        return { rows: options.emptySwitches ? [] : [["synthetic-switch", 1, "12.6.0"]] };
      if (query.text.includes('from "opencok_kingdom"."parse_info"')) {
        return { rows: [[3, 0, 1]] };
      }
      return { rows: [] };
    },
  };
  return { queries, db: drizzle(client as unknown as NodePgClient, { schema }) };
}

test("configuration persistence uses one read-only snapshot and filters both player projections", async () => {
  const { db, queries } = database();
  const result = await getConfigurationByPlayerId(db, "synthetic-player");
  expect(result.profile?.uid).toBe("synthetic-player");
  expect(result.switches).toBeUndefined();
  expect(queries.some(({ text }) => text.includes('from "opencok_kingdom"."switches"'))).toBe(
    false,
  );
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

test("required preference query failure rolls back and never returns a snapshot", async () => {
  const { db, queries } = database({ failure: "preferences" });
  await expect(getConfigurationByPlayerId(db, "synthetic-player")).rejects.toThrow();
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
  for (const device of ["a".repeat(256)])
    await expect(cache.deviceChangeCount(device)).rejects.toThrow();
  expect(cache.calls).toEqual([]);
});

test("optional switches run independently after required configuration and recover non-SQL failures by omission", async () => {
  const { db, queries } = database({ failure: "switches" });
  const result = await getConfigurationByPlayerId(db, "synthetic-player");
  expect(result.profile?.uid).toBe("synthetic-player");
  expect(result.pushSettings).toEqual([{ type: 3, status: 0, audio: 1 }]);
  expect(queries.at(-1)?.text).toBe("commit");
  expect(await readLoginSwitches(db)).toBeUndefined();
  expect(queries.at(-1)?.text).toContain('from "opencok_kingdom"."switches"');
  expect(queries.filter(({ text }) => text.startsWith("begin"))).toHaveLength(1);
  expect(queries.every(({ text }) => !/\b(insert|update|delete)\b/i.test(text))).toBe(true);
});

test("empty switches remain successful while required snapshot failures cannot be swallowed", async () => {
  const { db } = database({ emptySwitches: true });
  expect(await readLoginSwitches(db)).toEqual([]);
  for (const failure of ["profile", "preferences", "commit"] as const) {
    const { db, queries } = database({ failure });
    await expect(getConfigurationByPlayerId(db, "synthetic-player")).rejects.toThrow();
    expect(queries.at(-1)?.text).toBe("rollback");
    if (failure !== "commit") expect(queries.some(({ text }) => text === "commit")).toBe(false);
    expect(queries.some(({ text }) => text.includes('from "opencok_kingdom"."switches"'))).toBe(
      false,
    );
  }
});

test("counter keys preserve empty, literal null and whitespace device suffixes", async () => {
  const cache = new CounterCache(1);
  for (const device of ["", "null", " "]) expect(await cache.deviceChangeCount(device)).toBeNull();
  expect(cache.calls).toEqual([
    ["GET", "opencok:global:device-account-change:"],
    ["GET", "opencok:global:device-account-change:null"],
    ["GET", "opencok:global:device-account-change: "],
  ]);
});

test("recognized SQL failures return empty switches while non-SQL query exceptions remain unavailable", async () => {
  for (const sqlState of ["42P01", "42501", "57014", "XX000"]) {
    const { db, queries } = database({ failure: "switches", sqlState });
    expect(await readLoginSwitches(db)).toEqual([]);
    expect(queries).toHaveLength(1);
  }
  for (const sqlState of ["ETIMEDOUT", "bad", "42p01"]) {
    const { db } = database({ failure: "switches", sqlState });
    expect(await readLoginSwitches(db)).toBeUndefined();
  }
});
