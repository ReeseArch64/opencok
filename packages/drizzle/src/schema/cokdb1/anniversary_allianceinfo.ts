import { integer } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const anniversary_allianceinfo = cokdb1.table("anniversary_allianceinfo", {
  "num": integer("num").notNull(),
  "allnum": integer("allnum").notNull(),
});
