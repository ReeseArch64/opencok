import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_thumbup = cokdb1.table("user_thumbup", {
  "uid": varchar("uid", { length: 50 }).notNull(),
  "type": integer("type").notNull(),
  "para1": varchar("para1", { length: 50 }).notNull(),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_thumbup_PRIMARY", columns: [table["uid"], table["type"], table["para1"]] }),
  index("user_thumbup_type").on(sql.raw("\"type\"")),
]);
