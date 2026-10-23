// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const princess_task_stat = cokdb1.table("princess_task_stat", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "userId": legacyText("userId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "taskId": integer("taskId").notNull(),
  "taskType": integer("taskType").notNull(),
  "acceptTime": bigint("acceptTime", { mode: "bigint" }).notNull(),
  "state": integer("state").notNull(),
  "param1": bigint("param1", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "princess_task_stat_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("princess_task_stat_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("princess_task_stat_index_type").on(sql.raw("\"state\""), sql.raw("\"taskType\"")),
  index("princess_task_stat_index_param").on(sql.raw("\"state\""), sql.raw("\"param1\"")),
]);
