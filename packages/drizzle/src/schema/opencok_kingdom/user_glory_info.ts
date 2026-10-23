import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_glory_info = opencok_kingdom.table(
  "user_glory_info",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "strengthenCount": integer("strengthenCount").notNull(),
    "strengthenTime": bigint("strengthenTime", { mode: "bigint" }).notNull(),
    "expeditionVictoryTimes": integer("expeditionVictoryTimes").notNull().default(sql.raw("-1")),
    "weaknessTime": bigint("weaknessTime", { mode: "bigint" }),
  },
  (table) => [primaryKey({ name: "user_glory_info_PRIMARY", columns: [table["uid"]] })],
);
