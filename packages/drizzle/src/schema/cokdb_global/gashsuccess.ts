import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const gashsuccess = cokdb_global.table("gashsuccess", {
  "tradeid": bigint("tradeid", { mode: "bigint" }).notNull(),
  "finishTime": bigint("finishTime", { mode: "bigint" }).notNull(),
  "type": varchar("type", { length: 20 }),
  "confirm": integer("confirm").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "gashsuccess_PRIMARY", columns: [table["tradeid"]] }),
]);
