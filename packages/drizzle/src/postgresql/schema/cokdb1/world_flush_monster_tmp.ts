// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";
export const world_flush_monster_tmp = cokdb1.table("world_flush_monster_tmp", {
  "id": integer("id").notNull(),
  "pointType": integer("pointType").notNull(),
  "flushTime": bigint("flushTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "world_flush_monster_tmp_PRIMARY", columns: [table["id"]] }),
]);
