import { drizzle } from "drizzle-orm/node-postgres";
import { getTableName, is, Table } from "drizzle-orm";
import { Pool, type PoolConfig } from "pg";
import { observePostgresClient } from "./observed-client";
import { logEvent } from "@opencok/core/logging";
import { observeTransaction } from "@opencok/core/transaction";
import type { DatabaseRole } from "./roles";
import * as globalSchema from "./schema/global";
import * as kingdomSchema from "./schema/kingdom";
import {
  databasePoolConfig,
  defaultDatabaseTopology,
  validateTopology,
  type DatabaseTopology,
} from "./topology";

const schemas = { global: globalSchema, kingdom: kingdomSchema };

export function createDatabase<T extends DatabaseRole>(role: T, config: PoolConfig) {
  if (role !== "global" && role !== "kingdom") {throw new Error("Unknown database role");}

  const pool = new Pool({ ...config, options: `${config.options ?? ""} -c timezone=UTC` });
  const tables = new Set(
    Object.values(schemas[role])
      .filter((value) => is(value, Table))
      .map((table) => getTableName(table)),
  );
  pool.on("connect", (client) => {
    observePostgresClient(client, role, tables);
    logEvent("database_connected", {
      component: "postgresql",
      databaseRole: role,
      outcome: "success",
    });
  });
  pool.on("error", () =>
    logEvent(
      "database_pool_failed",
      { component: "postgresql", databaseRole: role, outcome: "failure" },
      "error",
    ),
  );
  const db = drizzle(pool, { schema: schemas[role] });
  const transaction = db.transaction.bind(db);
  const observeSavepoints = (tx: Parameters<Parameters<typeof transaction>[0]>[0]) => {
    const savepoint = tx.transaction.bind(tx);
    tx.transaction = (apply) =>
      observeTransaction(`postgresql.${role}.savepoint`, () =>
        savepoint((inner) => {
          observeSavepoints(inner);
          return apply(inner);
        }),
      );
  };
  db.transaction = (apply, settings) =>
    observeTransaction(`postgresql.${role}.transaction`, () =>
      transaction((tx) => {
        observeSavepoints(tx);
        return apply(tx);
      }, settings),
    );

  return { role, db, pool, close: () => pool.end() };
}

export function createDatabases(
  config: PoolConfig,
  topology: DatabaseTopology = defaultDatabaseTopology,
) {
  const resolved = validateTopology(topology);

  const globalConfig = databasePoolConfig(config, resolved.globalDatabase);
  const kingdomConfigs = resolved.kingdoms.map((kingdom) => ({
    ...kingdom,
    config: databasePoolConfig(config, kingdom.database),
  }));
  const global = createDatabase("global", globalConfig);
  const kingdoms = new Map(
    kingdomConfigs.map((kingdom) => [kingdom.id, createDatabase("kingdom", kingdom.config)]),
  );

  return {
    topology: resolved,
    global,
    kingdoms: kingdoms as ReadonlyMap<number, ReturnType<typeof createDatabase<"kingdom">>>,
    getKingdom(id: number) {
      const kingdom = kingdoms.get(id);

      if (!kingdom) {throw new Error("Kingdom is not configured");}

      return kingdom;
    },
    close: () =>
      Promise.all([
        global.close(),
        ...[...kingdoms.values()].map((kingdom) => kingdom.close()),
      ]).then(() => undefined),
  };
}
