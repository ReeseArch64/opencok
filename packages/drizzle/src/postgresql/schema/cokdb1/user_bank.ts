// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_bank = cokdb1.table("user_bank", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "level": integer("level").notNull().default(sql.raw("0")),
  "deposit": legacyText("deposit", {"sqlType":"text","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_bank_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_bank_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
