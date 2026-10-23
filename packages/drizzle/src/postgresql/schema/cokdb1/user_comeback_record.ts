// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_comeback_record = cokdb1.table("user_comeback_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "deviceId": legacyText("deviceId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "configId": legacyText("configId", {"sqlType":"character varying(11)","collation":"legacy_meta.ci"}).notNull(),
  "backType": integer("backType").notNull().default(sql.raw("0")),
  "backTime": bigint("backTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "backReward": smallint("backReward").notNull().default(sql.raw("0")),
  "dailyReward": legacyText("dailyReward", {"sqlType":"character varying(30)","collation":"legacy_meta.ci"}),
  "payReward": legacyText("payReward", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "payTotal": bigint("payTotal", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_comeback_record_PRIMARY", columns: [table["uid"], table["configId"]] }),
  uniqueIndex("user_comeback_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"configId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_comeback_record_backReward_range", sql.raw("\"backReward\" BETWEEN -128 AND 127")),
]);
