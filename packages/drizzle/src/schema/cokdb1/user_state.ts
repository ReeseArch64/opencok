import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_state = cokdb1.table("user_state", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "stateId": integer("stateId").notNull(),
  "startTime": bigint("startTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).notNull(),
  "type": integer("type").default(sql.raw("0")),
  "type2": integer("type2").default(sql.raw("0")),
  "groupType": integer("groupType").default(sql.raw("0")),
  "ranEffId": integer("ranEffId"),
  "ranEffValue": integer("ranEffValue"),
  "property1": varchar("property1", { length: 50 }),
  "property2": varchar("property2", { length: 50 }),
  "count": integer("count").notNull().default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "user_state_PRIMARY", columns: [table["uid"], table["stateId"]] }),
  index("user_state_index_uid_type2").on(sql.raw("\"uid\""), sql.raw("\"type2\"")),
  index("user_state_index_uid_stateId").on(sql.raw("\"uid\""), sql.raw("\"stateId\"")),
  index("user_state_index_stateId").on(sql.raw("\"stateId\"")),
]);
