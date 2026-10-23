import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const vip_box_turntable = cokdb1.table("vip_box_turntable", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "vip": integer("vip").notNull(),
  "itemidlist": varchar("itemidlist", { length: 255 }).notNull().default(sql.raw("''")),
  "tableid": integer("tableid").notNull(),
  "openCount": bigint("openCount", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "stepNum": integer("stepNum").notNull().default(sql.raw("0")),
  "free": integer("free").notNull().default(sql.raw("0")),
  "rewardTime": bigint("rewardTime", { mode: "bigint" }).default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "vip_box_turntable_PRIMARY", columns: [table["uid"], table["vip"]] }),
]);
