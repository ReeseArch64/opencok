// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_honor = cokdb1.table("user_honor", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "id": legacyText("id", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "level": integer("level"),
}, (table) => [
  primaryKey({ name: "user_honor_PRIMARY", columns: [table["uid"], table["id"]] }),
  uniqueIndex("user_honor_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
