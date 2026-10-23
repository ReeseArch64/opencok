// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const world_barbarion = cokdb1.table("world_barbarion", {
  "pointId": integer("pointId").notNull(),
  "configId": legacyText("configId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "lastArmyMapByteArray": legacyBytes("lastArmyMapByteArray"),
  "lastAwardArmyMapByteArray": legacyBytes("lastAwardArmyMapByteArray"),
  "lastBeAttackedTime": bigint("lastBeAttackedTime", { mode: "bigint" }).default(sql.raw("0")),
  "currentHP": integer("currentHP").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "world_barbarion_PRIMARY", columns: [table["pointId"]] }),
  check("world_barbarion_lastArmyMapByteArray_length", sql.raw("octet_length(\"lastArmyMapByteArray\") <= 65535")),
  check("world_barbarion_lastAwardArmyMapByteArray_length", sql.raw("octet_length(\"lastAwardArmyMapByteArray\") <= 65535")),
]);
