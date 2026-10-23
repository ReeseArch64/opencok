import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const stat_login2 = opencok_kingdom.table(
  "stat_login2",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
  },
  (table) => [primaryKey({ name: "stat_login2_PRIMARY", columns: [table["uid"]] })],
);
