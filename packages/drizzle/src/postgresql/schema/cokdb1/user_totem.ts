// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_totem = cokdb1.table("user_totem", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "totemId": integer("totemId").notNull(),
  "putTime": bigint("putTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_totem_PRIMARY", columns: [table["uid"], table["totemId"]] }),
  uniqueIndex("user_totem_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"totemId\"")),
]);
