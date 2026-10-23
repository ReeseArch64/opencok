// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_cross_server = cokdb1.table("user_cross_server", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "fromServerId": integer("fromServerId"),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_cross_server_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_cross_server_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
