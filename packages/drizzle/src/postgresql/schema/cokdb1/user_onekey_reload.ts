// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_onekey_reload = cokdb1.table("user_onekey_reload", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "generalId": legacyText("generalId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "equip_list": legacyText("equip_list", {"sqlType":"character varying(2048)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "talentPoint": integer("talentPoint").notNull().default(sql.raw("0")),
  "talent": legacyText("talent", {"sqlType":"character varying(5120)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "dragon_stone_rhyme": legacyText("dragon_stone_rhyme", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "user_onekey_reload_PRIMARY", columns: [table["uid"], table["generalId"], table["type"]] }),
  uniqueIndex("user_onekey_reload_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"generalId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
]);
