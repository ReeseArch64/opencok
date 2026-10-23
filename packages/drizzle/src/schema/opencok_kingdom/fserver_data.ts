import { primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const fserver_data = opencok_kingdom.table(
  "fserver_data",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "value": text("value"),
  },
  (table) => [primaryKey({ name: "fserver_data_PRIMARY", columns: [table["uid"]] })],
);
