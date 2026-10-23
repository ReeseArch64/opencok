import { primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const system_data = cokdb1.table("system_data", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "value": text("value"),
}, (table) => [
  primaryKey({ name: "system_data_PRIMARY", columns: [table["uid"]] }),
]);
