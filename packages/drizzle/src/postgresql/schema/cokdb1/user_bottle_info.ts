// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_bottle_info = cokdb1.table("user_bottle_info", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "throwRemainCount": integer("throwRemainCount").notNull().default(sql.raw("0")),
  "pickRemainCount": integer("pickRemainCount").notNull().default(sql.raw("0")),
  "myBottleNum": integer("myBottleNum").notNull().default(sql.raw("0")),
  "lastClearTime": bigint("lastClearTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "pickBottlesUidsByteArray": legacyBytes("pickBottlesUidsByteArray"),
}, (table) => [
  primaryKey({ name: "user_bottle_info_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_bottle_info_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_bottle_info_pickBottlesUidsByteArray_length", sql.raw("octet_length(\"pickBottlesUidsByteArray\") <= 65535")),
]);
