// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const server_top_score = cokdb1.table("server_top_score", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "actId": legacyText("actId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "round": integer("round").default(sql.raw("0")),
  "score": integer("score").default(sql.raw("0")),
  "rank": integer("rank").default(sql.raw("0")),
  "name": legacyText("name", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "allianceAbbr": legacyText("allianceAbbr", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "allianceIcon": legacyText("allianceIcon", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "server_top_score_PRIMARY", columns: [table["uid"], table["actId"]] }),
  uniqueIndex("server_top_score_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"actId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
