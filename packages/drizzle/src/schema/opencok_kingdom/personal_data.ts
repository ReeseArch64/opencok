import { primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const personal_data = opencok_kingdom.table(
  "personal_data",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "value": text("value"),
  },
  (table) => [primaryKey({ name: "personal_data_PRIMARY", columns: [table["uid"]] })],
);
