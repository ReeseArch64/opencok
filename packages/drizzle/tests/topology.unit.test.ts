import { expect, test } from "bun:test";
import { createDatabases, defaultDatabaseTopology } from "../src";
import { databasePoolConfig, validateTopology } from "../src/topology";

test("the default topology routes two kingdoms through one schema definition", async () => {
  const databases = createDatabases({ max: 1 });
  try {
    expect(databases.topology).toEqual({ globalDatabase: "opencok_global", kingdoms: [
      { id: 1, database: "opencok_kingdom_1" }, { id: 2, database: "opencok_kingdom_2" },
    ] });
    expect([...databases.kingdoms.keys()]).toEqual([1, 2]);
    expect(databases.global.pool.options.database).toBe("opencok_global");
    expect(databases.getKingdom(1).pool.options.database).toBe("opencok_kingdom_1");
    expect(databases.getKingdom(2).pool.options.database).toBe("opencok_kingdom_2");
    const first = databases.getKingdom(1).db.query.userprofile.findMany().toSQL().sql;
    const second = databases.getKingdom(2).db.query.userprofile.findMany().toSQL().sql;
    expect(first).toBe(second); expect(first).toContain('"opencok_kingdom"."userprofile"');
    expect(databases.getKingdom(1).pool.totalCount).toBe(0);
    expect(databases.getKingdom(2).pool.totalCount).toBe(0);
    expect(() => databases.getKingdom(3)).toThrow("not configured");
  } finally { await databases.close(); }
});

test("topology validation rejects duplicate IDs/databases and unsafe names before creating pools", () => {
  for (const kingdoms of [[], [{ id: 1, database: "opencok_global" }],
    [{ id: 1, database: "one" }, { id: 1, database: "two" }],
    [{ id: 1, database: "same" }, { id: 2, database: "same" }],
    [{ id: 0, database: "zero" }], [{ id: 1.5, database: "fraction" }],
    [{ id: 1, database: "postgres" }], [{ id: 1, database: 'injection";' }],
    [{ id: 1, database: "a".repeat(64) }]]) {
    expect(() => createDatabases({}, { globalDatabase: "opencok_global", kingdoms })).toThrow();
  }
  expect(() => validateTopology({ ...defaultDatabaseTopology, globalDatabase: "template0" })).toThrow();
});

test("URL routing preserves credentials/TLS and replaces the database path without mutating configuration", () => {
  const config = { connectionString: "postgresql://synthetic:placeholder@localhost:5432/postgres?sslmode=require&application_name=opencok", max: 3 };
  const result = databasePoolConfig(config, "opencok_kingdom_2");
  const url = new URL(result.connectionString!);
  expect(url.pathname).toBe("/opencok_kingdom_2"); expect(url.searchParams.get("sslmode")).toBe("require");
  expect(url.username).toBe("synthetic"); expect(url.password).toBe("placeholder");
  expect(result.max).toBe(3); expect(config.connectionString).toContain("/postgres?");
  expect(() => databasePoolConfig({ connectionString: "https://localhost/postgres" }, "opencok_global")).toThrow("Invalid PostgreSQL");
  expect(() => databasePoolConfig({ connectionString: "not-a-url" }, "opencok_global")).toThrow("Invalid PostgreSQL");
});
