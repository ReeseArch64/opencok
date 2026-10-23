// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const move_city_log = cokdb1.table("move_city_log", {
  "pointId": integer("pointId").notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "x": integer("x"),
  "y": integer("y"),
  "count": integer("count"),
  "uids": legacyText("uids", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "move_city_log_PRIMARY", columns: [table["pointId"], table["time"]] }),
]);
