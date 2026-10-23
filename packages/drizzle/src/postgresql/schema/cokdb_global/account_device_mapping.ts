// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const account_device_mapping = cokdb_global.table("account_device_mapping", {
  "gameUid": legacyText("gameUid", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "deviceId": legacyText("deviceId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type"),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "account_device_mapping_PRIMARY", columns: [table["gameUid"], table["deviceId"]] }),
  uniqueIndex("account_device_mapping_PRIMARY_pad").on(sql.raw("rtrim(\"gameUid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"deviceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
