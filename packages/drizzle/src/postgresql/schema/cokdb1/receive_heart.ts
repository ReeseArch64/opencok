// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const receive_heart = cokdb1.table("receive_heart", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "duration": integer("duration").notNull(),
  "effecttype": legacyText("effecttype", {"sqlType":"character varying(2)","collation":"legacy_meta.ci"}).notNull(),
  "senduid": legacyText("senduid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
});
