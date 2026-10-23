// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const ban_record = cokdb_global.table("ban_record", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "serverId": integer("serverId").notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "operator": legacyText("operator", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "reason": legacyText("reason", {"sqlType":"character varying(250)","collation":"legacy_meta.ci"}),
  "opDate": legacyText("opDate", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "ban_record_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("ban_record_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("ban_record_index_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
