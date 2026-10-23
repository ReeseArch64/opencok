// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const exchange_group_type = cokdb1.table("exchange_group_type", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "group_type": integer("group_type").notNull().default(sql.raw("0")),
  "id": integer("id"),
  "refreshtime": bigint("refreshtime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "exchange_group_type_PRIMARY", columns: [table["uid"], table["group_type"]] }),
  uniqueIndex("exchange_group_type_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"group_type\"")),
]);
