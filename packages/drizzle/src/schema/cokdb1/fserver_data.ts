import { primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const fserver_data = cokdb1.table("fserver_data", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "value": text("value"),
}, (table) => [
  primaryKey({ name: "fserver_data_PRIMARY", columns: [table["uid"]] }),
]);
