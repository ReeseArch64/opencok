// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_gift_vote = cokdb1.table("user_gift_vote", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "version": integer("version").notNull(),
  "type": integer("type").notNull(),
  "giftId": integer("giftId").notNull(),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_gift_vote_PRIMARY", columns: [table["uid"], table["version"], table["type"], table["giftId"]] }),
  uniqueIndex("user_gift_vote_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"version\""), sql.raw("\"type\""), sql.raw("\"giftId\"")),
]);
