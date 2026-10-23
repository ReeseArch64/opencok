import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const affairs = cokdb1.table("affairs", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "type": integer("type").notNull(),
  "ownerId": varchar("ownerId", { length: 40 }).notNull(),
  "affairId": varchar("affairId", { length: 20 }).notNull(),
  "contentsId": varchar("contentsId", { length: 20 }).notNull(),
  "rewardTime": bigint("rewardTime", { mode: "bigint" }).notNull(),
  "rewardNum": integer("rewardNum").notNull(),
  "opt": integer("opt").notNull(),
}, (table) => [
  primaryKey({ name: "affairs_PRIMARY", columns: [table["uid"]] }),
  index("affairs_index_type").on(sql.raw("\"type\""), sql.raw("\"rewardTime\"")),
]);
