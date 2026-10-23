import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const affairs_value = opencok_kingdom.table("affairs_value", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "people": integer("people").notNull().default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).notNull(),
  "leagueTime": bigint("leagueTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "affairs_value_PRIMARY", columns: [table["uid"]] }),
]);
