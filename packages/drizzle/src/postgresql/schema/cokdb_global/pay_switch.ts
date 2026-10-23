// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const pay_switch = cokdb_global.table("pay_switch", {
  "Id": integer("Id").notNull(),
  "status": integer("status"),
  "time": legacyText("time", {"sqlType":"text","collation":"legacy_meta.ci"}),
});
