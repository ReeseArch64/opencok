// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const server_activity = cokdb1.table("server_activity", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "id": integer("id").notNull(),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "rewad": integer("rewad").default(sql.raw("0")),
  "events": legacyText("events", {"sqlType":"character varying(500)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "server_activity_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("server_activity_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
