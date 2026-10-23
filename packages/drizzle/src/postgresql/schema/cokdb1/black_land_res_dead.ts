// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const black_land_res_dead = cokdb1.table("black_land_res_dead", {
  "id": legacyText("id", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "areaId": integer("areaId").notNull(),
  "level": integer("level").notNull(),
  "deadFinishTime": bigint("deadFinishTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "black_land_res_dead_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("black_land_res_dead_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("black_land_res_dead_dead_res_time").on(sql.raw("\"deadFinishTime\"")),
  index("black_land_res_dead_areaId_index").on(sql.raw("\"areaId\"")),
]);
