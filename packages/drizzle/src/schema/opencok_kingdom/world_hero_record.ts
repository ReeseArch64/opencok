import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const world_hero_record = opencok_kingdom.table("world_hero_record", {
  "heroUid": varchar("heroUid", { length: 40 }).notNull(),
  "heroFreeTime": bigint("heroFreeTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "world_hero_record_PRIMARY", columns: [table["heroUid"]] }),
]);
