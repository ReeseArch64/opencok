import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const military_cost_record = cokdb1.table("military_cost_record", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "userId": varchar("userId", { length: 255 }).notNull(),
  "type": integer("type").notNull(),
  "param1": varchar("param1", { length: 255 }).notNull().default(sql.raw("''")),
  "param2": varchar("param2", { length: 255 }).notNull().default(sql.raw("''")),
  "original": bigint("original", { mode: "bigint" }).notNull(),
  "cost": integer("cost").notNull(),
  "remain": bigint("remain", { mode: "bigint" }).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "military_cost_record_PRIMARY", columns: [table["uid"]] }),
  index("military_cost_record_index_user").on(sql.raw("\"time\""), sql.raw("\"userId\""), sql.raw("\"type\"")),
  index("military_cost_record_index_type").on(sql.raw("\"userId\""), sql.raw("\"time\""), sql.raw("\"type\"")),
]);
