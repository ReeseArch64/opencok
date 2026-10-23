import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const world_flush_monster_tmp = opencok_kingdom.table(
  "world_flush_monster_tmp",
  {
    "id": integer("id").notNull(),
    "pointType": integer("pointType").notNull(),
    "flushTime": bigint("flushTime", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [primaryKey({ name: "world_flush_monster_tmp_PRIMARY", columns: [table["id"]] })],
);
