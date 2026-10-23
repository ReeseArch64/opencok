// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_snowball = cokdb1.table("user_snowball", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "curLevel": integer("curLevel"),
  "lastThrowTime": bigint("lastThrowTime", { mode: "bigint" }),
  "todayThrowCount": integer("todayThrowCount"),
  "lastBuyTime": bigint("lastBuyTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_snowball_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_snowball_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
