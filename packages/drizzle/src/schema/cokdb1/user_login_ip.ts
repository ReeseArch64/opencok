import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_login_ip = cokdb1.table("user_login_ip", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "ip": varchar("ip", { length: 40 }).notNull(),
  "count": integer("count"),
}, (table) => [
  primaryKey({ name: "user_login_ip_PRIMARY", columns: [table["uid"], table["ip"]] }),
  index("user_login_ip_index_uid_count").on(sql.raw("\"uid\""), sql.raw("\"count\"")),
]);
