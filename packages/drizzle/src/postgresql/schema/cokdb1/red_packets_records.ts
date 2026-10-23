// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const red_packets_records = cokdb1.table("red_packets_records", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "player": legacyText("player", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "pic": legacyText("pic", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "picVer": integer("picVer").default(sql.raw("0")),
  "value": integer("value").default(sql.raw("0")),
  "getTime": bigint("getTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "red_packets_records_PRIMARY", columns: [table["uid"], table["player"]] }),
  uniqueIndex("red_packets_records_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\""), sql.raw("rtrim(\"player\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("red_packets_records_index_player").on(sql.raw("rtrim(\"player\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
