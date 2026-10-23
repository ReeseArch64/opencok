import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const treasure_map = cokdb1.table("treasure_map", {
  "uuid": varchar("uuid", { length: 40 }).notNull(),
  "treasureId": varchar("treasureId", { length: 40 }),
  "currentOwner": varchar("currentOwner", { length: 40 }),
  "originalOwner": varchar("originalOwner", { length: 40 }),
  "targetId": integer("targetId"),
  "time": integer("time"),
  "colour": integer("colour"),
  "marchId": varchar("marchId", { length: 40 }),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "finishTime": bigint("finishTime", { mode: "bigint" }),
  "state": integer("state"),
}, (table) => [
  primaryKey({ name: "treasure_map_PRIMARY", columns: [table["uuid"]] }),
  index("treasure_map_index_o_m").on(sql.raw("\"currentOwner\""), sql.raw("\"marchId\"")),
  index("treasure_map_index_o_t").on(sql.raw("\"currentOwner\""), sql.raw("\"targetId\"")),
  index("treasure_map_index_o_s_c").on(sql.raw("\"currentOwner\""), sql.raw("\"state\""), sql.raw("\"colour\"")),
]);
