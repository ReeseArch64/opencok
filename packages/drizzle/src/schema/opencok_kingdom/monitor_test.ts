import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const monitor_test = opencok_kingdom.table(
  "monitor_test",
  {
    "id": bigint("id", { mode: "bigint" })
      .notNull()
      .generatedByDefaultAsIdentity({ "name": "monitor_test_id_seq", "startWith": 1 }),
    "value": varchar("value", { length: 255 }),
  },
  (table) => [primaryKey({ name: "monitor_test_PRIMARY", columns: [table["id"]] })],
);
