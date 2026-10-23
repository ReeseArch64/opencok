// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const rob_general = cokdb1.table("rob_general", {
  "uid": legacyText("uid", {"sqlType":"character varying(96)","collation":"legacy_meta.ci"}),
  "serverid": integer("serverid"),
  "allianceid": legacyText("allianceid", {"sqlType":"character varying(96)","collation":"legacy_meta.ci"}),
  "alliancename": legacyText("alliancename", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "owneruid": legacyText("owneruid", {"sqlType":"character varying(96)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "ownername": legacyText("ownername", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "generalid": integer("generalid").notNull().default(sql.raw("0")),
  "robtime": bigint("robtime", { mode: "bigint" }),
  "freetime": bigint("freetime", { mode: "bigint" }),
  "optime": legacyText("optime", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "rob_general_PRIMARY", columns: [table["owneruid"], table["generalid"]] }),
  uniqueIndex("rob_general_PRIMARY_pad").on(sql.raw("rtrim(\"owneruid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"generalid\"")),
]);
