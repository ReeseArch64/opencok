import type { DataSource } from "typeorm";
import type { Connection } from "mongoose";
export const migrationMongoConnections = new WeakMap<DataSource, Connection>();
