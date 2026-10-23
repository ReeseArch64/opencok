// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_task_log = cokdb1.table("alliance_task_log", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "castleLevel": integer("castleLevel"),
  "level": integer("level"),
  "taskId": integer("taskId"),
  "color": integer("color"),
  "createTime": bigint("createTime", { mode: "bigint" }),
  "behavior": integer("behavior").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_task_log_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("alliance_task_log_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_task_log_castle_color").on(sql.raw("\"castleLevel\""), sql.raw("\"color\"")),
  index("alliance_task_log_level_index").on(sql.raw("\"level\"")),
  index("alliance_task_log_color_index").on(sql.raw("\"color\"")),
  index("alliance_task_log_castle_index").on(sql.raw("\"castleLevel\"")),
]);
