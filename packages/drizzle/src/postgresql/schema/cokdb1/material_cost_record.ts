// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const material_cost_record = cokdb1.table("material_cost_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "userId": legacyText("userId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull(),
  "param1": integer("param1"),
  "param2": integer("param2"),
  "original": bigint("original", { mode: "bigint" }).notNull(),
  "cost": integer("cost").notNull(),
  "remain": bigint("remain", { mode: "bigint" }).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "material_cost_record_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("material_cost_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("material_cost_record_index_user").on(sql.raw("\"time\""), sql.raw("rtrim(\"userId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
  index("material_cost_record_index_type").on(sql.raw("rtrim(\"userId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\""), sql.raw("\"type\"")),
]);
