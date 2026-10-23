// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const hero_kingdom_activity = cokdb_global.table("hero_kingdom_activity", {
  "uuid": integer("uuid").notNull().generatedByDefaultAsIdentity({ name: "hero_kingdom_activity_uuid_seq", startWith: 9000003 }),
  "sid": integer("sid"),
  "delay": legacyText("delay", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "power": legacyText("power", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "hero_kingdom_activity_PRIMARY", columns: [table["uuid"]] }),
]);
