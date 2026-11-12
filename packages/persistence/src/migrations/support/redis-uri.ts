import type { DataSource } from "typeorm";

export const migrationRedisUris = new WeakMap<DataSource, string>();
