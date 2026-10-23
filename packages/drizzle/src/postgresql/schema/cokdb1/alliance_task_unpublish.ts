// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_task_unpublish = cokdb1.table("alliance_task_unpublish", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "taskId": legacyText("taskId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "publishUid": legacyText("publishUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "stat": integer("stat").default(sql.raw("0")),
  "vanishTime": bigint("vanishTime", { mode: "bigint" }),
  "finishTime": bigint("finishTime", { mode: "bigint" }),
  "acceptReward": legacyText("acceptReward", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "baseReward": legacyText("baseReward", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "extraReward": legacyText("extraReward", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "alliance_task_unpublish_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("alliance_task_unpublish_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_task_unpublish_pub_idx").on(sql.raw("rtrim(\"publishUid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
