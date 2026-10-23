import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_new_recall_info = opencok_kingdom.table(
  "user_new_recall_info",
  {
    "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
    "type": integer("type"),
    "initTime": bigint("initTime", { mode: "bigint" }),
    "country": varchar("country", { length: 40 }),
    "catsleLv": integer("catsleLv"),
    "updateTime": bigint("updateTime", { mode: "bigint" }),
    "count": integer("count"),
    "extra": text("extra"),
  },
  (table) => [primaryKey({ name: "user_new_recall_info_PRIMARY", columns: [table["uid"]] })],
);
