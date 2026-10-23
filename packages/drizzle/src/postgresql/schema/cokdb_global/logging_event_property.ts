// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, foreignKey, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
import { logging_event } from "./logging_event";
export const logging_event_property = cokdb_global.table("logging_event_property", {
  "event_id": bigint("event_id", { mode: "bigint" }).notNull(),
  "mapped_key": legacyText("mapped_key", {"sqlType":"character varying(254)","collation":"legacy_meta.ci"}).notNull(),
  "mapped_value": legacyText("mapped_value", {"sqlType":"text","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "logging_event_property_PRIMARY", columns: [table["event_id"], table["mapped_key"]] }),
  uniqueIndex("logging_event_property_PRIMARY_pad").on(sql.raw("\"event_id\""), sql.raw("rtrim(\"mapped_key\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  foreignKey({ name: "logging_event_property_logging_event_property_ibfk_1", columns: [table["event_id"]], foreignColumns: [logging_event["event_id"]] }).onDelete("restrict").onUpdate("restrict"),
]);
