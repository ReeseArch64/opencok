// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_expedition_score = cokdb1.table("user_expedition_score", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "score": legacyNumber("score", {"sqlType":"double precision"}).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_expedition_score_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_expedition_score_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
