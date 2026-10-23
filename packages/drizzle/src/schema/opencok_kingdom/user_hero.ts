import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_hero = opencok_kingdom.table("user_hero", {
  "ownerUid": varchar("ownerUid", { length: 40 }).notNull().default(sql.raw("''")),
  "heroUid": varchar("heroUid", { length: 40 }).notNull(),
  "heroState": integer("heroState").notNull().default(sql.raw("0")),
  "captureTime": bigint("captureTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "killTime": bigint("killTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "revivalTime": bigint("revivalTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "freeTime": bigint("freeTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "thrashTime": bigint("thrashTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "thrashNum": integer("thrashNum").notNull().default(sql.raw("0")),
  "captureCD": bigint("captureCD", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "killCD": bigint("killCD", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "thrashCD": bigint("thrashCD", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "revivalCD": bigint("revivalCD", { mode: "bigint" }).default(sql.raw("0")),
  "lastKillerUid": varchar("lastKillerUid", { length: 40 }).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "user_hero_PRIMARY", columns: [table["heroUid"]] }),
  index("user_hero_ownerUid_index").on(sql.raw("\"ownerUid\"")),
]);
