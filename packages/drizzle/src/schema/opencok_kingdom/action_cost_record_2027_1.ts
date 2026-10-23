import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const action_cost_record_2027_1 = opencok_kingdom.table(
  "action_cost_record_2027_1",
  {
    "uuid": varchar("uuid", { length: 40 }).notNull(),
    "uid": varchar("uid", { length: 40 }).notNull(),
    "action_type": integer("action_type").notNull(),
    "cost_type": varchar("cost_type", { length: 255 }),
    "cost_value": varchar("cost_value", { length: 255 }),
    "get_type": varchar("get_type", { length: 255 }),
    "get_value": varchar("get_value", { length: 255 }),
    "param1": varchar("param1", { length: 255 }),
    "param2": varchar("param2", { length: 255 }),
    "update_time": bigint("update_time", { mode: "bigint" }).notNull(),
  },
  (table) => [primaryKey({ name: "action_cost_record_2027_1_PRIMARY", columns: [table["uuid"]] })],
);
