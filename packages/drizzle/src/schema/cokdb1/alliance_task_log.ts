import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const alliance_task_log = cokdb1.table("alliance_task_log", {
  "uuid": varchar("uuid", { length: 255 }).notNull(),
  "uid": varchar("uid", { length: 255 }),
  "castleLevel": integer("castleLevel"),
  "level": integer("level"),
  "taskId": integer("taskId"),
  "color": integer("color"),
  "createTime": bigint("createTime", { mode: "bigint" }),
  "behavior": integer("behavior").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_task_log_PRIMARY", columns: [table["uuid"]] }),
  index("alliance_task_log_castle_color").on(sql.raw("\"castleLevel\""), sql.raw("\"color\"")),
  index("alliance_task_log_level_index").on(sql.raw("\"level\"")),
  index("alliance_task_log_color_index").on(sql.raw("\"color\"")),
  index("alliance_task_log_castle_index").on(sql.raw("\"castleLevel\"")),
]);
