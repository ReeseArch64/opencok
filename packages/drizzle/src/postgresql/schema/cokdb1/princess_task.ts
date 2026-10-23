// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const princess_task = cokdb1.table("princess_task", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "id": legacyText("id", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "num": integer("num").notNull().default(sql.raw("0")),
  "sub": legacyText("sub", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "state": integer("state").notNull().default(sql.raw("0")),
  "type": integer("type").notNull().default(sql.raw("1")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "completeTime": bigint("completeTime", { mode: "bigint" }).default(sql.raw("0")),
  "pop": integer("pop").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "princess_task_PRIMARY", columns: [table["uid"], table["id"]] }),
  uniqueIndex("princess_task_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
