import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const activation = cokdb1.table("activation", {
  "code": varchar("code", { length: 40 }).notNull(),
  "series": integer("series"),
  "user": varchar("user", { length: 40 }),
  "state": integer("state").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "activation_PRIMARY", columns: [table["code"]] }),
  index("activation_index_user").on(sql.raw("\"user\"")),
]);
