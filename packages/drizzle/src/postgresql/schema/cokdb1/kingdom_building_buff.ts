// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const kingdom_building_buff = cokdb1.table("kingdom_building_buff", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(36)","collation":"legacy_meta.ci"}).notNull(),
  "effect": integer("effect").notNull(),
  "value": legacyNumber("value", {"sqlType":"double precision"}),
  "expiretime": bigint("expiretime", { mode: "bigint" }),
  "reserve": bigint("reserve", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "kingdom_building_buff_PRIMARY", columns: [table["uuid"], table["effect"]] }),
  uniqueIndex("kingdom_building_buff_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"effect\"")),
  index("kingdom_building_buff_Index_itemid").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
