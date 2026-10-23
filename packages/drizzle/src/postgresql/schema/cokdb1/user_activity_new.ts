// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_activity_new = cokdb1.table("user_activity_new", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "actId": integer("actId").notNull(),
  "level": integer("level").notNull(),
  "rewards": legacyText("rewards", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}).notNull(),
  "updateTime": bigint("updateTime", { mode: "bigint" }).notNull(),
  "reserve_1": integer("reserve_1").notNull(),
  "reserve_2": legacyText("reserve_2", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}).notNull(),
  "flushTimes": integer("flushTimes").default(sql.raw("0")),
  "flushDate": bigint("flushDate", { mode: "bigint" }).default(sql.raw("0")),
  "receiveLevels": legacyText("receiveLevels", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "user_activity_new_PRIMARY", columns: [table["uid"], table["actId"]] }),
  uniqueIndex("user_activity_new_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"actId\"")),
]);
