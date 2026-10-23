import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const risk_setting = cokdb_global.table("risk_setting", {
  "id": varchar("id", { length: 40 }).notNull(),
  "k1": integer("k1"),
  "k2": integer("k2"),
  "k3": integer("k3"),
}, (table) => [
  primaryKey({ name: "risk_setting_PRIMARY", columns: [table["id"]] }),
]);
