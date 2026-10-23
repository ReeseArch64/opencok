// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const ad_building_attachment = cokdb1.table("ad_building_attachment", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(36)","collation":"legacy_meta.ci"}).notNull(),
  "serverid": integer("serverid"),
  "skillid": integer("skillid"),
  "cdtime": bigint("cdtime", { mode: "bigint" }),
  "skillstate": integer("skillstate"),
  "donateresource": legacyText("donateresource", {"sqlType":"character varying(300)","collation":"legacy_meta.ci"}),
}, (_table) => [
  uniqueIndex("ad_building_attachment_uss_index").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"serverid\""), sql.raw("\"skillid\"")),
]);
