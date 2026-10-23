// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const stat_af = cokdb1.table("stat_af", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "afuid": legacyText("afuid", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "device": legacyText("device", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "country": legacyText("country", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "channel": legacyText("channel", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "campain": legacyText("campain", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "fulldata": legacyBytes("fulldata"),
}, (table) => [
  primaryKey({ name: "stat_af_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("stat_af_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("stat_af_index_af").on(sql.raw("rtrim(\"afuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("stat_af_index_query").on(sql.raw("rtrim(\"device\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"country\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"channel\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"campain\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("stat_af_fulldata_length", sql.raw("octet_length(\"fulldata\") <= 65535")),
]);
