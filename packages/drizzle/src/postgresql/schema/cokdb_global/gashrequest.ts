// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const gashrequest = cokdb_global.table("gashrequest", {
  "tradeid": bigint("tradeid", { mode: "bigint" }).notNull(),
  "method": legacyText("method", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "orderinfo": legacyText("orderinfo", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "amount": integer("amount"),
  "trans": legacyBytes("trans"),
  "state": integer("state"),
}, (table) => [
  primaryKey({ name: "gashrequest_PRIMARY", columns: [table["tradeid"]] }),
  check("gashrequest_trans_length", sql.raw("octet_length(\"trans\") <= 65535")),
]);
