// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const user_logging_events = cokdb_global.table("user_logging_events", {
  "email": legacyText("email", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "event_id": integer("event_id").notNull(),
  "receiveTime": bigint("receiveTime", { mode: "bigint" }).default(sql.raw("0")),
  "completeTime": bigint("completeTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_logging_events_PRIMARY", columns: [table["email"], table["event_id"]] }),
  uniqueIndex("user_logging_events_PRIMARY_pad").on(sql.raw("rtrim(\"email\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"event_id\"")),
  index("user_logging_events_ULE_EVENTID_INDEX_01").on(sql.raw("\"event_id\"")),
]);
