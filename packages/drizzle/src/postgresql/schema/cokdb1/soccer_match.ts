// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const soccer_match = cokdb1.table("soccer_match", {
  "id": legacyText("id", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "vs": legacyText("vs", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "idx": integer("idx"),
  "winner": legacyText("winner", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "startBetTime": bigint("startBetTime", { mode: "bigint" }),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "ended": integer("ended"),
  "betNumA": bigint("betNumA", { mode: "bigint" }),
  "betNumB": bigint("betNumB", { mode: "bigint" }),
  "oddsA": legacyNumber("oddsA", {"sqlType":"numeric(20,2)"}),
  "oddsB": legacyNumber("oddsB", {"sqlType":"numeric(20,2)"}),
}, (table) => [
  primaryKey({ name: "soccer_match_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("soccer_match_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("soccer_match_idx_sbt").on(sql.raw("\"startBetTime\"")),
  index("soccer_match_idx_st").on(sql.raw("\"startTime\"")),
]);
