// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const payfive = cokdb_pay.table("payfive", {
  "date": legacyText("date", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "pf": legacyText("pf", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "country": legacyText("country", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "paysum": legacyNumber("paysum", {"sqlType":"numeric(20,2)"}),
  "paytimes": integer("paytimes"),
}, (table) => [
  primaryKey({ name: "payfive_PRIMARY", columns: [table["date"], table["pf"], table["country"]] }),
  uniqueIndex("payfive_PRIMARY_pad").on(sql.raw("rtrim(\"date\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"country\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("payfive_index").on(sql.raw("rtrim(\"country\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
