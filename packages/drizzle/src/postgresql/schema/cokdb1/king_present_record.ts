// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const king_present_record = cokdb1.table("king_present_record", {
  "toUserId": legacyText("toUserId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "presentId": integer("presentId").notNull(),
  "presentNameId": integer("presentNameId").notNull(),
  "sendTime": bigint("sendTime", { mode: "bigint" }).notNull(),
  "abbr": legacyText("abbr", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "king_present_record_PRIMARY", columns: [table["toUserId"]] }),
  uniqueIndex("king_present_record_PRIMARY_pad").on(sql.raw("rtrim(\"toUserId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
