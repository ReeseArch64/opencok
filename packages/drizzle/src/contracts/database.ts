import type { createDatabase, createDatabases } from "../client";
import type { DatabaseRole } from "../roles";

export type DatabaseConnection<Role extends DatabaseRole> = ReturnType<typeof createDatabase<Role>>;

export type DatabaseClient<Role extends DatabaseRole> = DatabaseConnection<Role>["db"];

export type DatabaseConnections = ReturnType<typeof createDatabases>;
