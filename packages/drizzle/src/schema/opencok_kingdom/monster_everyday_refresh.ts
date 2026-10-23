import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const monster_everyday_refresh = opencok_kingdom.table(
  "monster_everyday_refresh",
  {
    "monster_id": varchar("monster_id", { length: 255 }).notNull().default(sql.raw("''")),
    "monster_num": integer("monster_num"),
    "refreshtime": bigint("refreshtime", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({ name: "monster_everyday_refresh_PRIMARY", columns: [table["monster_id"]] }),
  ],
);
