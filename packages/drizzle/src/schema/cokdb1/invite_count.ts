import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const invite_count = cokdb1.table("invite_count", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "count": integer("count").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "invite_count_PRIMARY", columns: [table["uid"]] }),
]);
