import type { PoolConfig } from "pg";

export interface KingdomDatabase {
  readonly id: number;
  readonly database: string;
}
export interface DatabaseTopology {
  readonly globalDatabase: string;
  readonly kingdoms: readonly KingdomDatabase[];
}

export const defaultDatabaseTopology: DatabaseTopology = Object.freeze({
  globalDatabase: "opencok_global",
  kingdoms: Object.freeze([
    Object.freeze({ id: 1, database: "opencok_kingdom_1" }),
    Object.freeze({ id: 2, database: "opencok_kingdom_2" }),
  ]),
});

function validateName(name: string) {
  if (
    typeof name !== "string" ||
    !/^[a-z][a-z0-9_]*$/.test(name) ||
    Buffer.byteLength(name) > 63 ||
    ["postgres", "template0", "template1"].includes(name) ||
    name.startsWith("pg_")
  ) {
    throw new Error("Invalid application database name");
  }
}

export function validateTopology(topology: DatabaseTopology): DatabaseTopology {
  validateName(topology.globalDatabase);
  if (!Array.isArray(topology.kingdoms) || topology.kingdoms.length === 0)
    throw new Error("Configure at least one kingdom");
  const ids = new Set<number>(),
    names = new Set([topology.globalDatabase]);
  const kingdoms = topology.kingdoms.map(({ id, database }) => {
    if (!Number.isSafeInteger(id) || id < 1 || ids.has(id))
      throw new Error("Kingdom IDs must be unique positive safe integers");
    validateName(database);
    if (names.has(database)) throw new Error("Each kingdom requires a distinct physical database");
    ids.add(id);
    names.add(database);
    return Object.freeze({ id, database });
  });
  return Object.freeze({
    globalDatabase: topology.globalDatabase,
    kingdoms: Object.freeze(kingdoms),
  });
}

export function databasePoolConfig(config: PoolConfig, database: string): PoolConfig {
  validateName(database);
  if (!config.connectionString) return { ...config, database };
  let url: URL;
  try {
    url = new URL(config.connectionString);
  } catch {
    throw new Error("Invalid PostgreSQL connection URL");
  }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:")
    throw new Error("Invalid PostgreSQL connection URL");
  url.pathname = `/${database}`;
  url.searchParams.delete("database");
  return { ...config, database, connectionString: url.toString() };
}
