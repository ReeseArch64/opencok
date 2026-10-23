// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_neutral = cokdb1.table("user_neutral", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "serverid": integer("serverid").default(sql.raw("0")),
  "collectload": integer("collectload").default(sql.raw("0")),
  "collecttime": bigint("collecttime", { mode: "bigint" }).default(sql.raw("0")),
  "score": legacyNumber("score", {"sqlType":"double precision"}).default(sql.raw("0")),
  "leaveTime": bigint("leaveTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_neutral_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_neutral_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
