// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const cross_promotion_update_task = cokdb1.table("cross_promotion_update_task", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "taskid": legacyText("taskid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "taskType": integer("taskType").notNull(),
  "curValue": integer("curValue").notNull().default(sql.raw("0")),
  "getRewardSign": integer("getRewardSign").notNull().default(sql.raw("0")),
  "acceptTime": bigint("acceptTime", { mode: "bigint" }),
  "finishTime": bigint("finishTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "cross_promotion_update_task_PRIMARY", columns: [table["uid"], table["taskid"]] }),
  uniqueIndex("cross_promotion_update_task_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"taskid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
