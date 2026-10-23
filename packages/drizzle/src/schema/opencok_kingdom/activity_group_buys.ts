import { bigint, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const activity_group_buys = opencok_kingdom.table("activity_group_buys", {
  "id": varchar("id", { length: 40 }).notNull(),
  "curRound": integer("curRound").notNull(),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "roundInfo": text("roundInfo"),
}, (table) => [
  primaryKey({ name: "activity_group_buys_PRIMARY", columns: [table["id"]] }),
]);
