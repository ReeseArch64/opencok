import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const turret_shooting_task = opencok_kingdom.table(
  "turret_shooting_task",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "turretUid": varchar("turretUid", { length: 255 }),
    "marchUuid": varchar("marchUuid", { length: 255 }),
    "startTime": bigint("startTime", { mode: "bigint" }),
    "endTime": bigint("endTime", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({ name: "turret_shooting_task_PRIMARY", columns: [table["uid"]] }),
    index("turret_shooting_task_uuid_idx").on(sql.raw('"marchUuid"')),
    index("turret_shooting_task_startTime_idx").on(sql.raw('"startTime"')),
    index("turret_shooting_task_endTime_idx").on(sql.raw('"endTime"')),
    index("turret_shooting_task_uid_idx").on(sql.raw('"turretUid"')),
  ],
);
