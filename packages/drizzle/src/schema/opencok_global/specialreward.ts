import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const specialreward = opencok_global.table("specialreward", {
  "gameuid": varchar("gameuid", { length: 100 }).notNull().default(sql.raw("''")),
  "type": varchar("type", { length: 40 }).notNull().default(sql.raw("''")),
  "state": integer("state").default(sql.raw("0")),
  "sendTime": bigint("sendTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "specialreward_PRIMARY", columns: [table["gameuid"], table["type"]] }),
]);
