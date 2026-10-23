// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const vip_box_turntable = cokdb1.table("vip_box_turntable", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "vip": integer("vip").notNull(),
  "itemidlist": legacyText("itemidlist", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "tableid": integer("tableid").notNull(),
  "openCount": bigint("openCount", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "stepNum": integer("stepNum").notNull().default(sql.raw("0")),
  "free": integer("free").notNull().default(sql.raw("0")),
  "rewardTime": bigint("rewardTime", { mode: "bigint" }).default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "vip_box_turntable_PRIMARY", columns: [table["uid"], table["vip"]] }),
  uniqueIndex("vip_box_turntable_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"vip\"")),
]);
