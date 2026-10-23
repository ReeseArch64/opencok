import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const expedition_record = opencok_kingdom.table("expedition_record", {
  "uuid": varchar("uuid", { length: 255 }).notNull(),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "type": integer("type").notNull(),
  "targetServerName": varchar("targetServerName", { length: 255 }).notNull(),
  "targetServerId": integer("targetServerId").notNull(),
  "kingUid": varchar("kingUid", { length: 255 }),
  "kingUserName": varchar("kingUserName", { length: 255 }),
}, (table) => [
  primaryKey({ name: "expedition_record_PRIMARY", columns: [table["uuid"]] }),
  index("expedition_record_time_index").on(sql.raw("\"time\"")),
]);
