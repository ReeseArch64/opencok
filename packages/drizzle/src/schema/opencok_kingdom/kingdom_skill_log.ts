import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const kingdom_skill_log = opencok_kingdom.table(
  "kingdom_skill_log",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "skillId": integer("skillId").notNull(),
    "logTime": bigint("logTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "kingdom_skill_log_PRIMARY", columns: [table["uid"], table["skillId"]] }),
  ],
);
