// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_onlinereward = cokdb1.table("user_onlinereward", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "online": bigint("online", { mode: "bigint" }).default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).default(sql.raw("0")),
  "use": bigint("use", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_onlinereward_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_onlinereward_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
