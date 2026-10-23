// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const fastcarryhelp = cokdb1.table("fastcarryhelp", {
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "maxcount": integer("maxcount").notNull().default(sql.raw("0")),
  "nowcount": integer("nowcount").notNull().default(sql.raw("0")),
  "helpers": legacyText("helpers", {"sqlType":"character varying(2048)","collation":"legacy_meta.ci"}),
  "updatetime": bigint("updatetime", { mode: "bigint" }).notNull(),
  "progress": integer("progress").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "fastcarryhelp_PRIMARY", columns: [table["allianceId"], table["uid"]] }),
  uniqueIndex("fastcarryhelp_PRIMARY_pad").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
