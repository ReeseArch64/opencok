// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const mycardrequest = cokdb_global.table("mycardrequest", {
  "factradeseq": legacyText("factradeseq", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "authcode": legacyText("authcode", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "method": legacyText("method", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "methodparam": legacyText("methodparam", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "tradeseq": legacyText("tradeseq", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "orderInfo": legacyText("orderInfo", {"sqlType":"character varying(300)","collation":"legacy_meta.ci"}).notNull(),
  "amount": integer("amount").notNull(),
  "state": integer("state").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "mycardrequest_PRIMARY", columns: [table["factradeseq"]] }),
  uniqueIndex("mycardrequest_PRIMARY_pad").on(sql.raw("rtrim(\"factradeseq\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
