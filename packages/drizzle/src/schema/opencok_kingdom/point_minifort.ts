import { integer, primaryKey } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const point_minifort = opencok_kingdom.table(
  "point_minifort",
  {
    "pointId": integer("pointId").notNull(),
    "fortPointId": integer("fortPointId").notNull(),
  },
  (table) => [
    primaryKey({
      name: "point_minifort_PRIMARY",
      columns: [table["pointId"], table["fortPointId"]],
    }),
  ],
);
