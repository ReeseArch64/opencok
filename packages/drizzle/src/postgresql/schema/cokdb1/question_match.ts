// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const question_match = cokdb1.table("question_match", {
  "id": legacyText("id", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "result": legacyText("result", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "startBetTime": bigint("startBetTime", { mode: "bigint" }),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "ended": integer("ended"),
  "betNum": bigint("betNum", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "question_match_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("question_match_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
