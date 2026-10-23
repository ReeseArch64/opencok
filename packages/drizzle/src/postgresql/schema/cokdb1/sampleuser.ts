// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const sampleuser = cokdb1.table("sampleuser", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "regTime": bigint("regTime", { mode: "bigint" }).notNull(),
  "tag": integer("tag").notNull(),
}, (table) => [
  primaryKey({ name: "sampleuser_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("sampleuser_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("sampleuser_tag_index").on(sql.raw("\"tag\"")),
]);
