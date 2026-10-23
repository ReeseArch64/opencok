// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const cross_promotion_status = cokdb1.table("cross_promotion_status", {
  "srcGameId": legacyText("srcGameId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "targetGameId": legacyText("targetGameId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "srcUid": legacyText("srcUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "targetUid": legacyText("targetUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "taskid": legacyText("taskid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "taskType": integer("taskType").notNull(),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "curValue": integer("curValue").notNull().default(sql.raw("0")),
  "maxValue": integer("maxValue").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "cross_promotion_status_PRIMARY", columns: [table["srcGameId"], table["targetUid"], table["taskid"]] }),
  uniqueIndex("cross_promotion_status_PRIMARY_pad").on(sql.raw("rtrim(\"srcGameId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"targetUid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"taskid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
