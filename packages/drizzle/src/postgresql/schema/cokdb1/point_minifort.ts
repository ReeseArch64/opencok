// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";
export const point_minifort = cokdb1.table("point_minifort", {
  "pointId": integer("pointId").notNull(),
  "fortPointId": integer("fortPointId").notNull(),
}, (table) => [
  primaryKey({ name: "point_minifort_PRIMARY", columns: [table["pointId"], table["fortPointId"]] }),
]);
