// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const activation_device_record = cokdb_global.table("activation_device_record", {
  "code": legacyText("code", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "deviceId": legacyText("deviceId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "activation_device_record_PRIMARY", columns: [table["code"], table["deviceId"]] }),
  uniqueIndex("activation_device_record_PRIMARY_pad").on(sql.raw("rtrim(\"code\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"deviceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
