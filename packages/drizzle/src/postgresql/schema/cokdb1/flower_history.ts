// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const flower_history = cokdb1.table("flower_history", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "sourceID": legacyText("sourceID", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "targetID": legacyText("targetID", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "timeVal": bigint("timeVal", { mode: "bigint" }),
  "itemID": integer("itemID"),
  "count": integer("count"),
}, (table) => [
  primaryKey({ name: "flower_history_PRIMARY", columns: [table["uid"], table["sourceID"], table["targetID"]] }),
  uniqueIndex("flower_history_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"sourceID\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"targetID\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
