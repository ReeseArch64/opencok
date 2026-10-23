// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const exchange = cokdb_global.table("exchange", {
  "orderId": legacyText("orderId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "pf": legacyText("pf", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
});
