// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const deposit_record_2 = cokdb1.table("deposit_record_2", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "operate": integer("operate").notNull().default(sql.raw("0")),
  "type": integer("type").notNull().default(sql.raw("0")),
  "num": integer("num").notNull().default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "withDrawTime": bigint("withDrawTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "deposit_record_2_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("deposit_record_2_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
