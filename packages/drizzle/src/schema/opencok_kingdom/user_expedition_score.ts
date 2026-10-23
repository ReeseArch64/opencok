import { sql } from "drizzle-orm";
import { doublePrecision, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_expedition_score = opencok_kingdom.table("user_expedition_score", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "score": doublePrecision("score").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_expedition_score_PRIMARY", columns: [table["uid"]] }),
]);
