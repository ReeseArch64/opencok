// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const queue = cokdb1.table("queue", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "ownerId": legacyText("ownerId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "qid": integer("qid").notNull(),
  "type": integer("type").notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }).notNull(),
  "updateTime": bigint("updateTime", { mode: "bigint" }).notNull(),
  "isHelped": integer("isHelped"),
  "para": integer("para").default(sql.raw("0")),
  "totalTime": bigint("totalTime", { mode: "bigint" }).default(sql.raw("0")),
  "exchgType": smallint("exchgType").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "queue_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("queue_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("queue_ownerId_index_001").on(sql.raw("rtrim(\"ownerId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("queue_updateTime_index").on(sql.raw("\"updateTime\"")),
  check("queue_exchgType_range", sql.raw("\"exchgType\" BETWEEN -128 AND 127")),
]);
