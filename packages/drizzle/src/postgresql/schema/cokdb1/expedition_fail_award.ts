// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const expedition_fail_award = cokdb1.table("expedition_fail_award", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "score": legacyNumber("score", {"sqlType":"double precision"}).default(sql.raw("0")),
  "rewardId": legacyText("rewardId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "rank": integer("rank").notNull(),
}, (table) => [
  primaryKey({ name: "expedition_fail_award_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("expedition_fail_award_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
