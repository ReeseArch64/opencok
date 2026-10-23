import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const new_expedition = opencok_global.table(
  "new_expedition",
  {
    "uuid": varchar("uuid", { length: 40 }).notNull(),
    "state": integer("state").default(sql.raw("0")),
    "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
    "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
    "count": integer("count").default(sql.raw("0")),
  },
  (table) => [primaryKey({ name: "new_expedition_PRIMARY", columns: [table["uuid"]] })],
);
