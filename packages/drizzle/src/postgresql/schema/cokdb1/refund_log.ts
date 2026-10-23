// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const refund_log = cokdb1.table("refund_log", {
  "refundId": legacyText("refundId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "order": integer("order").notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "userId": legacyText("userId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type"),
  "itemId": legacyText("itemId", {"sqlType":"character varying(16)","collation":"legacy_meta.ci"}).notNull(),
  "original": bigint("original", { mode: "bigint" }).notNull(),
  "cost": integer("cost").notNull(),
  "remain": bigint("remain", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "refund_log_PRIMARY", columns: [table["refundId"], table["order"]] }),
  uniqueIndex("refund_log_PRIMARY_pad").on(sql.raw("rtrim(\"refundId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"order\"")),
  index("refund_log_index_time").on(sql.raw("\"time\""), sql.raw("rtrim(\"userId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\""), sql.raw("rtrim(\"itemId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("refund_log_index_user").on(sql.raw("rtrim(\"userId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\"")),
]);
