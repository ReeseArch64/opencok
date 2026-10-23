// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const mycardsuccess = cokdb_global.table("mycardsuccess", {
  "tradeseq": legacyText("tradeseq", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "mycardid": legacyText("mycardid", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "type": legacyText("type", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "fulldata": legacyBytes("fulldata").notNull(),
  "state": integer("state").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "mycardsuccess_PRIMARY", columns: [table["tradeseq"]] }),
  uniqueIndex("mycardsuccess_PRIMARY_pad").on(sql.raw("rtrim(\"tradeseq\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("mycardsuccess_index_time").on(sql.raw("\"time\"")),
  index("mycardsuccess_index_mycardid").on(sql.raw("rtrim(\"mycardid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("mycardsuccess_fulldata_length", sql.raw("octet_length(\"fulldata\") <= 65535")),
]);
