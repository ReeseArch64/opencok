import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb1 } from "../namespaces";

export const world_barbarion = cokdb1.table("world_barbarion", {
  "pointId": integer("pointId").notNull(),
  "configId": varchar("configId", { length: 255 }).notNull(),
  "lastArmyMapByteArray": bytea("lastArmyMapByteArray"),
  "lastAwardArmyMapByteArray": bytea("lastAwardArmyMapByteArray"),
  "lastBeAttackedTime": bigint("lastBeAttackedTime", { mode: "bigint" }).default(sql.raw("0")),
  "currentHP": integer("currentHP").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "world_barbarion_PRIMARY", columns: [table["pointId"]] }),
  check("world_barbarion_lastArmyMapByteArray_length", sql.raw("octet_length(\"lastArmyMapByteArray\") <= 65535")),
  check("world_barbarion_lastAwardArmyMapByteArray_length", sql.raw("octet_length(\"lastAwardArmyMapByteArray\") <= 65535")),
]);
