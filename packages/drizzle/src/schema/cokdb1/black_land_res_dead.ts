import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const black_land_res_dead = cokdb1.table("black_land_res_dead", {
  "id": varchar("id", { length: 40 }).notNull(),
  "areaId": integer("areaId").notNull(),
  "level": integer("level").notNull(),
  "deadFinishTime": bigint("deadFinishTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "black_land_res_dead_PRIMARY", columns: [table["id"]] }),
  index("black_land_res_dead_dead_res_time").on(sql.raw("\"deadFinishTime\"")),
  index("black_land_res_dead_areaId_index").on(sql.raw("\"areaId\"")),
]);
