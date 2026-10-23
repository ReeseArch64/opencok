import { sql } from "drizzle-orm";
import { bigint, check, index, integer, numeric, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const kingdom_building = cokdb1.table("kingdom_building", {
  "uuid": varchar("uuid", { length: 36 }).notNull(),
  "itemid": integer("itemid"),
  "name": varchar("name", { length: 64 }),
  "worldid": integer("worldid"),
  "point": integer("point"),
  "level": integer("level"),
  "star": integer("star"),
  "progress": smallint("progress"),
  "creator": varchar("creator", { length: 32 }),
  "createtime": bigint("createtime", { mode: "bigint" }),
  "starttime": bigint("starttime", { mode: "bigint" }),
  "updatetime": bigint("updatetime", { mode: "bigint" }),
  "type": smallint("type"),
  "state": integer("state"),
  "skin": varchar("skin", { length: 64 }),
  "speed": numeric("speed", { precision: 20, scale: 10, mode: "number" }),
  "maxdef": integer("maxdef"),
  "curdef": integer("curdef"),
  "owner": integer("owner"),
  "occupy": integer("occupy"),
  "reserve": bigint("reserve", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "kingdom_building_PRIMARY", columns: [table["uuid"]] }),
  index("kingdom_building_Index_itemid").on(sql.raw("\"itemid\"")),
  check("kingdom_building_progress_range", sql.raw("\"progress\" BETWEEN -128 AND 127")),
  check("kingdom_building_type_range", sql.raw("\"type\" BETWEEN -128 AND 127")),
]);
