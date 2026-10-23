// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_task = cokdb1.table("alliance_task", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "taskId": legacyText("taskId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "publishUid": legacyText("publishUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "acceptUid": legacyText("acceptUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "vanishTime": bigint("vanishTime", { mode: "bigint" }),
  "finishTime": bigint("finishTime", { mode: "bigint" }),
  "publishStat": integer("publishStat").default(sql.raw("0")),
  "acceptStat": integer("acceptStat"),
  "acceptReward": legacyText("acceptReward", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "baseReward": legacyText("baseReward", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "extraReward": legacyText("extraReward", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
  "publishTime": bigint("publishTime", { mode: "bigint" }).default(sql.raw("0")),
  "freequeue": integer("freequeue").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_task_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("alliance_task_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_task_al_idx").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_task_publish_idx").on(sql.raw("rtrim(\"publishUid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_task_accept_idx").on(sql.raw("rtrim(\"acceptUid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
