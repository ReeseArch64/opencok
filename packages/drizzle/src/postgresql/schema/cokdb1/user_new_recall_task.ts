// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_new_recall_task = cokdb1.table("user_new_recall_task", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "taskId": legacyText("taskId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "day": integer("day"),
  "state": integer("state"),
  "targetNum": integer("targetNum"),
  "num": integer("num"),
  "time": bigint("time", { mode: "bigint" }),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_new_recall_task_PRIMARY", columns: [table["uid"], table["taskId"]] }),
  uniqueIndex("user_new_recall_task_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"taskId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
