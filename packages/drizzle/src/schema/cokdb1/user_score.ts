import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_score = cokdb1.table("user_score", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "actId": varchar("actId", { length: 40 }).notNull(),
  "round": integer("round").default(sql.raw("1")),
  "level": integer("level").default(sql.raw("1")),
  "score": integer("score").default(sql.raw("0")),
  "reward": integer("reward").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_score_PRIMARY", columns: [table["uid"], table["actId"]] }),
  index("user_score_index_actId").on(sql.raw("\"actId\"")),
]);
