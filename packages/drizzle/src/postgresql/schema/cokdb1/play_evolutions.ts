// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyTemporal, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const play_evolutions = cokdb1.table("play_evolutions", {
  "id": integer("id").notNull(),
  "hash": legacyText("hash", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "applied_at": legacyTemporal("applied_at").notNull().default(sql.raw("legacy_meta.utc_now(0)")),
  "apply_script": legacyText("apply_script", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "revert_script": legacyText("revert_script", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "state": legacyText("state", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "last_problem": legacyText("last_problem", {"sqlType":"text","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "play_evolutions_PRIMARY", columns: [table["id"]] }),
  check("play_evolutions_applied_at_temporal", sql.raw("legacy_meta.valid_temporal(\"applied_at\", 'timestamp', 0)")),
]);
