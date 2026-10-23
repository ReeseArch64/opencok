// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const dragon_tower_buff = cokdb1.table("dragon_tower_buff", {
  "uid": legacyText("uid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}).notNull(),
  "buffid": integer("buffid").notNull(),
  "remainlayers": integer("remainlayers"),
  "buytime": bigint("buytime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "dragon_tower_buff_PRIMARY", columns: [table["uid"], table["buffid"]] }),
  uniqueIndex("dragon_tower_buff_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"buffid\"")),
  index("dragon_tower_buff_Index_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
