import { sql } from "drizzle-orm";
import { doublePrecision, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const new_user_score = opencok_kingdom.table(
  "new_user_score",
  {
    "uuid": varchar("uuid", { length: 255 }).notNull(),
    "uid": varchar("uid", { length: 255 }),
    "score": doublePrecision("score").notNull(),
    "takeReward": varchar("takeReward", { length: 500 }),
    "rankingrewardstage": varchar("rankingrewardstage", { length: 300 }).default(sql.raw("''")),
    "kingdomrewardstage": varchar("kingdomrewardstage", { length: 300 }).default(sql.raw("''")),
    "stage": integer("stage").default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "new_user_score_PRIMARY", columns: [table["uuid"]] }),
    index("new_user_score_uid_idx").on(sql.raw('"uid"')),
    index("new_user_score_uid_stage_index").on(sql.raw('"uid"'), sql.raw('"stage"')),
  ],
);
