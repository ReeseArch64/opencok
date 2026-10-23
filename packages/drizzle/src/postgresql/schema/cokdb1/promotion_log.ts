// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const promotion_log = cokdb1.table("promotion_log", {
  "channel": legacyText("channel", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "statId": legacyText("statId", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "exchangeId": legacyText("exchangeId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "adId": legacyText("adId", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "deviceType": integer("deviceType").default(sql.raw("0")),
  "showTime": bigint("showTime", { mode: "bigint" }),
  "buyTime": bigint("buyTime", { mode: "bigint" }),
  "state": integer("state").default(sql.raw("0")),
  "deviceid": legacyText("deviceid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "accountid": legacyText("accountid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "campaignid": legacyText("campaignid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "adgroupid": legacyText("adgroupid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "creativeid": legacyText("creativeid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "location": legacyText("location", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "promotion_log_PRIMARY", columns: [table["channel"], table["statId"], table["exchangeId"], table["uid"]] }),
  uniqueIndex("promotion_log_PRIMARY_pad").on(sql.raw("rtrim(\"channel\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"statId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"exchangeId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
