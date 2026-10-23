import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const egg_activity = opencok_kingdom.table(
  "egg_activity",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "curEgg": varchar("curEgg", { length: 10 }).notNull(),
    "eggCd": bigint("eggCd", { mode: "bigint" }).default(sql.raw("0")),
    "exp": integer("exp").default(sql.raw("0")),
    "curExpStage": integer("curExpStage").default(sql.raw("0")),
  },
  (table) => [primaryKey({ name: "egg_activity_PRIMARY", columns: [table["uid"]] })],
);
