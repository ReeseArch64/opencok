// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const king_allot_tax_record = cokdb1.table("king_allot_tax_record", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "kingUid": legacyText("kingUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "kingName": legacyText("kingName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "toUid": legacyText("toUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "toUserName": legacyText("toUserName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "wood": bigint("wood", { mode: "bigint" }).default(sql.raw("0")),
  "food": bigint("food", { mode: "bigint" }).default(sql.raw("0")),
  "iron": bigint("iron", { mode: "bigint" }).default(sql.raw("0")),
  "stone": bigint("stone", { mode: "bigint" }).default(sql.raw("0")),
  "sendTime": bigint("sendTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "king_allot_tax_record_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("king_allot_tax_record_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("king_allot_tax_record_time_index").on(sql.raw("\"sendTime\"")),
]);
