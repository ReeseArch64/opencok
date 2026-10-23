import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const server_config = cokdb1.table("server_config", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "stat": integer("stat").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "server_config_PRIMARY", columns: [table["uid"]] }),
]);
