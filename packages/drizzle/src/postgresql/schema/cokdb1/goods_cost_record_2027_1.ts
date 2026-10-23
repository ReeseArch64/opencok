// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const goods_cost_record_2027_1 = cokdb1.table("goods_cost_record_2027_1", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "userId": legacyText("userId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": integer("itemId").notNull(),
  "type": integer("type"),
  "param1": integer("param1"),
  "param2": integer("param2"),
  "original": bigint("original", { mode: "bigint" }).notNull(),
  "cost": integer("cost").notNull(),
  "remain": bigint("remain", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "goods_cost_record_2027_1_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("goods_cost_record_2027_1_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("goods_cost_record_2027_1_index_type").on(sql.raw("\"type\"")),
  index("goods_cost_record_2027_1_index_time").on(sql.raw("\"time\"")),
  index("goods_cost_record_2027_1_index_time_user").on(sql.raw("\"time\""), sql.raw("rtrim(\"userId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"itemId\"")),
  index("goods_cost_record_2027_1_index_user_time").on(sql.raw("rtrim(\"userId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\"")),
]);
