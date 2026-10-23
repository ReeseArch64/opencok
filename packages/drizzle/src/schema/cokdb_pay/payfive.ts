import { sql } from "drizzle-orm";
import { index, integer, numeric, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_pay } from "../namespaces";

export const payfive = cokdb_pay.table("payfive", {
  "date": varchar("date", { length: 40 }).notNull(),
  "pf": varchar("pf", { length: 20 }).notNull(),
  "country": varchar("country", { length: 20 }).notNull(),
  "paysum": numeric("paysum", { precision: 20, scale: 2, mode: "number" }),
  "paytimes": integer("paytimes"),
}, (table) => [
  primaryKey({ name: "payfive_PRIMARY", columns: [table["date"], table["pf"], table["country"]] }),
  index("payfive_index").on(sql.raw("\"country\"")),
]);
