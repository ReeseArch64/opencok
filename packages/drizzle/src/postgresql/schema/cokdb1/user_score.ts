// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_score = cokdb1.table("user_score", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "actId": legacyText("actId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "round": integer("round").default(sql.raw("1")),
  "level": integer("level").default(sql.raw("1")),
  "score": integer("score").default(sql.raw("0")),
  "reward": integer("reward").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_score_PRIMARY", columns: [table["uid"], table["actId"]] }),
  uniqueIndex("user_score_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"actId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_score_index_actId").on(sql.raw("rtrim(\"actId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
