// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const world_res_record = cokdb1.table("world_res_record", {
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "id": integer("id").notNull(),
  "x": integer("x").notNull(),
  "y": integer("y").notNull(),
  "areaId": integer("areaId").notNull(),
  "level": integer("level"),
  "pointItem": legacyText("pointItem", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "world_res_record_PRIMARY", columns: [table["time"], table["id"]] }),
]);
