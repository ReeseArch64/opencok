import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const tree_award = opencok_kingdom.table("tree_award", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "freeCount": integer("freeCount").notNull(),
  "awardCount": integer("awardCount").notNull(),
  "lastFreeTime": bigint("lastFreeTime", { mode: "bigint" }).notNull(),
  "lastAwardTime": bigint("lastAwardTime", { mode: "bigint" }).notNull(),
  "awardMaxCount": integer("awardMaxCount").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "tree_award_PRIMARY", columns: [table["uid"]] }),
]);
