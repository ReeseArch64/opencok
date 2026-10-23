import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const logging_event_stat = opencok_global.table("logging_event_stat", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({"name":"logging_event_stat_id_seq","startWith":1}),
  "count": integer("count").default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "logging_event_stat_PRIMARY", columns: [table["id"]] }),
]);
