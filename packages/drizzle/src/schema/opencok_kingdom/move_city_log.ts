import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const move_city_log = opencok_kingdom.table("move_city_log", {
  "pointId": integer("pointId").notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "x": integer("x"),
  "y": integer("y"),
  "count": integer("count"),
  "uids": varchar("uids", { length: 1000 }),
}, (table) => [
  primaryKey({ name: "move_city_log_PRIMARY", columns: [table["pointId"], table["time"]] }),
]);
