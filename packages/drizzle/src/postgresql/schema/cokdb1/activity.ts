// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const activity = cokdb1.table("activity", {
  "id": bigint("id", { mode: "number" }).notNull(),
  "name": legacyText("name", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "type": integer("type").notNull(),
  "openTime": bigint("openTime", { mode: "bigint" }),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "info1": legacyText("info1", {"sqlType":"character varying(60)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "activity_PRIMARY", columns: [table["id"]] }),
  check("activity_id_range", sql.raw("\"id\" >= 0 AND \"id\" <= 4294967295")),
]);
