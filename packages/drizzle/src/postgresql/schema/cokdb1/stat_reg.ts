// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const stat_reg = cokdb1.table("stat_reg", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "pf": legacyText("pf", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "pfId": legacyText("pfId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "referrer": legacyBytes("referrer"),
  "country": legacyText("country", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "ip": legacyText("ip", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "ipcountry": legacyText("ipcountry", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "linkname": legacyText("linkname", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "curip": legacyText("curip", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "stat_reg_PRIMARY", columns: [table["uid"], table["type"]] }),
  uniqueIndex("stat_reg_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
  index("stat_reg_index_time_pf_country").on(sql.raw("\"time\""), sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"country\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("stat_reg_country_index").on(sql.raw("rtrim(\"country\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("stat_reg_referrer_length", sql.raw("octet_length(\"referrer\") <= 65535")),
]);
