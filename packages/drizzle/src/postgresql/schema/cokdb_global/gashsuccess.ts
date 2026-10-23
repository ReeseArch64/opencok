// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const gashsuccess = cokdb_global.table("gashsuccess", {
  "tradeid": bigint("tradeid", { mode: "bigint" }).notNull(),
  "finishTime": bigint("finishTime", { mode: "bigint" }).notNull(),
  "type": legacyText("type", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "confirm": integer("confirm").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "gashsuccess_PRIMARY", columns: [table["tradeid"]] }),
]);
