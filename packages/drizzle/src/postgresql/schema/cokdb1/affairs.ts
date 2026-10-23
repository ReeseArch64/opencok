// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const affairs = cokdb1.table("affairs", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull(),
  "ownerId": legacyText("ownerId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "affairId": legacyText("affairId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "contentsId": legacyText("contentsId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "rewardTime": bigint("rewardTime", { mode: "bigint" }).notNull(),
  "rewardNum": integer("rewardNum").notNull(),
  "opt": integer("opt").notNull(),
}, (table) => [
  primaryKey({ name: "affairs_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("affairs_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("affairs_index_type").on(sql.raw("\"type\""), sql.raw("\"rewardTime\"")),
]);
