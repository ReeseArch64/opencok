// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const kingdom_building = cokdb1.table("kingdom_building", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(36)","collation":"legacy_meta.ci"}).notNull(),
  "itemid": integer("itemid"),
  "name": legacyText("name", {"sqlType":"character varying(64)","collation":"legacy_meta.ci"}),
  "worldid": integer("worldid"),
  "point": integer("point"),
  "level": integer("level"),
  "star": integer("star"),
  "progress": smallint("progress"),
  "creator": legacyText("creator", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}),
  "createtime": bigint("createtime", { mode: "bigint" }),
  "starttime": bigint("starttime", { mode: "bigint" }),
  "updatetime": bigint("updatetime", { mode: "bigint" }),
  "type": smallint("type"),
  "state": integer("state"),
  "skin": legacyText("skin", {"sqlType":"character varying(64)","collation":"legacy_meta.ci"}),
  "speed": legacyNumber("speed", {"sqlType":"numeric(20,10)"}),
  "maxdef": integer("maxdef"),
  "curdef": integer("curdef"),
  "owner": integer("owner"),
  "occupy": integer("occupy"),
  "reserve": bigint("reserve", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "kingdom_building_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("kingdom_building_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("kingdom_building_Index_itemid").on(sql.raw("\"itemid\"")),
  check("kingdom_building_progress_range", sql.raw("\"progress\" BETWEEN -128 AND 127")),
  check("kingdom_building_type_range", sql.raw("\"type\" BETWEEN -128 AND 127")),
]);
