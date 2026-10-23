// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const pay_lottery = cokdb_global.table("pay_lottery", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "remainGold": integer("remainGold"),
  "startTime": integer("startTime"),
  "endTime": integer("endTime"),
  "count": legacyText("count", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
});
