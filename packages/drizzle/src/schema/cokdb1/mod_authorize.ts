import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const mod_authorize = cokdb1.table("mod_authorize", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "authorize": integer("authorize").default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "mod_authorize_PRIMARY", columns: [table["uid"]] }),
]);
