// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const addata = cokdb_global.table("addata", {
  "device": legacyText("device", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "tracker": legacyText("tracker", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "country": legacyText("country", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "data": legacyBytes("data"),
}, (table) => [
  primaryKey({ name: "addata_PRIMARY", columns: [table["device"]] }),
  uniqueIndex("addata_PRIMARY_pad").on(sql.raw("rtrim(\"device\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("addata_index_time_tracker_country").on(sql.raw("\"time\""), sql.raw("rtrim(\"tracker\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"country\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("addata_data_length", sql.raw("octet_length(\"data\") <= 65535")),
]);
