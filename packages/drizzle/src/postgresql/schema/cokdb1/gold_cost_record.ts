// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const gold_cost_record = cokdb1.table("gold_cost_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "userId": legacyText("userId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "goldType": integer("goldType"),
  "type": integer("type").notNull(),
  "param1": integer("param1"),
  "param2": integer("param2"),
  "originalGold": bigint("originalGold", { mode: "bigint" }).notNull(),
  "cost": integer("cost").notNull(),
  "remainGold": bigint("remainGold", { mode: "bigint" }).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "gold_cost_record_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("gold_cost_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("gold_cost_record_index_user").on(sql.raw("\"time\""), sql.raw("rtrim(\"userId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
  index("gold_cost_record_index_type").on(sql.raw("rtrim(\"userId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\""), sql.raw("\"type\"")),
  index("gold_cost_record_index_goldType").on(sql.raw("\"goldType\"")),
]);
