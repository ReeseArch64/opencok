// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const flower_notice = cokdb1.table("flower_notice", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "addTime": bigint("addTime", { mode: "bigint" }),
  "targetID": legacyText("targetID", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "sourceName": legacyText("sourceName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "sourceID": legacyText("sourceID", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "itemID": legacyText("itemID", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "itemCount": integer("itemCount"),
}, (table) => [
  primaryKey({ name: "flower_notice_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("flower_notice_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
