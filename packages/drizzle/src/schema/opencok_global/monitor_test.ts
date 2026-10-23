import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const monitor_test = opencok_global.table("monitor_test", {
  "id": bigint("id", { mode: "bigint" }).notNull().generatedByDefaultAsIdentity({"name":"monitor_test_id_seq","startWith":1}),
  "value": varchar("value", { length: 255 }),
}, (table) => [
  primaryKey({ name: "monitor_test_PRIMARY", columns: [table["id"]] }),
]);
