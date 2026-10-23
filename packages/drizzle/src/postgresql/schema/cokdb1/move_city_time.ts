// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const move_city_time = cokdb1.table("move_city_time", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "move_city_time_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("move_city_time_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
