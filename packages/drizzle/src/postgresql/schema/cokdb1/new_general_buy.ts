// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const new_general_buy = cokdb1.table("new_general_buy", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "generalId": integer("generalId").notNull(),
  "countType1": integer("countType1").notNull().default(sql.raw("0")),
  "countType2": integer("countType2").notNull().default(sql.raw("0")),
  "countType3": integer("countType3").notNull().default(sql.raw("0")),
  "countType4": integer("countType4").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "new_general_buy_PRIMARY", columns: [table["uid"], table["generalId"]] }),
  uniqueIndex("new_general_buy_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"generalId\"")),
]);
