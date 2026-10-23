import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const server_activity = opencok_kingdom.table(
  "server_activity",
  {
    "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
    "id": integer("id").notNull(),
    "startTime": bigint("startTime", { mode: "bigint" }),
    "endTime": bigint("endTime", { mode: "bigint" }),
    "rewad": integer("rewad").default(sql.raw("0")),
    "events": varchar("events", { length: 500 }),
  },
  (table) => [primaryKey({ name: "server_activity_PRIMARY", columns: [table["uid"]] })],
);
