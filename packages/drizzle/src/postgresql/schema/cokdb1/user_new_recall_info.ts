// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_new_recall_info = cokdb1.table("user_new_recall_info", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "type": integer("type"),
  "initTime": bigint("initTime", { mode: "bigint" }),
  "country": legacyText("country", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "catsleLv": integer("catsleLv"),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
  "count": integer("count"),
  "extra": legacyText("extra", {"sqlType":"text","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_new_recall_info_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_new_recall_info_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
