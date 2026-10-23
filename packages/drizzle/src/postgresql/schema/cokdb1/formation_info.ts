// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const formation_info = cokdb1.table("formation_info", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "formation": legacyText("formation", {"sqlType":"character varying(1024)","collation":"legacy_meta.ci"}),
  "index1": integer("index1").notNull(),
  "customName": legacyText("customName", {"sqlType":"character varying(21)","collation":"legacy_meta.ci"}),
  "dragonFormation": legacyText("dragonFormation", {"sqlType":"character varying(300)","collation":"legacy_meta.ci"}),
  "heroFormation": legacyText("heroFormation", {"sqlType":"character varying(300)","collation":"legacy_meta.ci"}),
  "angelArmy": legacyText("angelArmy", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "formation_info_PRIMARY", columns: [table["uid"], table["index1"]] }),
  uniqueIndex("formation_info_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"index1\"")),
]);
