import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const activity_monster = opencok_kingdom.table("activity_monster", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "id": integer("id").notNull(),
  "flushTime": bigint("flushTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "activity_monster_PRIMARY", columns: [table["uid"], table["id"], table["flushTime"]] }),
]);
