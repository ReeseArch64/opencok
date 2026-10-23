// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_branch_city_info = cokdb1.table("user_branch_city_info", {
  "uid": legacyText("uid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}).notNull(),
  "openstate": smallint("openstate").notNull(),
  "takerewardcount": integer("takerewardcount").notNull(),
  "takerewardtime": bigint("takerewardtime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_branch_city_info_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_branch_city_info_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
