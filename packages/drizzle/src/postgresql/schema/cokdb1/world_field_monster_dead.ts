// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const world_field_monster_dead = cokdb1.table("world_field_monster_dead", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "id": integer("id").notNull(),
  "monster": legacyText("monster", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "deadFinishTime": bigint("deadFinishTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "world_field_monster_dead_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("world_field_monster_dead_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("world_field_monster_dead_dead_monster_time").on(sql.raw("\"deadFinishTime\"")),
]);
