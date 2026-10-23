// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const ad_mat = cokdb1.table("ad_mat", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "matId": legacyText("matId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
}, (table) => [
  primaryKey({ name: "ad_mat_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("ad_mat_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("ad_mat_index_query").on(sql.raw("rtrim(\"matId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
