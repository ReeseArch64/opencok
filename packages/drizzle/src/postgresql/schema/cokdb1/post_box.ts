// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const post_box = cokdb1.table("post_box", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "from": legacyText("from", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "publicValue": integer("publicValue"),
  "contents": legacyBytes("contents").notNull(),
  "seal": legacyText("seal", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "time": bigint("time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "post_box_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("post_box_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("post_box_index_from").on(sql.raw("rtrim(\"from\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("post_box_index_time").on(sql.raw("\"time\"")),
  check("post_box_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
]);
