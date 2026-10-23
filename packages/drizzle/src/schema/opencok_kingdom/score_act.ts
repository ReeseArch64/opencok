import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const score_act = opencok_kingdom.table("score_act", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "actId": varchar("actId", { length: 40 }).notNull(),
  "level": integer("level"),
  "score": integer("score").notNull().default(sql.raw("0")),
  "finishFlag": integer("finishFlag").default(sql.raw("0")),
  "rewardFlag": varchar("rewardFlag", { length: 255 }),
}, (table) => [
  primaryKey({ name: "score_act_PRIMARY", columns: [table["uid"], table["actId"]] }),
  index("score_act_actId_idx").on(sql.raw("\"actId\"")),
]);
