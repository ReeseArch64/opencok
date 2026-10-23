import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const super_army_log = opencok_kingdom.table("super_army_log", {
  "uuid": varchar("uuid", { length: 255 }).notNull(),
  "uid": varchar("uid", { length: 255 }),
  "castleLevel": integer("castleLevel"),
  "level": integer("level"),
  "createTime": bigint("createTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "super_army_log_PRIMARY", columns: [table["uuid"]] }),
  index("super_army_log_createTime_index").on(sql.raw("\"createTime\"")),
  index("super_army_log_uid_index").on(sql.raw("\"uid\"")),
]);
