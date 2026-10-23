// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const turret_shooting_task = cokdb1.table("turret_shooting_task", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "turretUid": legacyText("turretUid", {"sqlType":"character varying(255)","collation":"C"}),
  "marchUuid": legacyText("marchUuid", {"sqlType":"character varying(255)","collation":"C"}),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "turret_shooting_task_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("turret_shooting_task_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
  index("turret_shooting_task_uuid_idx").on(sql.raw("rtrim(\"marchUuid\", ' ') COLLATE \"C\"")),
  index("turret_shooting_task_startTime_idx").on(sql.raw("\"startTime\"")),
  index("turret_shooting_task_endTime_idx").on(sql.raw("\"endTime\"")),
  index("turret_shooting_task_uid_idx").on(sql.raw("rtrim(\"turretUid\", ' ') COLLATE \"C\"")),
]);
