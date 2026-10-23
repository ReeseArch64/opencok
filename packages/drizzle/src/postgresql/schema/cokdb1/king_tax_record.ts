// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const king_tax_record = cokdb1.table("king_tax_record", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "taxTime": bigint("taxTime", { mode: "bigint" }).default(sql.raw("0")),
  "type": integer("type").default(sql.raw("0")),
  "targetServerName": legacyText("targetServerName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "targetServerId": integer("targetServerId").default(sql.raw("0")),
  "wood": bigint("wood", { mode: "bigint" }).default(sql.raw("0")),
  "food": bigint("food", { mode: "bigint" }).default(sql.raw("0")),
  "iron": bigint("iron", { mode: "bigint" }).default(sql.raw("0")),
  "stone": bigint("stone", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "king_tax_record_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("king_tax_record_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("king_tax_record_time_index").on(sql.raw("\"taxTime\"")),
]);
