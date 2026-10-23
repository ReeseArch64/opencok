// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const tree_award = cokdb1.table("tree_award", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "freeCount": integer("freeCount").notNull(),
  "awardCount": integer("awardCount").notNull(),
  "lastFreeTime": bigint("lastFreeTime", { mode: "bigint" }).notNull(),
  "lastAwardTime": bigint("lastAwardTime", { mode: "bigint" }).notNull(),
  "awardMaxCount": integer("awardMaxCount").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "tree_award_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("tree_award_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
