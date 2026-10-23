import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const username = cokdb1.table("username", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "people": integer("people").notNull().default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).notNull(),
  "leagueTime": bigint("leagueTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "username_PRIMARY", columns: [table["uid"]] }),
]);
