import { bigint, foreignKey, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";
import { logging_event } from "./logging_event";

export const logging_event_property = opencok_global.table("logging_event_property", {
  "event_id": bigint("event_id", { mode: "bigint" }).notNull(),
  "mapped_key": varchar("mapped_key", { length: 254 }).notNull(),
  "mapped_value": text("mapped_value"),
}, (table) => [
  primaryKey({ name: "logging_event_property_PRIMARY", columns: [table["event_id"], table["mapped_key"]] }),
  foreignKey({ name: "logging_event_property_logging_event_property_ibfk_1", columns: [table["event_id"]], foreignColumns: [logging_event["event_id"]] }).onDelete("restrict").onUpdate("restrict"),
]);
