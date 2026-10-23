// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";
export const fight_arena_info = cokdb1.table("fight_arena_info", {
  "worldId": integer("worldId").notNull(),
  "state": integer("state"),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "version": integer("version"),
}, (table) => [
  primaryKey({ name: "fight_arena_info_PRIMARY", columns: [table["worldId"]] }),
]);
