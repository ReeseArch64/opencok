import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const server_transfer = cokdb1.table("server_transfer", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "cdTime": bigint("cdTime", { mode: "bigint" }),
  "transferTime": bigint("transferTime", { mode: "bigint" }),
  "times": integer("times"),
  "beforeServers": varchar("beforeServers", { length: 255 }).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "server_transfer_PRIMARY", columns: [table["uid"]] }),
]);
