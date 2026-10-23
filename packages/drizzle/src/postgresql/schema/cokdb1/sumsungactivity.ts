// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const sumsungactivity = cokdb1.table("sumsungactivity", {
  "uid": legacyText("uid", {"sqlType":"character varying(70)","collation":"legacy_meta.ci"}).notNull(),
  "deviceID": legacyText("deviceID", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "sumsungactivity_PRIMARY", columns: [table["uid"], table["deviceID"]] }),
  uniqueIndex("sumsungactivity_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"deviceID\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
