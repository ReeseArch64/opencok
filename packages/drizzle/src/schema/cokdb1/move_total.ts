import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const move_total = cokdb1.table("move_total", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "total": integer("total").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "move_total_PRIMARY", columns: [table["uid"]] }),
]);
