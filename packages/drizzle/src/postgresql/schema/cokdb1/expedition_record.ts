// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const expedition_record = cokdb1.table("expedition_record", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "type": integer("type").notNull(),
  "targetServerName": legacyText("targetServerName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "targetServerId": integer("targetServerId").notNull(),
  "kingUid": legacyText("kingUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "kingUserName": legacyText("kingUserName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "expedition_record_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("expedition_record_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("expedition_record_time_index").on(sql.raw("\"time\"")),
]);
