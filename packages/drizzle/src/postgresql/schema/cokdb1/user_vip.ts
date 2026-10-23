// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_vip = cokdb1.table("user_vip", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "score": integer("score").notNull(),
  "level": integer("level").notNull().default(sql.raw("-1")),
  "loginDays": integer("loginDays").notNull(),
  "lastLoginTime": bigint("lastLoginTime", { mode: "bigint" }).notNull(),
  "vipEndTime": bigint("vipEndTime", { mode: "bigint" }).notNull(),
  "sPoint": integer("sPoint").notNull().default(sql.raw("0")),
  "sLevel": integer("sLevel").notNull().default(sql.raw("0")),
  "vip_switch": integer("vip_switch").notNull().default(sql.raw("1")),
  "shop_level": integer("shop_level").notNull().default(sql.raw("0")),
  "shop_exp": integer("shop_exp").notNull().default(sql.raw("0")),
  "svip_level": smallint("svip_level"),
}, (table) => [
  primaryKey({ name: "user_vip_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_vip_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_vip_svip_level_range", sql.raw("\"svip_level\" BETWEEN -128 AND 127")),
]);
