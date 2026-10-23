import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const material_cost_record = cokdb1.table("material_cost_record", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "userId": varchar("userId", { length: 255 }).notNull(),
  "type": integer("type").notNull(),
  "param1": integer("param1"),
  "param2": integer("param2"),
  "original": bigint("original", { mode: "bigint" }).notNull(),
  "cost": integer("cost").notNull(),
  "remain": bigint("remain", { mode: "bigint" }).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "material_cost_record_PRIMARY", columns: [table["uid"]] }),
  index("material_cost_record_index_user").on(sql.raw("\"time\""), sql.raw("\"userId\""), sql.raw("\"type\"")),
  index("material_cost_record_index_type").on(sql.raw("\"userId\""), sql.raw("\"time\""), sql.raw("\"type\"")),
]);
